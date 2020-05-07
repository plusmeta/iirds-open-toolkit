<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <process-objects
    ref="status"
    :title="$t('Packages.generate')"
    :processed-objects="processed"
    :objecttype="['plus:Document', 'plus:Component', 'plus:Fragment', 'plus:GenericObject']"
    result-object-type="iirds:Container"
    :show-rerun="true"
    :show-download="true"
    @rerun="generatePackage"
    @download="downloadPackage"
  >
    <template>
      <v-flex xs3>
        <v-card class="pa-0 flex-grow-1 text-center" color="info">
          <v-card-text class="display-3 white--text pb-0">
            {{ percent }} %
          </v-card-text>
          <v-card-text class="title white--text pb-0">
            {{ $t('Packages.progress') }}
          </v-card-text>
          <v-card-text class="subtitle-1 white--text pt-0">
            {{ $t('Packages.packaging') }}
          </v-card-text>
        </v-card>
      </v-flex>
    </template>
  </process-objects>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import XMLbuilder from "xmlbuilder";
import JSzip from "jszip";

import template from "@/store/storage/template";
import util from "@/util";
import rdf from "@/util/rdf";

import ProcessObjects from "@/shared/block/ProcessObjects";

export default {
    name: "OtkStepGenerateIIRDS",
    components: {
        ProcessObjects
    },
    data() {
        return {
            processed: 0,
            percent: 0,
            projectUuid: ""
        };
    },
    computed: {
        getContentObjects() {
            return this.getCurrentObjectsByType([
                "plus:Document",
                "plus:Component",
                "plus:Fragment",
                "plus:GenericObject"
            ]);
        },
        ...mapGetters("storage", [
            "getCurrentObjectsByType",
            "getObjectByUuid",
            "getMetadataValueByURI"
        ]),
        ...mapGetters("projects", [
            "getCurrentProjectName",
            "getCurrentProjectRelationById"
        ]),
        ...mapGetters("properties", [
            "getPropertyById",
            "getPropertyLabelById",
            "getPropertyRelationById"
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
            "fetchSource",
            "addMetadata"
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
            await this.addObjectsToProject({ projectUuid: this.projectUuid, objectUuids: [object.uuid] });

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
            this.projectUuid = this.getCurrentProjectUuid;
            let zip = new JSzip();

            // iiRDS Container Skeleton
            zip.file("mimetype", "application/iirds+zip", { compression: "STORE" }); // no compression for mimetype
            let metadata = zip.folder("META-INF");
            let content = zip.folder("CONTENT");

            // metadata.rdf
            let metadataRDF = await this.generateRDF(content);
            metadata.file("metadata.rdf", metadataRDF);

            // content files
            for (let object of this.getContentObjects) {
                if (object.source.data &&
                    !this.getMetadataValueByURI(object.uuid, "plus:parentTopic")
                ) {
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
            const root = XMLbuilder.create({
                "rdf:RDF": {
                    "@xmlns:dcterms": "http://purl.org/dc/terms/",
                    "@xmlns:iirds": "http://iirds.tekom.de/iirds#",
                    "@xmlns:iirdsMch": "http://iirds.tekom.de/iirds/domain/machinery#",
                    "@xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                    "@xmlns:rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                    "@xmlns:vcard": "http://www.w3.org/2006/vcard/ns#"
                }
            });

            /*
                General and Package information
            */
            let now = new Date();
            root.com(`*** iiRDS Open Toolkit (v${process.env.VUE_APP_VERSION}) ***`);
            root.com(`*** generated on ${now.toLocaleString()} ***`);

            let pid = `${rdf.urn(this.projectUuid)}/package`;
            let pack = root.ele("iirds:Package", { "rdf:about": pid });

            pack.ele("iirds:title", {}, this.getCurrentProjectName);
            pack.ele("iirds:iiRDSVersion", "1.0.1");

            let products = new Set();
            let components = new Set();
            let manufacturers = new Set();
            let customTopicTypes = new Set();
            let customInfoSubjects = new Set();

            this.getContentObjects.forEach((object) => {
                let currentProducts = this.getMetadataValueByURI(object.uuid, "iirds:relates-to-product-variant") || [];
                let productsAsArray = Array.isArray(currentProducts) ? currentProducts : [currentProducts];
                productsAsArray.forEach(product => products.add(product));

                let currentComponents = this.getMetadataValueByURI(object.uuid, "iirds:relates-to-component") || [];
                let componentsAsArray = Array.isArray(currentComponents) ? currentComponents : [currentComponents];
                componentsAsArray.forEach(component => components.add(component));

                let currentTopicTypes = this.getMetadataValueByURI(object.uuid, "iirds:has-topic-type") || [];
                currentTopicTypes.forEach((type) => {
                    if (!type.includes("iirds:")) customTopicTypes.add(type);
                });

                let currentInfoSubjects = this.getMetadataValueByURI(object.uuid, "iirds:has-subject") || [];
                let infoSubjectsAsArray = Array.isArray(currentInfoSubjects) ? currentInfoSubjects : [currentInfoSubjects];
                infoSubjectsAsArray.forEach((subject) => {
                    if (!subject.includes("iirds:")) customInfoSubjects.add(subject);
                });
            });

            /*
                Product Metadata Instances
            */

            let cacheManufacturers = [];

            const addManufacturer = (product, instance) => {
                let manufacturers = this.getPropertyRelationById(product, "plus:manufactured-by");
                if (manufacturers && manufacturers.length) {
                    manufacturers.forEach((manufacturer) => {
                        if (cacheManufacturers.includes(manufacturer)) {
                            return instance.ele("iirds:relates-to-party", {"rdf:resource": `${manufacturer}/manufacturer`});
                        } else {
                            cacheManufacturers.push(manufacturer);
                            return instance.ele("iirds:relates-to-party")
                                .ele("iirds:Party", {"rdf:about": `${manufacturer}/manufacturer`})
                                .ele("iirds:has-party-role", {"rdf:resource": rdf.expand("iirds:Manufacturer", this.$store)}).up()
                                .ele("iirds:relates-to-vcard")
                                .ele("vcard:Organization", {"rdf:about": manufacturer})
                                .ele("vcard:fn", this.getPropertyLabelById(manufacturer));
                        }
                    });
                }
            };

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

            [...products].forEach((product) => {
                const productEl = root.ele("iirds:ProductVariant",
                    {"rdf:about": product});
                addLabels(product, productEl);
                addManufacturer(product, productEl);
            });

            [...components].forEach((component) => {
                const componentEl = root.ele("iirds:Component",
                    {"rdf:about": component});
                addLabels(component, componentEl);
                addManufacturer(component, componentEl);
            });

            [...customTopicTypes].forEach((type) => {
                const topicTypeEl = root.ele("iirds:TopicType",
                    {"rdf:about": type});
                addLabels(type, topicTypeEl);
            });

            [...customInfoSubjects].forEach((subject) => {
                const subjectEl = root.ele("iirds:InformationSubject",
                    {"rdf:about": subject});
                addLabels(subject, subjectEl);
            });

            /*
                Metadata Relations
            */

            const iirdsMapping = {
                "plus:GenericObject": "iirds:Document",
                "plus:Document": "iirds:Document",
                "plus:Component": "iirds:Topic",
                "plus:Fragment": "iirds:Fragment"
            };

            this.getContentObjects.forEach((object) => {
                let did = rdf.urn(object.uuid);
                let type = iirdsMapping[object.type];

                let doc = root.ele(type, {"rdf:about": did});

                let title = this.getString(object.uuid, "iirds:title");
                if (!!title) {
                    doc.ele("iirds:title", title);
                }
                doc.ele("iirds:is-part-of-package", {"rdf:resource": pid});

                let languages = this.getMetadataValueByURI(object.uuid, "iirds:language");
                if (languages !== null && Array.isArray(languages)) {
                    languages.forEach((language) => {
                        doc.ele("iirds:language", language);
                    });
                }

                switch (type) {
                case "iirds:Document":
                    let doctypes = this.getMetadataValueByURI(object.uuid, "iirds:has-document-type");
                    if (doctypes !== null && Array.isArray(doctypes)) {
                        doctypes.forEach((doctype) => {
                            doc.ele("iirds:has-document-type", {"rdf:resource": rdf.expand(doctype, this.$store)});
                        });
                    }
                    break;
                case  "iirds:Topic":
                    let topictypes = this.getMetadataValueByURI(object.uuid, "iirds:has-topic-type");
                    if (topictypes !== null && Array.isArray(topictypes)) {
                        topictypes.forEach((topictype) => {
                            doc.ele("iirds:has-topic-type", {"rdf:resource": rdf.expand(topictype, this.$store)});
                        });
                    }
                    let adoctypes = this.getMetadataValueByURI(object.uuid, "iirds:is-applicable-for-document-type");
                    if (adoctypes !== null && Array.isArray(adoctypes)) {
                        adoctypes.forEach((adoctype) => {
                            doc.ele("iirds:is-applicable-for-document-type", {"rdf:resource": rdf.expand(adoctype, this.$store)});
                        });
                    }
                    break;
                }

                let infosubjects = this.getMetadataValueByURI(object.uuid, "iirds:has-subject");
                if (infosubjects !== null && Array.isArray(infosubjects)) {
                    infosubjects.forEach((infosubject) => {
                        doc.ele("iirds:has-subject", {"rdf:resource": rdf.expand(infosubject, this.$store)});
                    });
                }

                let plcp = this.getMetadataValueByURI(object.uuid, "iirds:relates-to-product-lifecycle-phase");
                if (plcp !== null && Array.isArray(plcp)) {
                    plcp.forEach((phase) => {
                        doc.ele("iirds:relates-to-product-lifecycle-phase", {"rdf:resource": rdf.expand(phase, this.$store)});
                    });
                }

                let comps = this.getMetadataValueByURI(object.uuid, "iirds:relates-to-component");
                if (comps !== null && Array.isArray(comps)) {
                    comps.forEach((comp) => {
                        doc.ele("iirds:relates-to-component", {"rdf:resource": comp});
                    });
                }

                let products = this.getMetadataValueByURI(object.uuid, "iirds:relates-to-product-variant");
                if (products !== null && Array.isArray(products)) {
                    products.forEach((product) => {
                        doc.ele("iirds:relates-to-product-variant", {"rdf:resource": product});
                    });
                }

                /*
                    Renditions
                */

                let parentTopicId = this.getMetadataValueByURI(object.uuid, "plus:parentTopic");
                if (type === "iirds:Fragment" &&
                    parentTopicId &&
                    this.getObjectByUuid(parentTopicId)
                ) {
                    let parentObject = this.getObjectByUuid(parentTopicId);
                    let parentFileName = parentObject.source.name || parentObject.source.data.name;
                    doc.ele("iirds:has-rendition")
                        .ele("iirds:Rendition", {"rdf:about": `${did}/rendition/${parentFileName}`})
                        .ele("iirds:format", parentObject.source.type).up()
                        .ele("iirds:source", `CONTENT/${parentObject.source.name}`).up()
                        .ele("iirds:has-selector")
                        .ele("iirds:FragmentSelector")
                        .ele("dcterms:conformsTo", {"rdf:resource": "http://tools.ietf.org/rfc/rfc3236" }).up()
                        .ele("rdf:value", object.uuid);
                } else if (object.hasOwnProperty("source") &&
                    object.source.data instanceof Blob &&
                    !!object.source.type
                ) {
                    let filename = object.source.name || object.source.data.name;
                    doc.ele("iirds:has-rendition")
                        .ele("iirds:Rendition", {"rdf:about": `${did}/rendition/${filename}`})
                        .ele("iirds:format", object.source.type).up()
                        .ele("iirds:source", `CONTENT/${object.source.name}`);
                }
            });

            return root.end({ pretty: true });
        }
    }
};
</script>
