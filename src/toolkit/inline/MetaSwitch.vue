<template>
  <span class="d-inline-block">
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-switch
            v-model="position"
            class="mt-0"
            dense
            hide-details
            @change="openUpsellDialog()"
          >
            <template v-slot:prepend>
              <slot name="prepend" v-bind="{ icon }">
                <v-icon
                  color="warning"
                  left
                >
                  {{ icon }}
                </v-icon>
              </slot>
            </template>
          </v-switch>
        </span>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </span>
</template>
<script>

export default {
    name: "MetaSwitch",
    props: {
        icon: {
            type: String,
            required: true
        },
        tooltip: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            position: false
        };
    },
    methods: {
        switchBack() {
            this.position = false;
        },
        openUpsellDialog() {
            this.$upsell.open(this.reason);
            this.$nextTick(() => this.switchBack());
        }
    }
};
</script>