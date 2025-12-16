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
      :title="titleMessage"
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
    </ProcessObjects>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import XMLbuilder from "xmlbuilder";
import JSzip from "jszip";
import ObjectHash from "object-hash";

import template from "@/store/storage/template";
import util from "@/util";
import rdf from "@/util/rdf";
import rdfConverter from "@/util/rdf-converter";

import exportConfig from "@/config/iirds/export";
import iirdsMapping from "@/config/iirds/plusmeta";

import ProcessObjects from "@/shared/block/ProcessObjects";
import HelpView from "@/shared/block/HelpView";
import HtmlGenerator from "@/util/export/html-generator";

export default {
    name: "OtkStepGenerateIIRDS",
    components: {
        ProcessObjects,
        HelpView
    },
    data() {
        return {
            processed: 0,
            percent: 0,
            titleMessage: this.$t("Packages.checkingForUpdates"),
            organisation: null,
            identityDomain: null,
            productVariant: null,
            serialNumber: null,
            objectTypeURI: null,
            objectInstanceUri: null,
            formatRestriction: null
        };
    },
    computed: {
        hasDownloadableFile() {
            return this.getCurrentProjectRelationById("plus:relates-to-iirds-package").length > 0;
        },
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
            "getCurrentProject",
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
        let currentFingerprint = this.getProjectFingerprint();
        let storedFingerprint = this.getCurrentProjectRelationById("plus:has-project-fingerprint")[0];

        if (currentFingerprint === storedFingerprint && this.hasDownloadableFile) {
            this.titleMessage =  this.$t("Packages.cached");
            this.processed = this.getContentObjects.length;
            this.percent = 100;
            this.$refs?.status?.finish();
        } else {
            try {
                this.$refs?.status?.rerun();
            } catch (error) {
                this.$refs?.status?.abort();
            }
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
        getProjectFingerprint() {
            let projectData = util.deepCopy(this.getCurrentProject);
            let objectsData = this.getContentObjects;

            let combinedData = { projectData, objectsData };
            delete combinedData.projectData.modifiedAt;

            let normalizedData = JSON.parse(JSON.stringify(combinedData));
            return ObjectHash(normalizedData, {
                respectType: false,
                excludeKeys: (key) => {
                    return [
                        "plus:has-metadata-order",
                        "plus:has-project-fingerprint",
                        "objectUuids"
                    ].includes(key);
                }
            });
        },
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
            this.formatRestriction = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:formatRestriction")?.[0];
            this.titleMessage =  this.$t("Packages.generate");
            this.progress = 0;
            let zip = new JSzip();

            // iiRDS Container Skeleton
            zip.file("mimetype", "application/iirds+zip", { compression: "STORE" }); // no compression for mimetype
            let metadataFolder = zip.folder("META-INF");
            let contentFolder = zip.folder("CONTENT");

            // metadata.rdf
            let metadata = this.generateRDF();
            metadataFolder.file("metadata.rdf", metadata.xml);

            // metadata.jsonld
            let metadataJsonLd = await this.generateJSONLD(metadata.xml);
            metadataFolder.file("metadata.jsonld", JSON.stringify(metadataJsonLd, null, 2));

            // HTML Overview
            if (this.formatRestriction === "H") {
                const generator = new HtmlGenerator();
                const htmlFile = generator.generateBlob(metadata.htmlData.title, metadata.htmlData.rows);
                zip.file("index.html", htmlFile);
            }

            // check for media archives
            let archives = this.getCurrentObjectsByType("plus:MediaArchive");
            for (let archive of archives) {
                if (archive.source.data) {
                    await contentFolder.loadAsync(archive.source.data);
                }
            }

            // content files
            for (let object of this.getContentObjects) {
                if (!object.externalId && object.source.data) {
                    let filename = object.source.name || object.source.data.name;
                    contentFolder.file(filename, await this.fetchSource(object.uuid));
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

            let currentFingerprint = await this.getProjectFingerprint();
            await this.updateCurrentProjectRelations({"plus:has-project-fingerprint": [currentFingerprint]});

            this.$refs?.status?.finish();
        },
        getString(object, uri) {
            let value = this.getMetadataValueByURI(object, uri);
            if (!value) return "";
            return (Array.isArray(value)) ? value[0] : value;
        },
        generateRDF() {
            const namespaces = this.getPropertiesByClass("plus:Namespace");
            const globalInstances = {};
            const htmlData = {};
            const htmlTableRows = [];

            const customSNIdentifier = "plus:SerialNumber";
            let productVariantInstance;
            let partyCreatorInstance;
            let partyAuthorInstance;
            let productReferences;

            if (this.formatRestriction === "H") {
                this.organisation = this.$store.getters["projects/getCurrentProjectRelationById"]("plus:companyName")?.[0];
                this.identityDomain = this.$store.getters["projects/getCurrentProjectRelationById"]("plus:domain")?.[0];
                this.productType = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:ProductType")?.[0];
                this.serialNumber = this.$store.getters["projects/getCurrentProjectRelationById"]("plus:SerialNumber")?.[0];
                this.objectTypeURI = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:ObjectTypeURI")?.[0];
                this.objectInstanceUri = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:ObjectInstanceURI")?.[0];

                delete exportConfig["iirds:relates-to-product-variant"];
                productReferences = {};
                if (!!this.serialNumber) {
                    productReferences["iirds:SerialNumber"] = this.serialNumber;
                }
                if (!!this.objectTypeURI) {
                    productReferences["iirds:ObjectTypeURI"] = this.objectTypeURI;
                }
                if (!!this.objectInstanceUri) {
                    productReferences["iirds:ObjectInstanceURI"] = this.objectInstanceUri;
                }
                const productType = {};
                if (!!this.productType) {
                    productType["iirds:ProductType"] = this.productType;
                }

                productVariantInstance = this.createProductVariant(productReferences, productType, this.organisation);
                partyCreatorInstance = this.createParty("iirds:Creator", this.organisation);
                partyAuthorInstance = this.createParty("iirds:Author", this.organisation);
            }

            /*
                Define namespaces and root element
            */
            let namespaceConfig = namespaces.reduce((config, ns) => {
                ns.indicators?.forEach((prefix) => {
                    if (!["mdi", "pdf", "html"].includes(prefix)) {
                        config[`@xmlns:${prefix}`] = ns.identifier;
                    }
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
            let version = process.env.VUE_APP_VERSION;
            root.com(`*** iiRDS Open Toolkit (v${version}) ***`);
            root.com(`*** generated on ${now.toLocaleString()} ***`);

            let pid = `${rdf.urn(this.getCurrentProjectUuid)}/package`;
            let pack = root.ele("iirds:Package", { "rdf:about": pid });

            const packageTitle = "iiRDS Open Toolkit Export";
            pack.ele("iirds:title", {}, packageTitle);
            pack.ele("iirds:iiRDSVersion", "1.3");
            if (this.formatRestriction !== "iirds") {
                pack.ele("iirds:formatRestriction", {}, this.formatRestriction);
            }
            if (this.formatRestriction === "H") {
                pack.ele("iirds:relates-to-product-variant", {"rdf:resource": productVariantInstance.productVariantId});
                pack.ele("iirds:relates-to-party", {"rdf:resource": partyCreatorInstance.partyId});
                productVariantInstance.xmlNodes.forEach((xmlNode) => {
                    root.importDocument(xmlNode);
                });
                partyCreatorInstance.xmlNodes.forEach((xmlNode) => {
                    root.importDocument(xmlNode);
                });
                partyAuthorInstance.xmlNodes.forEach((xmlNode) => {
                    root.importDocument(xmlNode);
                });
                htmlData["title"] = packageTitle;
            }

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
                    if (property.label && typeof property.label === "object") {
                        Object.keys(property.label).forEach((lang) => {
                            return instance.ele("rdfs:label", {"xml:lang": lang}, property.label[lang]);
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

            if (this.getContentObjects.some((object) => {
                let sn = this.getMetadataValueByURI(object.uuid, customSNIdentifier);
                return sn && Array.isArray(sn) && sn.length;
            })) {
                const domain = root.ele("iirds:IdentityDomain", {"rdf:about": rdf.expand(customSNIdentifier, this.$store)})
                    .ele("iirds:has-identity-type", {"rdf:resource": rdf.expand("iirds:SerialNumber", this.$store)}).up();
                addLabels(customSNIdentifier, domain);
            }

            /*
                Metadata Relations
            */
            this.getContentObjects.forEach((object) => {
                const URI = rdf.urn(object.uuid);
                const TYPE = iirdsMapping[object.type];
                const htmlTableRow = {};

                let IU = root.ele(TYPE, {"rdf:about": URI});
                let IO;

                // get title string and set property
                let title = this.getString(object.uuid, "iirds:title");
                if (!!title) IU.ele("iirds:title", title);

                if (this.formatRestriction === "H") {
                    htmlTableRow["Title"] = title || "";
                    for (let [uri, value] of Object.entries(productReferences)) {
                        const heading = this.$store.getters["properties/getPropertyLabelById"](uri, "en");
                        htmlTableRow[heading] = value;
                    }
                    htmlTableRow["Information Unit IRI"] = URI;

                    const ioUri = rdf.newURN();
                    IO = root.ele("iirds:InformationObject", {"rdf:about": ioUri});
                    const ioIdentityInstance = this.createIdentityElement(title, null, "iirds:Creator", this.organisation, "/InformationObject");
                    IO.ele("iirds:has-identity", {"rdf:resource": ioIdentityInstance.identityId});
                    IU.ele("iirds:is-version-of", {"rdf:resource": ioUri});
                    ioIdentityInstance.xmlNodes.forEach((xmlNode) => {
                        root.importDocument(xmlNode);
                    });

                }

                IU.ele("iirds:is-part-of-package", {"rdf:resource": pid});

                // get assigned languages and create properties for each
                let languages = this.getMetadataValueByURI(object.uuid, "iirds:language");
                if (languages !== null && Array.isArray(languages)) {
                    languages.forEach((language) => {
                        if (rdf.isValidLanguageTag(language)) {
                            IU.ele("iirds:language", language);
                        }
                    });
                    htmlTableRow["Language"] = languages.join(", ");
                }

                if (this.formatRestriction === "H") {
                    IU.ele("iirds:relates-to-product-variant", {"rdf:resource": productVariantInstance.productVariantId});
                    IU.ele("iirds:relates-to-party", {"rdf:resource": partyAuthorInstance.partyId});
                } else {
                    let serialnumbers = this.getMetadataValueByURI(object.uuid, customSNIdentifier);
                    if (serialnumbers !== null && Array.isArray(serialnumbers)) {
                        serialnumbers.forEach((sn) => {
                            IU.ele("iirds:has-identity")
                                .ele("iirds:Identity")
                                .ele("iirds:identifier", {}, sn).up()
                                .ele("iirds:has-identity-domain", {"rdf:resource": rdf.expand(customSNIdentifier, this.$store)});
                        });
                    }
                }

                // get configured exportable relations and assign them
                Object.keys(exportConfig).forEach((relation) => {
                    let assigned = this.getMetadataValueByURI(object.uuid, relation) || [];
                    if (assigned !== null && Array.isArray(assigned)) {
                        assigned.forEach((value) => {
                            IU.ele(relation, {"rdf:resource": rdf.expand(value, this.$store)});
                            if (relation === "iirdsHov:has-document-category") {
                                htmlTableRow["Document Category"] = this.$store.getters["properties/getPropertyLabelById"](value, "en");
                            }
                        });
                    }
                });

                /*
                    Renditions
                */
                if (object.source && object.source.data instanceof Blob && !!object.source.type) {
                    let filename = object.externalId || object.source.name || object.source.data.name;
                    let encoded = encodeURIComponent(filename);
                    IU.ele("iirds:has-rendition")
                        .ele("iirds:Rendition", {"rdf:about": `${URI}/rendition/${encoded}`})
                        .ele("iirds:format", object.source.type).up()
                        .ele("iirds:source", `CONTENT/${filename}`);
                    htmlTableRow["File"] = `CONTENT/${filename}`;
                }
                htmlTableRows.push(htmlTableRow);
                htmlData["rows"] = htmlTableRows;
            });
            const xml = root.end({pretty: true});
            return {xml, htmlData};
        },
        async generateJSONLD(rdfXml) {
            const context = rdfConverter.createJsonLdContext(this.$store);
            try {
                let jsonLdDoc = await rdfConverter.rdfXmlToJsonLd(rdfXml, context, true);
                return jsonLdDoc;
            } catch (error) {
                return {
                    "@context": context,
                    "@graph": []
                };
            }
        },

        createProductVariant(productReferences, productTypes, organisation) {
            const productVariantId = rdf.newURN();
            let productVariantNode = XMLbuilder.begin()
                .ele("iirds:ProductVariant", {"rdf:about": productVariantId});

            const localInstanceNodes = [];
            for (let [identityType, identifier] of Object.entries(productReferences)) {
                const uriExtension = "/" + identityType.substring(identityType.lastIndexOf(":") + 1);
                const {
                    identityId: instanceIdentityId,
                    xmlNodes: instanceNodes
                } = this.createIdentityElement(identifier, identityType, "iirds:Manufacturer", organisation, uriExtension);
                productVariantNode.ele("iirds:has-identity", {"rdf:resource": instanceIdentityId}).up();
                localInstanceNodes.push(...instanceNodes);
            }

            const localTypeNodes = [];
            for (let [identityType, identifier] of Object.entries(productTypes)) {
                const uriExtension = "/" + identityType.substring(identityType.lastIndexOf(":") + 1);
                const {
                    identityId: typeIdentityId,
                    xmlNodes: typeNodes
                } = this.createIdentityElement(identifier, identityType, "iirds:Manufacturer", organisation, uriExtension);
                productVariantNode.ele("iirds:has-identity", {"rdf:resource": typeIdentityId}).up();
                localTypeNodes.push(...typeNodes);
            }

            let xmlNodes = [...localInstanceNodes, ...localTypeNodes, productVariantNode];
            return {productVariantId, xmlNodes};
        },

        createIdentityElement(identifier, identityType, partyRole, organisation, identityExtension) {
            const identityId = rdf.newURN();
            const {
                identityDomainId,
                xmlNodes
            } = this.createIdentityDomainElement(identityType, partyRole, organisation, identityExtension);
            let identityNode = XMLbuilder.begin()
                .ele("iirds:Identity", {"rdf:about": identityId})
                .ele("iirds:identifier", identifier).up()
                .ele("iirds:has-identity-domain", {"rdf:resource": identityDomainId}).up();
            xmlNodes.push(identityNode);
            return {identityId, xmlNodes};
        },

        createIdentityDomainElement(identityType, partyRole, organisation, identityDomainExtension = "") {
            const identityDomainId = `${this.identityDomain}${identityDomainExtension}`;
            const {partyId, xmlNodes} = this.createParty(partyRole, organisation);
            const identityDomainNode = XMLbuilder.begin()
                .ele("iirds:IdentityDomain", {"rdf:about": identityDomainId})
                .ele("iirds:relates-to-party", {"rdf:resource": partyId}).up();
            if (!!identityType) {
                identityDomainNode.ele("iirds:has-identity-type", {"rdf:resource": rdf.expand(identityType, this.$store)}).up();
            }
            xmlNodes.push(identityDomainNode);
            return {identityDomainId, xmlNodes};
        },

        createParty(partyRole, organisation) {
            const partyId = rdf.newURN();
            const {organisationId, xmlNodes} = this.createOrganisation(organisation);
            const partyNode = XMLbuilder.begin()
                .ele("iirds:Party", {"rdf:about": partyId})
                .ele("iirds:has-party-role", {"rdf:resource": rdf.expand(partyRole, this.$store)}).up()
                .ele("iirds:relates-to-vcard", {"rdf:resource": organisationId}).up();
            xmlNodes.push(partyNode);
            return {partyId, xmlNodes};
        },

        createOrganisation(organisation) {
            const organisationId = rdf.newURN();
            const organisationNode = XMLbuilder.begin()
                .ele("vcard:organization", {"rdf:about": organisationId})
                .ele("vcard:organization-name", organisation).up();
            const xmlNodes = [organisationNode];
            return {organisationId, xmlNodes};
        },

    }
};
</script>
