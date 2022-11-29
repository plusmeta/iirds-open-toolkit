<template>
  <v-form ref="form">
    <v-row :dense="dense">
      <v-col v-if="getType === 'plus:LongText'">
        <v-textarea
          :value="String(value)"
          :rows="2"
          auto-grow
          prepend-icon="mdi-title"
          :label="getLabel"
          :readonly="isReadonly"
          :disabled="isReadonly"
          :class="{ 'required': required }"
          @change="$emit('setting', {event: $event, uri})"
        >
          <template v-slot:prepend>
            <slot name="icon" :icon="icon || 'mdi-title'">
              <v-icon>{{ icon || 'mdi-title' }}</v-icon>
            </slot>
          </template>
        </v-textarea>
      </v-col>
      <v-col v-else-if="getType === 'plus:String'">
        <v-text-field
          :value="String(value)"
          prepend-icon="mdi-code-string"
          :label="getLabel"
          :readonly="isReadonly"
          :disabled="isReadonly"
          :class="{ 'required': required }"
          @change="$emit('setting', {event: $event, uri})"
        >
          <template v-slot:prepend>
            <slot name="icon" :icon="icon || 'mdi-code-string'">
              <v-icon>{{ icon || 'mdi-code-string' }}</v-icon>
            </slot>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-else-if="getType === 'plus:Hyperlink'">
        <span class="d-inline-block subtitle-2">
          <v-btn
            :href="String(value)"
            target="_blank"
            class="ml-6 mb-4"
            color="primary"
            outlined
          >
            <v-icon left>
              mdi-bookmark-outline
            </v-icon>
            {{ getLabel }}
          </v-btn>
        </span>
      </v-col>
      <v-col v-else-if="getType === 'plus:Number'">
        <v-text-field
          :value="Number(value)"
          type="number"
          prepend-icon="mdi-numeric"
          :label="getLabel"
          :readonly="isReadonly"
          :disabled="isReadonly"
          :class="{ 'required': required }"
          @change="$emit('setting', {event: $event, uri})"
        >
          <template v-slot:prepend>
            <slot name="icon" :icon="icon || 'mdi-numeric'">
              <v-icon>{{ icon || 'mdi-numeric' }}</v-icon>
            </slot>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-else-if="getType === 'plus:Boolean'">
        <v-switch
          color="primary"
          :input-value="Boolean(value)"
          hide-details
          :label="getLabel"
          :readonly="isReadonly"
          :disabled="isReadonly"
          @change="$emit('setting', {event: !!$event, uri})"
        />
      </v-col>
      <v-col v-else>
        <v-icon
          left
          :title="$t('Common.unknown')"
        >
          mdi-help-box
        </v-icon>
        {{ $t('Common.unknown') }}
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "SingleSetting",
    props: {
        // eslint-disable-next-line
        value: {
            required: true
        },
        // eslint-disable-next-line
        uri: {
            type: String,
            default: ""
        },
        dense: {
            type: Boolean,
            default: false
        },
        label: {
            type: Boolean,
            default: true
        },
        required: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            required: false,
            default: null
        }
    },
    data() {
        return {
            grab: false
        };
    },
    computed: {
        isReadonly() {
            return this.getPropertyAttributeById(this.uri, "plus:readonly") ?? false;
        },
        getLabel() {
            return this.getPropertyLabelById(this.uri);
        },
        getType() {
            return this.getPropertyType(this.uri);
        },
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getPropertyById",
            "getPropertyRelationById",
            "getInstancesByClass",
            "isProperty",
            "getPropertyType",
            "getPropertyAttributeById"
        ]),
        ...mapGetters("storage", [
            "getMetadataByURI"
        ])
    },
    mounted() {
        this.$nextTick(() => this.$refs?.form?.validate());
    }
};
</script>

  <style>
    span.pm-metadata-label {
    color: grey;
    }
    span.pm-metadata-label:hover {
    color: white;
    }
  </style>
