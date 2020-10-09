<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-tooltip top>
    <template v-if="$security.check('object:delete')" #activator="{ on }">
      <v-btn
        icon
        class="mr-2"
        :loading="deleting"
        @click.stop="deleteCurrentObject"
        v-on="on"
      >
        <v-icon>{{ (referenced) ? "mdi-delete-alert" : "mdi-delete" }}</v-icon>
      </v-btn>
    </template>
    <span>{{ $t("Objects.delete") }}</span><br>
    <i v-if="referenced">{{ $t("Objects.objectUsedInOtherProjects") }}</i>
  </v-tooltip>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "DeleteObject",
    props: {
        uuid: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            default: 0
        },
        referenced: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            deleting: false
        };
    },
    computed: {
        ...mapGetters("storage", [
            "getObjectByUuid"
        ])
    },
    methods: {
        async deleteCurrentObject() {
            let message = (this.referenced) ?
                this.$t("Actions.deleteRefObjectInfo") :
                this.$t("Actions.deleteObjectInfo");

            if (await this.$confirm.open(this.$t("Actions.deleteObject"), message)) {
                this.deleting = true;
                try {
                    if (!!this.getObjectByUuid(this.uuid)) {
                        await this.deleteObject(this.uuid);
                    } else {
                        await this.removeObject({oid: this.uuid});
                    }
                    this.$notify.send(this.$t("Notification.objectDeleted"), "warning");
                } catch (error) {
                    this.$notify.send(this.$t("Notification.deletionFailed"), "error");
                } finally {
                    this.deleting = false;
                    this.$emit("deleted");
                }
            }
        },
        ...mapActions("storage", [
            "removeObject",
            "removeObjects",
            "deleteObject"
        ])
    }
};
</script>
