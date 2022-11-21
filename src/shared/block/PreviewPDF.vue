<template>
  <div>
    <PreviewHeader
      :is-fullscreen="false"
      :is-embed="embed"
      :rendering="rendering"
      :current-page="pages.current"
      :total-pages="pages.total"
      :file="file"
      :conformity="getConformity"
      :jump-to-page-preview="jumpToPagePreview"
      :title="getTitle"
      :caption="getCaption"
      :show-page-number-control="true"
      @display="displayFullscreen"
      @prev="prevPage"
      @next="nextPage"
    />
    <v-card
      class="ma-0 pa-4"
      color="secondary lighten-2"
      style="height: 100%; overflow-y: auto;"
      tile
    >
      <canvas
        v-show="ready && renderMode"
        ref="thumbnailCanvas"
        class="thumbnail cursor-pointer mx-auto elevation-12"
        :class="{'d-block': ready && renderMode}"
        @click="displayFullscreen()"
      />
      <v-skeleton-loader
        v-if="!ready && renderMode && !showFullscreen"
        :height="thumbnailCanvas.height"
        :width="thumbnailCanvas.width"
        class="mx-auto"
        style="position:relative"
        type="image"
      />
      <v-img
        v-if="!renderMode"
        ref="image"
        :height="thumbnailCanvas.height"
        :src="imageDataURL"
        :width="thumbnailCanvas.width"
        class="cursor-pointer my-0 mx-auto pm-transparent-bg elevation-12"
        contain
        @click="displayFullscreen()"
      >
        <template v-slot:placeholder>
          <v-row
            align="center"
            class="fill-height ma-0"
            justify="center"
          >
            <v-progress-circular
              color="secondary"
              indeterminate
              size="36"
            />
          </v-row>
        </template>
      </v-img>
    </v-card>

    <v-toolbar
      :outlined="!$vuetify.theme.dark"
      height="96px"
      class="pt-6 elevation-2"
    >
      <PreviewFooter
        :initial-cut-segment="cutSegment"
        :current-page="pages.current"
        :current-range="range.current"
        :total-pages="pages.total"
        :ready="ready"
        :embed="embed"
        @changepage="changeSlider($event, false)"
        @changerange="changeRangeSlider($event, false)"
      />
    </v-toolbar>
    <v-dialog
      v-model="showFullscreen"
      class="pdf-dialog-container"
      fullscreen
      @keydown.left="prevPage"
      @keydown.right="nextPage"
      @keydown.esc="closeFullscreen"
    >
      <v-card class="pdf-dialog-container">
        <PreviewHeader
          :is-fullscreen="true"
          :is-embed="embed"
          :rendering="rendering"
          :current-page="pages.current"
          :total-pages="pages.total"
          :file="file"
          :conformity="getConformity"
          :jump-to-page-preview="jumpToPagePreview"
          :fullscreen-scale="fullscreenScale"
          icon="mdi-file-outline"
          :title="getTitle"
          :caption="getCaption"
          :show-page-number-control="true"
          :show-zoom-control="true"
          :show-rotation-control="true"
          :show-download="true"
          @prev="prevPage"
          @next="nextPage"
          @zoomin="zoomStep(0.2)"
          @zoomout="zoomStep(-0.2)"
          @zoom="zoomViaSlider"
          @rotateleft="rotatePage(-90)"
          @rotateright="rotatePage(90)"
          @download="downloadPDF"
          @close="closeFullscreen"
        />

        <v-card
          class="pdf-viewer-container ma-0 pa-12 d-block"
          tile
          @mousewheel="zoomViaWheel"
        >
          <div :style="getRotationStyle">
            <div
              ref="textlayer"
              class="textLayer"
            />
            <canvas
              v-show="ready"
              ref="fullscreenCanvas"
              class="elevation-12"
            />
          </div>
        </v-card>
        <v-skeleton-loader
          v-if="!ready"
          :height="fullscreenCanvas.height"
          :width="fullscreenCanvas.width"
          class="mx-auto"
          style="position:relative"
          type="image"
        />
      </v-card>

      <v-toolbar
        bottom
        dense
        prominent
        :outlined="!$vuetify.theme.dark"
        class="pt-8"
        style="position: absolute"
      >
        <PreviewFooter
          :current-page="pages.current"
          :total-pages="pages.total"
          @changepage="changeSlider($event, true)"
          @changerange="changeRangeSlider($event, true)"
        />
      </v-toolbar>
    </v-dialog>
  </div>
</template>

<script>
import util from "@/util";
import pdfUtil from "@/util/pdf-util";
import imgUtil from "@/util/image-util";
import PreviewFooter from "@/shared/block/PreviewFooter";
import PreviewHeader from "@/shared/block/PreviewHeader";

import { mapActions, mapGetters } from "vuex";

