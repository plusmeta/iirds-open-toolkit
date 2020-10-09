<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container fluid class="pa-0">
    <HelpView helpkey="workflow.generateIirds" />

    <ProcessObjects
      ref="status"
      :title="$t('Packages.generate')"
      :processed-objects="processed"
      :objecttype="getIirdsObjectTypes"
      result-object-type="iirds:Container"
      :show-rerun="true"
      :show-download="true"
      @rerun="generatePackage"
      @download="downloadPackage"
    >
      <v-flex xs3>
        <v-card class="pa-0 flex-grow-1 text-center" color="primary">
          <v-card-text class="text-h2 white--text pb-0">
            {{ percent }} %
          </v-card-text>
          <v-card-text class="text-h6 white--text pb-0">
            {{ $t('Packages.progress') }}
          </v-card-text>
          <v-card-text class="text-subtitle-1 white--text pt-0">
            {{ $t('Packages.packaging') }}
          </v-card-text>
        </v-card>
      </v-flex>
    </ProcessObjects>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import XMLbuilder from "xmlbuilder";
import JSzip from "jszip";

import template from "@/store/storage/template";
import util from "@/util";
import rdf from "@/util/rdf";

import exportConfig from "@/config/iirds/export";
import iirdsMapping from "@/config/iirds/plusmeta";

import ProcessObjects from "@/shared/block/ProcessObjects";
import HelpView from "@/shared/block/HelpView";

