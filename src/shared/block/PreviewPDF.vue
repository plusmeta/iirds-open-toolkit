<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <div>
    <v-layout wrap>
      <v-flex
        xs12
        class="text-center"
        style="overflow-x: auto;"
      >
        <canvas
          v-show="ready && renderMode"
          ref="thumbnail"
          class="thumbnail"
          style="position:relative"
          @click="previewFile()"
        />
        <img
          v-if="!renderMode"
          class="thumbnail"
          :src="imageDataURL"
          style="position:relative"
          @click="previewFile()"
        >
        <v-skeleton-loader
          v-show="!ready && renderMode"
          class="mx-auto"
          :height="thumbnail.height"
          :width="thumbnail.width"
          type="image"
        />
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs4>
        <v-btn
          block text
          :disabled="!isPrevPage || rendering"
          @click="prevPage()"
        >
          <v-icon>
            mdi-arrow-left
          </v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs4>
        <v-btn
          block text
          disabled
        >
          {{ pages.current }} / {{ pages.total }}
        </v-btn>
      </v-flex>
      <v-flex xs4>
        <v-btn
          block text
          :disabled="!isNextPage || rendering"
          @click="nextPage()"
        >
          <v-icon>
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="showPreview"
      fullscreen
      @keydown.left="prevPage('preview', previewScale)"
      @keydown.right="nextPage('preview', previewScale)"
      @keydown.esc="closePreview"
    >
      <v-card class="pa-0 flex-container">
        <v-card-title class="py-0">
          {{ $t("Common.preview") }}: {{ file.name }}
          <v-spacer />
          <v-btn
            icon
            large
            :disabled="rendering"
            @click="previewScale -= 0.1; previewFile();"
          >
            <v-icon>mdi-magnify-minus</v-icon>
          </v-btn>
          <v-slider
            v-model="previewScale"
            color="primary"
            :min="0.2"
            :max="2.2"
            :step="0.1"
            class="mt-4"
            :disabled="rendering"
            @change="previewFile()"
          />
          <v-btn
            icon
            large
            :disabled="rendering"
            @click="previewScale += 0.1; previewFile();"
          >
            <v-icon>mdi-magnify-plus</v-icon>
          </v-btn>
          <v-spacer />
          <v-icon
            large
            @click="closePreview"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-progress-linear
          :size="10"
          color="primary"
          :indeterminate="!ready"
        />
        <v-card-text class="pdf-viewer-container">
          <div style="position: absolute;">
            <div :style="`margin:auto; width: unset; margin-top: 50px; min-height: ${preview.height}px`">
              <canvas
                v-show="ready"
                ref="preview"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-layout wrap>
            <v-flex xs4>
              <v-btn
                large
                block
                text
                :disabled="!isPrevPage || rendering"
                @click="prevPage('preview', previewScale)"
              >
                <v-icon large>
                  mdi-arrow-left
                </v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn
                large
                block
                text
                disabled
              >
                {{ pages.current }} / {{ pages.total }}
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn
                large
                block
                text
                :disabled="!isNextPage || rendering"
                @click="nextPage('preview', previewScale)"
              >
                <v-icon large>
                  mdi-arrow-right
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import util from "@/util";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "PlusPreviewPDF",
    props: {
        file: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            ready: false,
            rendering: false,
            imageDataURL: "",
            renderMode: false,
            noSource: false,
            pdf: null,
            showPreview: false,
            previewScale: 0.8,
            pages: {
                current: 1,
                total: 0
            },
            thumbnail: {
                height: 500,
                width: 500
            },
            preview: {
                height: 800,
                width: 800
            }
        };
    },
    computed: {
        isPrevPage () {
            return this.pages.current > 1 && !this.noSource;
        },
        isNextPage () {
            return this.pages.current  < this.pages.total && !this.noSource;
        },
        ...mapGetters("storage", ["getMetadataValueByURI"])
    },
    async mounted() {
        let source = this.file?.source;
        if (source?.thumbnailUri) {
            this.imageDataURL = await this.$auth.getFile(this.file.source.thumbnailUri, false);
            this.pages.total = this.getMetadataValueByURI(this.file.uuid, "pdf:totalPages") || 1;
            this.ready = true;
        } else {
            await this.generateNewPreview();
        }
    },
    methods: {
        async nextPage(target, scale) {
            if (this.isNextPage) {
                try {
                    this.ready = false;
                    if (!this.pdf) await this.preparePDF();
                    await this.renderPage(++this.pages.current, target, scale);
                } catch(e) {
                    this.$notify.send(e, "error", 5);
                } finally {
                    this.ready = true;
                }

            }
        },
        async prevPage(target, scale) {
            if (this.isPrevPage) {
                try {
                    this.ready = false;
                    if (!this.pdf) await this.preparePDF();
                    await this.renderPage(--this.pages.current, target, scale);
                } catch(e) {
                    this.$notify.send(e, "error", 5);
                } finally {
                    this.ready = true;
                }
            }
        },
        async preparePDF () {
            this.renderMode = true;
            const data = await this.fetchSource(this.file.uuid);
            if (!data) return this.setFallbackMode();
            const arrayBuffer = await util.readFile(data);
            this.pdf = await util.getDocument(arrayBuffer);
            this.pages.total = this.pdf.numPages;
        },
        async generateNewPreview() {
            this.ready = false;
            await this.preparePDF();
            await this.renderPage(this.pages.current);
            this.ready = true;
        },
        setFallbackMode() {
            this.pages.current = 1;
            this.renderMode = false;
            this.noSource = true;
            this.ready = true;
            this.$notify.send("No source available for object", "info");
        },
        async renderPage(nr, target = "thumbnail", size) {
            if (!this.pdf) return;
            if (this.rendering) return;
            this.rendering = true;
            let page = await this.pdf.getPage(nr);
            let canvas = this.$refs[target];

            if (!!canvas) {
                let viewport = page.getViewport({ scale: 1 });
                let renderSize = (size) ? size * 1000 : 500;

                canvas.width = canvas.height = renderSize;
                const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height);

                this[target].width = canvas.width = Math.min(canvas.width, viewport.width * scale);
                this[target].height = canvas.height = Math.min(canvas.height, viewport.height * scale);

                const renderContext = {
                    canvasContext: canvas.getContext("2d"),
                    viewport: page.getViewport({ scale })
                };

                await page.render(renderContext).promise;
            }
            this.rendering = false;

        },
        async previewFile() {
            this.showPreview = true;
            if (!this.pdf) {
                await this.preparePDF();
            }
            await this.renderPage(this.pages.current, "preview", this.previewScale);
        },
        async closePreview() {
            this.showPreview = false;
            await this.renderPage(this.pages.current, "thumbnail");
        },
        ...mapActions("storage", [
            "fetchSource"
        ])
    }
};
</script>

<style>
    .v-skeleton-loader__image {
        height: 100% !important;
    }
    .flex-container {
        display: flex;
        flex-direction: column;
    }
    .pdf-viewer-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        overflow: auto;
    }
    #thumbnail { cursor: pointer; }
</style>
