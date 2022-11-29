<template>
  <v-row align="center">
    <v-col>
      <v-form ref="form">
        <v-combobox
          ref="combo"
          :value="getChips"
          :items="getEmpty"
          :rules="[checkRequired]"
          :label="getLabel"
          :loading="loading"
          :readonly="isReadonly"
          :disabled="isReadonly"
          small-chips
          deletable-chips
          multiple
          :class="{ 'required': required }"
          @update:search-input="searchInput$.next($event)"
          @click:clear="treeInput$.next(getEmpty)"
          @input="onComboboxInput($event)"
        >
          <template v-slot:prepend>
            <slot name="icon" :icon="icon">
              <v-icon v-if="showIcon || icon">
                {{ icon }}
              </v-icon>
            </slot>
          </template>
          <template v-slot:selection="{ item, parent, index, disabled: panelDisabled }">
            <template v-if="item.text && !!item.text.trim() && (parent.isMenuActive || (!parent.isMenuActive && index < 5))">
              <PropertyPanel
                class="d-block"
                :data="{item, parent, index}"
                :disabled="panelDisabled"
                @close="parent.selectItem(item);"
              >
                <template v-slot:action="{ panel }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                        dense
                        icon
                        small
                        tooltip
                        v-on="tooltip"
                        @click="panel.closePanel(); scrollToItem(item.value)"
                      >
                        <v-icon small>
                          mdi-crosshairs-gps
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t("Actions.findEntry") }}</span>
                  </v-tooltip>
                </template>
              </PropertyPanel>
            </template>
            <span
              v-if="(!parent.isMenuActive && index === 5)"
              :title="getRemaining"
              class="d-inline-block ml-2"
            >
              {{ $tc("Common.more", localAssignedProperties.length - 5) }}
            </span>
          </template>
          <template v-slot:no-data>
            <v-treeview
              v-if="isMenuActive"
              :value="localAssignedProperties"
              :items="getTreeData"
              :search="search"
              :active="selected"
              :open="localTreeOpened"
              :selection-type="selectionMode"
              selected-color="primary"
              selectable
              multiple-active
              @input="treeInput$.next($event)"
            >
              <template v-slot:label="{ item }">
                <div class="d-flex cursor-pointer" @click="forwardCheckboxClick">
                  <span :class="{'truncate-350': item.name}">{{ item.name }}</span>
                </div>
              </template>
            </v-treeview>
          </template>
        </v-combobox>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from "rxjs/operators";

import util from "@/util";

import PropertyPanel from "@/shared/inline/PropertyPanel";