import "@/shared/styles/pdf.css";

export default {
    name: "PlusPreviewPDF",
    components: {
        PreviewFooter,
        PreviewHeader
    },
    props: {
        file: {
            type: Object,
            required: true
        },
        embed: {
            type: Boolean,
            default: false
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
            showFullscreen: false,
            fullscreenScale: null,
            pageRotation: 0,
            initialFullscreenFactor: 0.7,
            speeddial: false,
            pages: {
                total: 1,
                current: 1
            },
            range: {
                cached: [1, 1],
                current: [1, 1]
            },
            segmentation: false,
            cutSegment: false,
            cutSegmentFS: false,
            thumbnail: {
                height: null,
                width: null
            },
            thumbnailCanvas: {
                initialHeight: 400,
                initialWidth: 282,
                height: null,
                width: null
            },
            fullscreenCanvas: {
                height: null,
                width: null
            },
            previewPanning: false,
            paramsChanged: false,
            xoff: 0,
            yoff: 0,
            start: { x: 0, y: 0 }
        };
    },
    computed: {
        getTitle() {
            return util.getSourceName(this.file);
        },
        getCaption() {
            let sourceType = util.getSourceType(this.file);
            if (sourceType) {
                return this.getPropertyLabelById(sourceType) + " • " +
                    util.getSourceSize(this.file, this);
            } else {
                return util.getSourceSize(this.file, this);
            }
        },
        getConformity() {
            const confInfo = util.getMetadataValue(this.file, "plus:Conformity");
            return (Array.isArray(confInfo)) ? confInfo[0] : confInfo;
        },
        isPrevPage() {
            return this.pages.current > 1 && !this.noSource;
        },
        isNextPage() {
            return this.pages.current < this.pages.total && !this.noSource;
        },
        getSegmentationConfig() {
            const concept = this.getPropertiesByRole("plus:SegmentationProperty").map((prop) => {
                return prop.identifier;
            })[0];
            const relations = (concept) ?
                this.getPropertyRelationById(concept, "plus:has-relations") : [];
            return (!relations.length) ? concept : relations[0];
        },
        getSourceName() {
            return (this.file && this.file.source) ? this.file.source.name : this.file.name + ".pdf";
        },
        getRotationStyle() {
            return `transform: rotate(${this.pageRotation}deg); width: fit-content; margin: auto;`;
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
            "getObjectByUuid"
        ]),
        ...mapGetters("projects", [
            "getCurrentProjectUuid"
        ]),
        ...mapGetters("properties", [
            "getPropertiesByRole",
            "getPropertyRelationById",
            "getPropertyLabelById"
        ]),
    },
    async mounted() {
        let source = this.file?.source;
        if (source?.thumbnailUri) {
            this.imageDataURL = await this.$auth.getFile(this.file.source.thumbnailUri, false);
            let dimensions = await imgUtil.getImageDimensions(this.imageDataURL);
            if (dimensions) {
                this.thumbnail.width = dimensions[0];
                this.thumbnail.height = dimensions[1];

                const widthRatio = this.thumbnailCanvas.initialWidth / this.thumbnail.width;
                const heightRatio = this.thumbnailCanvas.initialHeight / this.thumbnail.height;
                const scale = Math.min(widthRatio, heightRatio);

                this.thumbnailCanvas.width = this.thumbnail.width * scale;
                this.thumbnailCanvas.height = this.thumbnail.height * scale;
            }

            this.pages.total = this.getMetadataValueByURI(this.file.uuid, "pdf:totalPages") || 1;
            this.ready = true;
        } else {
            await this.generateNewPreview();
        }
        this.range.current = [1, Math.min(5, this.pages.total)];
        this.range.cached = this.range.current.slice();
    },
    methods: {
        async nextPage() {
            if (this.isNextPage) {
                try {
                    this.ready = false;
                    if (!this.pdf) await this.preparePDF();
                    await this.renderPage(++this.pages.current);
                } catch (e) {
                    this.$notify.send(e, "error", 5);
                }
            }
        },
        async prevPage() {
            if (this.isPrevPage) {
                try {
                    this.ready = false;
                    if (!this.pdf) await this.preparePDF();
                    await this.renderPage(--this.pages.current);
                } catch (e) {
                    this.$notify.send(e, "error", 5);
                }
            }
        },
        async jumpToPagePreview(page) {
            if (!this.pdf) await this.preparePDF();
            if (page > 0 && page <= this.pages.total) {
                this.pages.current = Number(page);
                await this.renderPage(Number(page));
            }
        },
        async preparePDF() {
            this.renderMode = true;
            const data = await this.fetchSource(this.file.uuid);
            if (!data) return this.setFallbackMode(this.file.name, this.file.uuid);
            const arrayBuffer = await util.readFile(data);
            this.pdf = await pdfUtil.getDocument(arrayBuffer);
            this.pages.total = this.pdf.numPages;
        },
        async generateNewPreview() {
            this.ready = false;
            await this.preparePDF();
            await this.renderPage(this.pages.current);
        },
        setFallbackMode(name, uuid) {
            this.pages.current = 1;
            this.renderMode = false;
            this.noSource = true;
            this.ready = true;
            this.$notify.send(`No source available for object: ${name} [${uuid}]`, "info");
        },
        async downloadPDF() {
            let data = await this.fetchSource(this.file.uuid);
            util.downloadBlob(data, this.getSourceName);
        },
        getScale(defaultViewport) {
            if (!this.showFullscreen) {
                const widthRatio = this.thumbnailCanvas.initialWidth / defaultViewport.width;
                const heightRatio = this.thumbnailCanvas.initialHeight / defaultViewport.height;
                return Math.min(widthRatio, heightRatio);
            } else {
                return this.fullscreenScale;
            }
        },
        async setFullscreenScale(nr) {
            if (!this.pdf) return;
            const page = await this.pdf.getPage(nr);
            const defaultViewport = page.getViewport({ scale: 1 });
            const widthRatio = window.innerWidth / defaultViewport.width;
            const heightRatio = window.innerHeight / defaultViewport.height;
            this.fullscreenScale = Math.min(widthRatio, heightRatio) * this.initialFullscreenFactor;
        },
        async renderPage(nr) {
            if (!this.pdf) return;
            if (this.rendering) return;

            this.rendering = true;

            const page = await this.pdf.getPage(nr);
            const defaultViewport = page.getViewport({ scale: 1 });
            const scale = this.getScale(defaultViewport);

            const target = this.showFullscreen ? "fullscreenCanvas" : "thumbnailCanvas";
            const canvas = this.$refs[target];

            if (!canvas) {
                this.rendering = false;
                return;
            }

            this[target].width = canvas.width = defaultViewport.width * scale;
            this[target].height = canvas.height = defaultViewport.height * scale;

            const renderViewport = page.getViewport({ scale });

            const renderContext = {
                canvasContext: canvas.getContext("2d"),
                viewport: renderViewport
            };

            await page.render(renderContext).promise;

            this.ready = true;

            if (this.showFullscreen) {
                const textContent = await page.getTextContent();
                const textLayerEl = this.$refs.textlayer;
                textLayerEl.style = `height: ${canvas.height}px; width: ${canvas.width}px`;
                await pdfUtil.renderText(textContent, textLayerEl, renderViewport);

            }

            this.rendering = false;
        },
        rotatePage(degs) {
            this.pageRotation += degs;
        },
        zoomStep(step) {
            this.fullscreenScale =  this.fullscreenScale + step;
            this.renderPage(this.pages.current);
        },
        zoomViaSlider(e) {
            this.fullscreenScale = e;
            this.renderPage(this.pages.current);
        },
        async zoomViaWheel(e) {
            if (e.ctrlKey) {
                e.preventDefault();
                let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
                // get scroll direction & set zoom level
                (delta > 0) ? (this.fullscreenScale += 0.2) : (this.fullscreenScale -= 0.2);

                await this.renderPage(this.pages.current);
            }
        },
        async changeRangeSlider(val) {
            this.range.current = val;
            if (this.range.current[0] !== this.range.cached[0]) {
                await this.renderPage(this.range.current[0]);
            }
            if (this.range.current[1] !== this.range.cached[1]) {
                await this.renderPage(this.range.current[1]);
            }

            this.range.cached = this.range.current.slice();
        },
        async changeSlider(val) {
            if ((!this.showFullscreen && this.cutSegment) ||
                (this.showFullscreen && this.cutSegmentFS)) return;
            this.pages.current = val;
            this.$set(this.range.current, 0, val);
            this.$set(this.range.current, 1, Math.min(val + 6, this.pages.total));
            await this.generateNewPreview();
        },
        async displayFullscreen() {
            this.ready = false; // show skeleton while loading fullscreen
            this.segmentation = false;
            this.cutSegment = false;
            if (!this.pdf) {
                await this.preparePDF();
            }
            await this.setFullscreenScale(this.pages.current);
            this.ready = true; // prevent skeleton flicker
            this.showFullscreen = true;
            await this.renderPage(this.pages.current);
        },
        async closeFullscreen() {
            this.segmentation = false;
            this.cutSegmentFS = false;
            this.showFullscreen = false;
            await this.renderPage(this.pages.current);
        },
        ...mapActions("task", [
            "addTask"
        ]),
        ...mapActions("storage", [
            "fetchSource",
            "saveObjectLocal",
            "saveObjectsToProjectRemote"
        ])
    }
};
</script>