export default {
    name: "OtkStepGenerateIIRDS",
    components: {
        ProcessObjects,
        HelpView
    },
    data() {
        return {
            processed: 0,
            percent: 0
        };
    },
    computed: {
        getIirdsObjectTypes() {
            return Object.keys(iirdsMapping);
        },
        getContentObjects() {
            return this.getCurrentObjectsByType(this.getIirdsObjectTypes);
        },
        ...mapGetters("storage", [
            "getCurrentObjectsByType",
            "getObjectByUuid",
            "getMetadataValueByURI"
        ]),
        ...mapGetters("projects", [
            "getCurrentProjectRelationById"
        ]),
        ...mapGetters("properties", [
            "getPropertyById",
            "getPropertiesByClass"
        ]),
        ...mapGetters("settings", [
            "getCurrentProjectUuid"
        ])
    },
    mounted() {
        if (!this.getCurrentProjectRelationById("plus:relates-to-iirds-package").length) {
            try {
                this.generateiiRDS();
            } catch (error) {
                this.$refs?.status?.abort();
            }
        } else {
            this.processed = this.getContentObjects.length;
            this.percent = 100;
            this.$refs?.status?.finish();
        }
    },
    methods: {
        ...mapActions("storage", [
            "saveObjectLocal",
            "fetchSource"
        ]),
        ...mapActions("projects", [
            "addObjectsToProject",
            "updateCurrentProjectRelations"
        ]),
        generatePackage() {
            this.processed = 0;
            this.percent = 0;
            this.generateiiRDS();
        },
        async addToStorage(blob) {
            let name = `iiRDS-OT-${Date.now()}`;
            let object = template.object({
                type: "iirds:Container",
                name: name,
                source: {
                    type: "application/iirds+zip",
                    data: blob,
                    size: blob.size,
                    name: name + ".iirds"
                }
            });

            this.saveObjectLocal(object);
            await this.addObjectsToProject({ projectUuid: this.getCurrentProjectUuid, objectUuids: [object.uuid] });

            return object.uuid;
        },
        async downloadPackage() {
            if (this.getCurrentProjectRelationById("plus:relates-to-iirds-package").length > 0) {
                let packageObjectUuid = this.getCurrentProjectRelationById("plus:relates-to-iirds-package")[0];
                let packageObject = this.getObjectByUuid(packageObjectUuid);
                util.downloadBlob(await this.fetchSource(packageObjectUuid), packageObject.source.name);
            }
        },
        async generateiiRDS() {
            this.progress = 0;
            let zip = new JSzip();

            // iiRDS Container Skeleton
            zip.file("mimetype", "application/iirds+zip", { compression: "STORE" }); // no compression for mimetype
            let metadata = zip.folder("META-INF");
            let content = zip.folder("CONTENT");

            // metadata.rdf
            let metadataRDF = await this.generateRDF(content);
            metadata.file("metadata.rdf", metadataRDF);

            // check for media archives
            let archives = this.getCurrentObjectsByType("plus:MediaArchive");
            for (let archive of archives) {
                if (archive.source.data) {
                    await content.loadAsync(archive.source.data);
                }
            }

            // content files
            for (let object of this.getContentObjects) {
                if (!object.externalId && object.source.data) {
                    let filename = object.source.name || object.source.data.name;
                    content.file(filename, await this.fetchSource(object.uuid));
                }
                this.processed++;
            }

            let blob = await zip.generateAsync({
                type:"blob",
                compression: "DEFLATE",
                compressionOptions : { level: 6 }
            }, (metadata) => {
                this.percent = Math.round(metadata.percent);
            });

            let packageID = await this.addToStorage(blob);
            await this.updateCurrentProjectRelations({"plus:relates-to-iirds-package": [packageID]});

            this.$refs?.status?.finish();
        },
        getString(object, uri) {
            let value = this.getMetadataValueByURI(object, uri);
            if (!value) return "";
            return (Array.isArray(value)) ? value[0] : value;
        },
        generateRDF(content) {
            const namespaces = this.getPropertiesByClass("plus:Namespace");
            const globalInstances = {};

            /*
                Define namespaces and root element
            */
            let namespaceConfig = namespaces.reduce((config, ns) => {
                ns.indicators?.forEach((prefix) => {
                    config[`@xmlns:${prefix}`] = ns.identifier;
                });
                return config;
            }, {});

            const root = XMLbuilder.create({
                "rdf:RDF": namespaceConfig
            });

            /*
                General and Package information
            */
            let now = new Date();
            root.com(`*** iiRDS Open Toolkit (v${process.env.VUE_APP_VERSION}) ***`);
            root.com(`*** generated on ${now.toLocaleString()} ***`);

            let pid = `${rdf.urn(this.getCurrentProjectUuid)}/package`;
            let pack = root.ele("iirds:Package", { "rdf:about": pid });

            pack.ele("iirds:title", {}, "iiRDS Open Toolkit Export");
            pack.ele("iirds:iiRDSVersion", "1.0.1");

            /*
                Generic Labeling function
            */
            const addLabels = (prop, instance) => {
                let property = this.getPropertyById(prop);
                if (property) {
                    if (property.label && typeof property.label === "string") {
                        return instance.ele("rdfs:label", property.label);
                    }
                    if (property.labels && typeof property.labels === "object") {
                        Object.keys(property.labels).forEach((lang) => {
                            return instance.ele("rdfs:label", {"xml:lang": lang}, property.labels[lang]);
                        });
                    }
                }
            };

            /*
                Collect custom assigend instances (non-standard iiRDS instances)
            */
            this.getContentObjects.forEach((object) => {
                Object.keys(exportConfig).forEach((relation) => {
                    if (!globalInstances.hasOwnProperty(relation)) {
                        globalInstances[relation] = new Set();
                    }
                    let assigned = this.getMetadataValueByURI(object.uuid, relation) || [];
                    assigned.forEach((value) => {
                        if (!rdf.isKnownPrefixed(value, this.$store)) {
                            globalInstances[relation].add(value);
                        }
                    });
                });
            });

            Object.keys(globalInstances).forEach((relation) => {
                let instances = globalInstances[relation];
                [...instances].forEach((instance) => {
                    const element = root.ele(exportConfig[relation],
                        {"rdf:about": instance});
                    addLabels(instance, element);
                });
            });

            /*
                Metadata Relations
            */
            this.getContentObjects.forEach((object) => {
                const URI = rdf.urn(object.uuid);
                const TYPE = iirdsMapping[object.type];

                let IU = root.ele(TYPE, {"rdf:about": URI});

                // get title string and set proeprty
                let title = this.getString(object.uuid, "iirds:title");
                if (!!title) IU.ele("iirds:title", title);

                IU.ele("iirds:is-part-of-package", {"rdf:resource": pid});

                // get assigned languages and create properties for each
                let languages = this.getMetadataValueByURI(object.uuid, "iirds:language");
                if (languages !== null && Array.isArray(languages)) {
                    languages.forEach((language) => {
                        if (rdf.isValidLanguageTag(language)) {
                            IU.ele("iirds:language", language);
                        }
                    });
                }

                // get configured exportable relations and assign them
                Object.keys(exportConfig).forEach((relation) => {
                    let assigned = this.getMetadataValueByURI(object.uuid, relation) || [];
                    if (assigned !== null && Array.isArray(assigned)) {
                        assigned.forEach((value) => {
                            IU.ele(relation, {"rdf:resource": rdf.expand(value, this.$store)});
                        });
                    }
                });

                /*
                    Renditions
                */
                if (object.source && object.source.data instanceof Blob && !!object.source.type) {
                    let filename = object.externalId || object.source.name || object.source.data.name;
                    IU.ele("iirds:has-rendition")
                        .ele("iirds:Rendition", {"rdf:about": `${URI}/rendition/${filename}`})
                        .ele("iirds:format", object.source.type).up()
                        .ele("iirds:source", `CONTENT/${filename}`);
                }
            });

            return root.end({ pretty: true });
        }
    }
};
</script>