export default {
    name: "OtkChooseTaxonomyNodes",
    components: {
        PropertyPanel
    },
    model: {
        type: Array,
        default: () => []
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        objectUuid: {
            type: String,
            default: null,
            required: false
        },
        propclass: {
            type: String,
            required: true
        },
        proprelation: {
            type: String,
            required: true
        },
        multiple: {
            type: Boolean,
            default: true
        },
        required: {
            type: Boolean,
            default: false
        },
        label: {
            type: [Boolean, String],
            default: false
        },
        icon: {
            type: String,
            default: "mdi-file-tree"
        },
        showIcon: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            localAssignedProperties: [],
            localTreeOpened: [],
            modelValue: [],
            loading: false,
            search: null,
            searching: false,
            selected: [],
            staticTree: false,
            isCreated: false
        };
    },
    domStreams: ["searchInput$", "treeInput$"],
    computed: {
        valueLocal: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        },
        isReadonly() {
            return this.getPropertyAttributeById(this.propclass, "plus:readonly") ?? false;
        },
        getTreeElements() {
            return this.getParentIds(this.localAssignedProperties, this.propclass)
                .filter(propId => this.getChildIds(propId).length !== 0);
        },
        getTreeOpened() {
            return this.search ? this.getFlatData : this.getTreeElements;
        },
        getEmpty() {
            return [];
        },
        isInputEmpty() {
            return !this.localAssignedProperties || this.localAssignedProperties?.length === 0;
        },
        getRemaining() {
            const remainder = this.localAssignedProperties.slice(8);
            let labeledRemainder = remainder.map(id => this.getPropertyLabelById(id));
            return labeledRemainder.filter(Boolean).join(", ");
        },
        isMenuActive() {
            return this.isCreated && this.$refs?.combo.isMenuActive;
        },
        isTaxonomy() {
            let roles = this.getPropertyRelationById(this.propclass, "plus:has-roles");
            return roles.includes("plus:TaxonomyTree");
        },
        getTreeData() {
            return this.getNodeById(this.propclass).children;
        },
        getFlatData() {
            return this.getAllChildIds([this.propclass]);
        },
        getLabel() {
            let label = "";
            if (typeof this.label === "string") return this.label;
            if (this.label) label += this.getPropertyLabelById(this.propclass);
            return label;
        },
        getAssignedValues () {
            return this.getMetadataValueByURI(this.objectUuid, this.proprelation);
        },
        getAssignedProperties() {
            let assigned = this.valueLocal || [];
            if (this.objectUuid) {
                assigned = this.getAssignedValues || [];
                assigned = (Array.isArray(assigned)) ? assigned : [assigned];
                assigned = assigned.filter(value => this.getFlatData.includes(value));
            }

            if (!this.isTaxonomy) {
                return assigned;
            }

            // Knoten zu Blättern auflösen
            return Array.from(new Set(this.getAllChildIds(assigned)))
                .filter(propId => this.getChildIds(propId).length === 0);
        },
        getChips() {
            return (this.localAssignedProperties || [])
                .filter(prop => this.isProperty(prop))
                .map((prop) => {
                    return {
                        text: this.getPropertyLabelById(prop),
                        value: prop,
                        path: this.getPath(prop)
                    };
                }).sort((a, b) => a?.text?.localeCompare(b?.text));
        },
        selectionMode() {
            return this.isTaxonomy ? "leaf" : "independent";
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getPropertyRelationById",
            "getPropertyAttributeById",
            "getPropertiesByClass",
            "getPropertyById",
            "isProperty"
        ])
    },
    subscriptions() {
        return {
            onSearchInput:
                this.searchInput$.pipe(
                    debounceTime(500),
                    distinctUntilChanged(),
                    tap((query) => {
                        this.search = query;
                        this.updateTreeOpened();
                    }),
                ),
            onTreeInput:
                this.treeInput$.pipe(
                    filter(() => !this.staticTree),
                    map((selected) => {
                        this.localAssignedProperties = selected;
                        this.updateDimensions();
                        let existing = this.getAssignedValues || [];
                        let foreignExisting = existing.filter(value => !this.getFlatData.includes(value));
                        return Array.from(new Set([...foreignExisting, ...selected]));
                    }),
                    map(selected => selected.sort((a, b) => a.localeCompare(b))),
                    map(selected => JSON.stringify(selected)),
                    debounceTime(1200),
                    distinctUntilChanged(),
                    tap(() => {
                        this.loading = true;
                    }),
                    map(selected => JSON.parse(selected)),
                    switchMap(selected => this.selectProperty(selected)),
                    tap(() => {
                        this.loading = false;
                    })
                )
        };
    },
    watch: {
        getAssignedProperties: {
            handler(val) {
                if (val) {
                    this.localAssignedProperties = val;
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.isCreated = true;
        this.$nextTick(() => this.$refs?.form?.validate());
        this.updateTreeOpened();
    },
    methods: {
        updateTreeOpened() {
            this.localTreeOpened = this.getTreeOpened;
        },
        onComboboxInput(selected) {
            selected = selected.filter(Boolean)
                .map((s) => {
                    if (typeof s === "string") {
                        return { value: s };
                    }
                    return s;
                })
                .map(s => s.value);
            let adHocProp = selected.find(item => !this.getFlatData.includes(item));
            if (!adHocProp) {
                this.treeInput$.next(selected);
            }
        },
        openMenu() {
            this.$refs?.combo?.activateMenu();
        },
        updateDimensions() {
            this.$refs?.combo?.updateMenuDimensions();
        },
        scrollToItem(id) {
            this.openMenu();
            this.selected = this.selected.includes(id) ? [] : [id];
            this.$nextTick(() => {
                window.setTimeout(() => {
                    let firstActive = document.getElementsByClassName("v-treeview-node--active")[0];
                    firstActive?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }, 250);
            });
        },
        toggleItem(item) {
            const value = item?.id;
            if (value) {
                let selected = util.deepCopy(this.localAssignedProperties);
                let values = [value];
                if (this.isTaxonomy) {
                    values = Array.from(new Set(this.getAllChildIds(values)))
                        .filter(propId => this.getChildIds(propId).length === 0);
                }

                let without = util.withoutArray(selected, values);
                let isAdd = without.length === selected.length;
                if (isAdd) {
                    selected = util.unionArray(selected, values);
                } else {
                    selected = without;
                }

                this.treeInput$.next(selected);
            }
        },
        getPath(item) {
            let rawPath = this.getParentIds([item], this.propclass);
            let labeledPath = rawPath.map(id => this.getPropertyLabelById(id));
            return labeledPath.filter(Boolean).reverse().join(" > ");
        },
        getNodeById(propId) {
            let children = undefined;
            const childIds = this.getChildIds(propId);
            if (childIds.length > 0) {
                children = childIds.map(childId => this.getNodeById(childId));
                children.sort((a, b) => a.name.localeCompare(b.name));
            }

            return {
                id: propId,
                name: this.getPropertyLabelById(propId),
                children
            };
        },
        checkRequired() {
            if (this.required && this.isInputEmpty) {
                return this.$t("Validations.noEmptyInput");
            } else {
                return true;
            }
        },
        checkMultiple() {
            if (!this.multiple && this.localAssignedProperties.length > 1) {
                return this.$t("Validations.noMultipleInput");
            } else {
                return true;
            }
        },
        getParentIds(children, rootId) {
            if (!children || children.length === 0) return [rootId];

            let parentIds = children
                .filter(propId => !this.getPropertyAttributeById(propId, "plus:inactiveProperty"))
                .map(id => this.getPropertyById(id)?.subClassOf)
                .filter(subClassOf => !!subClassOf && subClassOf !== rootId)
                .map(subClassOf => (this.getPropertyById(subClassOf) || []))
                .map(prop => prop.identifier);

            return Array.from(new Set([...parentIds, ...this.getParentIds(parentIds, rootId)]));
        },
        getAllChildIds(propIds) {
            if (!propIds || propIds.length === 0) return [];

            const childIds = propIds
                .map(propId => this.getChildIds(propId))
                .flatMap(list => list);

            return Array.from(new Set([...propIds, ...this.getAllChildIds(childIds)]));
        },
        getChildIds(propId) {
            return this.getPropertiesByClass(propId).map(p => p.identifier);
        },
        async selectProperty(selected) {
            this.staticTree = true;
            if (this.objectUuid) {
                await this.saveMetaDatum({
                    objectUuid: this.objectUuid,
                    objectMeta: {
                        uri: this.proprelation,
                        value: selected
                    }
                });
            } else {
                this.valueLocal = selected || [];
            }
            this.staticTree = false;
        },
        forwardCheckboxClick($event) {
            $event?.currentTarget?.closest("div.v-treeview-node__root")?.querySelector("button.v-treeview-node__checkbox")?.click();
        },
        ...mapActions("storage", [
            "saveMetaDatum",
        ]),
    }
};
</script>

<style scoped>
 .v-input .v-input.v-text-field {
     padding-top: 0 !important;
     margin-top: -1px;
 }

 .v-treeview.disabled .v-treeview-node {
    color: rgba(0, 0, 0, 0.38);
 }

</style>
