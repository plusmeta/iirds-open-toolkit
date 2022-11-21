<template>
  <v-toolbar :outlined="!$vuetify.theme.dark" class="elevation-2">
    <v-toolbar-title v-if="isFullscreen">
      <v-icon
        class="mx-4"
        large
        left
      >
        {{ icon }}
      </v-icon>
    </v-toolbar-title>
    <v-toolbar-title
      v-if="showTitle"
      class="px-5"
    >
      <span
        :title="title"
        class="subtitle-2 d-block"
        :class="!isFullscreen ? 'truncate-300' : ''"
        style="line-height: 20px"
      >
        {{ title }}
      </span>
      <span class="caption d-block">
        <v-icon v-if="showCaptionTagIcon" small>mdi-tag-outline</v-icon>
        <template v-if="!isFullscreen && !!conformity">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-icon
                v-if="!!conformity"
                class="cursor-pointer"
                left
                small
                v-on="tooltip"
              >
                mdi-checkbox-marked-circle-outline
              </v-icon>
            </template>
            <span>{{ conformity }}</span>
          </v-tooltip>
        </template>
        {{ caption }}
      </span>
    </v-toolbar-title>
    <v-spacer v-if="showTitle" />
    <template v-if="isFullscreen && !!conformity">
      <v-icon left>
        mdi-checkbox-marked-circle-outline
      </v-icon>
      <span>{{ conformity }}</span>
      <v-spacer />
    </template>
    <PageNumberControl
      v-if="showPageNumberControl"
      :value="currentPage"
      :total-pages="totalPages"
      @change="jumpToPagePreview"
      @next="$emit('next', $event)"
      @prev="$emit('prev', $event)"
    />
    <v-spacer />
    <PageZoomControl
      v-if="showZoomControl"
      :value="fullscreenScale"
      :rendering="rendering"
      @change="$emit('zoom', $event)"
      @zoomin="$emit('zoomin')"
      @zoomout="$emit('zoomout')"
    />
    <v-spacer />
    <PageRotationControl
      v-if="showRotationControl"
      :rendering="rendering"
      @rotateleft="$emit('rotateleft')"
      @rotateright="$emit('rotateright')"
    />
    <v-tooltip v-if="showReset" bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="disableReset"
          icon
          @click="$emit('reset')"
          v-on="tooltip"
        >
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Settings.reset") }}</span>
    </v-tooltip>
    <v-spacer v-if="isFullscreen" />
    <v-tooltip v-if="isFullscreen && showPrint" bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          class="mr-4"
          icon
          @click="$emit('print')"
          v-on="tooltip"
        >
          <v-icon>mdi-printer</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.print") }}</span>
    </v-tooltip>
    <v-tooltip v-if="isFullscreen && showDownload" bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          icon
          @click="$emit('download')"
          v-on="tooltip"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.download") }}</span>
    </v-tooltip>
    <v-spacer />
    <v-tooltip v-if="isFullscreen" bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          icon
          @click="$emit('close')"
          v-on="tooltip"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.exitFullscreen") + " (ESC)" }}</span>
    </v-tooltip>
    <v-tooltip v-else top>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          icon
          @click="$emit('display')"
          v-on="tooltip"
        >
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.fullscreen") }}</span>
    </v-tooltip>
  </v-toolbar>
</template>

<script>
import PageNumberControl from "@/shared/inline/PageNumberControl";
import PageZoomControl from "@/shared/inline/PageZoomControl";
import PageRotationControl from "@/shared/inline/PageRotationControl";

import { mapGetters } from "vuex";

export default {
    name: "PDFPreviewHeader",
    components: {
        PageNumberControl,
        PageZoomControl,
        PageRotationControl
    },
    props: {
        isFullscreen: {
            type: Boolean,
            required: true
        },
        isEmbed: {
            type: Boolean,
            required: true
        },
        rendering: {
            type: Boolean,
            required: false,
            default: false
        },
        currentPage: {
            type: Number,
            required: false,
            default: 1
        },
        totalPages: {
            type: Number,
            required: false,
            default: 1
        },
        icon: {
            type: String,
            required: false,
            default: ""
        },
        title: {
            type: String,
            required: false,
            default: ""
        },
        caption: {
            type: String,
            required: false,
            default: ""
        },
        conformity: {
            type: String,
            required: false,
            default: ""
        },
        showCaptionTagIcon: {
            type: Boolean,
            required: false,
            default: false
        },
        showZoomControl: {
            type: Boolean,
            required: false,
            default: false
        },
        showRotationControl: {
            type: Boolean,
            required: false,
            default: false
        },
        showPageNumberControl: {
            type: Boolean,
            required: false,
            default: false
        },
        showReset: {
            type: Boolean,
            required: false,
            default: false
        },
        showDownload: {
            type: Boolean,
            required: false,
            default: false
        },
        showPrint: {
            type: Boolean,
            required: false,
            default: false
        },
        disableReset: {
            type: Boolean,
            required: false,
            default: false
        },
        file: {
            type: Object,
            required: false,
            default: null
        },
        fullscreenScale: {
            type: Number,
            required: false,
            default: 1
        },
        jumpToPagePreview: {
            type: Function,
            required: false,
            default: null
        },
        isSegment: {
            type: Boolean,
            required: false,
            default: false
        },
        isImage: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {
        showTitle() {
            return !!this.file && (this.isFullscreen || this.isImage || (!this.isEmbed && this.$vuetify.breakpoint.xl));
        },
        ...mapGetters("properties", [
            "getPropertyLabelById"
        ]),
    },
    created() {
    },
    methods: {
    }
};
</script>
