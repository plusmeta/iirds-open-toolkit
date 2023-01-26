<!--
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container fluid class="pa-0">
    <HelpView helpkey="workflow.generateVdi2770" />

    <ProcessObjects
      ref="status"
      :processed-objects="processedObjectsCount"
      :show-download="hasDownloadableFile"
      :show-download-loading="downloadPackageLoading"
      :show-log="true"
      :show-rerun="true"
      :title="titleMessage"
      :total-objects="totalObjects"
      @download="downloadPackage"
      @rerun="generatePackage"
    >
      <v-card class="pa-0 flex-grow-1 text-center" color="info">
        <v-card-text class="display-3 pb-0 white--text">
          {{ percent }} %
        </v-card-text>
        <v-card-text class="title pb-0 white--text">
          {{ $t('Packages.progress') }}
        </v-card-text>
        <v-card-text class="subtitle-1 pt-0 white--text">
          {{ $t('Packages.packaging') }} ({{ mainContainer || totalContainers }})
        </v-card-text>
      </v-card>
    </ProcessObjects>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { create } from "xmlbuilder2";

import JSzip from "jszip";

import allSettled from "@ungap/promise-all-settled";

import util from "@/util";
import rdf from "@/util/rdf";
import pdfutil from "@/util/import/pdf";
import match from "@/util/match";
import template from "@/store/storage/template";

import ProcessObjects from "@/shared/block/ProcessObjects";
import HelpView from "@/shared/block/HelpView";

import { PdfService } from "@/services/pdf-service";
import CryptoUtils from "@/util/crypto-utils";

// Polyfill allSettled
if (!Promise.allSettled) Promise.allSettled = allSettled;

export default {
    name: "StepGenerateVDI2770",
    components: {
        ProcessObjects,
        HelpView
    },
    props: {
        objecttype: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            totalObjects: 0,
            totalContainers: 0,
            mainContainer: null,
            titleMessage: this.$t("Packages.checkingForUpdates"),
            processedObjectsCount: 0,
            downloadPackageLoading: false,
            percent: 0,
            identities: []
        };
    },
    computed: {
        getOrganization() {
            return {
                name: this.getSetting("base_orga_name"),
                user: this.getSetting("base_user_name"),
                mail: this.getSetting("base_user_mail"),
                url: this.getSetting("base_orga_id"),
                fullName: this.getSetting("base_orga_fullname") || this.getSetting("base_orga_name"),
            };
        },
        hasDownloadableFile() {
            return this.getCurrentProjectRelationById("plus:relates-to-vdi2770-container").length > 0;
        },
        getDocClassStrategies() {
            const docClassProps = this.getPropertiesByRole("vdi:DocumentClassification");
            return docClassProps.map((ref) => {
                return {
                    concept: ref.identifier,
                    rel: this.resolveAssignedRelationType(ref.identifier)
                };
            });
        },
        ...mapGetters("storage", [
            "getObjectByUuid",
            "getCurrentObjectsByType"
        ]),
        ...mapGetters("projects", [
            "getCurrentProject",
            "getCurrentProjectRelationById"
        ]),
        ...mapGetters("properties", [
            "isProperty",
            "getPropertyById",
            "getPropertyLabels",
            "getPropertyLabelById",
            "getPropertyRelationById",
            "getPropertyAttributeById",
            "getPropertiesByRole",
            "resolveAssignedRelationType"
        ]),
        ...mapGetters("settings", [
            "getCurrentProjectUuid",
            "getCurrentLocale",
            "getSetting"
        ])
    },
    mounted() {
        this.totalObjects = this.countObjects();

        if (this.hasDownloadableFile) {
            this.titleMessage = this.$t("Packages.cached");
            this.processedObjectsCount = this.totalObjects;
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
            "addMetadata",
            "fetchSource",
            "deleteObjects"
        ]),
        ...mapActions("projects", [
            "addObjectsToProject",
            "getCurrentProjectRelation",
            "updateCurrentProjectRelations"
        ]),
        countObjects() {
            return this.getCurrentObjectsByType(["plus:Document", "vdi:DocumentationContainer"]).length;
        },
        generatePackage() {
            this.processedObjectsCount = 0;
            this.percent = 0;
            this.generateVDI();
        },
        addToStorage(blob, name) {
            name = `plusmeta-VDI2770-OT-${Date.now()}-${name}`;

            let object = template.object({
                type: "vdi:Container",
                name: name,
                source: {
                    type: "application/zip",
                    data: blob,
                    size: blob.size,
                    name: name + ".zip"
                }
            });

            let metaProjectRel = {
                uri: "plus:created-by-project",
                generator: "StepGenerateVDI",
                value: [this.getCurrentProjectUuid]
            };

            let metaCreated = {
                uri: "plus:CreationDate",
                generator: "StepGenerateVDI",
                value: Date.now()
            };

            this.saveObjectLocal(object);
            this.addMetadata({ objectUuid: object.uuid, objectMeta: metaProjectRel });
            this.addMetadata({ objectUuid: object.uuid, objectMeta: metaCreated });
            this.addObjectsToProject({
                projectUuid: this.getCurrentProjectUuid,
                objectUuids: [object.uuid]
            });

            return object.uuid;
        },
        async downloadPackage() {
            if (this.hasDownloadableFile) {
                this.downloadPackageLoading = true;
                let containerObjectUuid = this.getCurrentProjectRelationById("plus:relates-to-vdi2770-container")[0];
                let containerObject = this.getObjectByUuid(containerObjectUuid);
                util.downloadBlob(await this.fetchSource(containerObjectUuid), containerObject?.source?.name);
                this.downloadPackageLoading = false;
            }
        },
        async generateVDI() {
            this.titleMessage = this.$t("Packages.generate");

            const previousContainers = this.getCurrentObjectsByType(["vdi:Container", "vdi:MainDocument", "vdi:DocumentationContainer"]);
            await this.deleteObjects(previousContainers.map(o => o.uuid));
            this.totalContainers = 0;
            this.totalObjects = this.countObjects();

            const productLabel = this.getCurrentProjectRelationById("iirds:ProductVariant");
            const autoIdValues = this.getCurrentProjectRelationById("iirds:ObjectInstanceURI");
            const snValues = this.getCurrentProjectRelationById("iirds:SerialNumber");

            if (autoIdValues?.length > 0) {
                this.identities.push({ uri: "iirds:ObjectInstanceURI", value: autoIdValues});
            }
            if (snValues?.length > 0) {
                this.identities.push({ uri: "iirds:SerialNumber", value: snValues });
            }

            const [containerName, main] = await this.generateDocumentationContainer([productLabel[0], this.identities]);

            let containerID = await this.addToStorage(main, containerName);
            await this.updateCurrentProjectRelations({ "plus:relates-to-vdi2770-container": [containerID] });

            this.$refs?.status?.finish();
        },
        async generateDocumentationContainer(pvIdentity) {
            const [productLabel, identities] = pvIdentity;

            let zip = new JSzip();
            let objectName = productLabel;

            let containerName = identities.map(i => i?.value?.toString()).filter(Boolean).join(" ");
            containerName = this.sanitizeFilename(containerName);

            // Main pdf
            const table = await this.generateMainDocumentTable(productLabel);
            const pdf = await this.generateMainDocumentPDF(table, objectName, identities);
            zip.file("VDI2770_Main.pdf", pdf);

            // Main xml
            const main = await this.generateMainDocumentObject(pdf, table, productLabel, identities);
            const xml = await this.generateDocumentXML(main, productLabel, true);
            zip.file("VDI2770_Main.xml", xml);

            // Container per File
            const processDocsConfig = this.getCurrentObjectsByType(["plus:Document", "vdi:DocumentationContainer"]);
            for (let doc of processDocsConfig) {
                if (doc.type === "plus:Document") {

                    let documentContainer = new JSzip();

                    const docData = await this.fetchSource(doc.uuid);
                    documentContainer.file(doc.source.name, docData);

                    let documentMetadataXML = await this.generateDocumentXML(doc, productLabel);
                    documentContainer.file("VDI2770_Metadata.xml", documentMetadataXML);

                    let subZip = await documentContainer.generateAsync({
                        type: "blob",
                        compression: "DEFLATE",
                        compressionOptions: { level: 6 }
                    });

                    const uniqueId = await CryptoUtils.getDataHash("SHA-1", subZip);
                    const folderName = `${this.sanitizeWindowsFs(doc.name)} (${uniqueId})`;

                    let filename = `${folderName}.zip`;
                    zip.file(filename, subZip);
                }
                this.processedObjectsCount++;
            }

            this.totalContainers++;
            let blob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 6 }
            }, (metadata) => {
                this.percent = Math.round(metadata.percent);
            });

            await this.generateDocumentationContainerObject(blob, productLabel, main.uuid, identities);
            return [containerName, blob];
        },
        sanitizeFilename(objectName) {
            return (objectName) ? objectName.replace(/[\s\/]+/g, "-") : objectName;
        },
        generateMainDocumentPDF({ head, body }, name, identities) {
            const mainDocumentLabel = `${this.getPropertyLabelById("vdi:MainDocument")} (${name})`;
            const footerInfo = `VDI 2770 Open Toolkit - ${this.getOrganization.fullName} <${this.getOrganization.url}> - ${this.getOrganization.user} <${this.getOrganization.mail}>`;
            const info = identities.map(({ uri, value }) => {
                let label = this.getPropertyLabelById(uri) || uri;
                let values = value.map(v => this.isProperty(v) ? this.getPropertyLabelById(v) : v).join(", ");
                return `${label}: ${values}`;
            }).join("\n");

            return PdfService.instance(this).generateVdiMain(info, footerInfo, mainDocumentLabel, head, body);
        },
        async generateMainDocumentObject(pdf, { head, body }, productLabel, identities = {}) {
            const mainDocumentLabel = this.getPropertyLabelById("vdi:MainDocument");
            const objectName = productLabel;
            const nrOfPages = await pdfutil.getNrOfPages(pdf);

            let object = template.object({
                uuid: rdf.newUUID(),
                type: "vdi:MainDocument",
                name: `${objectName} (${mainDocumentLabel})`,
                text: head.flat().join(" ") + body.flat().join(" "),
                source: {
                    data: pdf,
                    name: "VDI2770_Main.pdf",
                    type: "application/pdf",
                    size: pdf.size
                }
            });


            let metaSets = [
                { uri: "vdi:has-language", value: [match.language(this.$store, this.getCurrentLocale)] },
                { uri: "pdf:totalPages", value: nrOfPages },
                { uri: "vdi:has-title", value: mainDocumentLabel },
                { uri: "vdi:has-document-category", value: ["vdi:ClassId:01-01"] },
                { uri: "vdi:has-document-type", value: ["vdi:MainDocument"] },
                { uri: "plus:created-by-project", value: [this.getCurrentProjectUuid] },
                { uri: "plus:CreationDate", value: Date.now() }
            ];

            await this.saveObjectLocal(object);
            for (let { uri, value } of metaSets) {
                await this.addMetadata({ objectUuid: object.uuid, objectMeta: { uri, value } });
            }
            for (let { uri, value } of identities) {
                await this.addMetadata({ objectUuid: object.uuid, objectMeta: { uri, value } });
            }
            await this.addObjectsToProject({
                projectUuid: this.getCurrentProjectUuid,
                objectUuids: [object.uuid]
            });
            return this.getObjectByUuid(object.uuid);
        },
        async generateDocumentationContainerObject(blob, productLabel, mainId, identities = {}) {
            const mainDocumentLabel = this.getPropertyLabelById("vdi:MainDocument");
            const objectName = productLabel;
            const containerName = this.sanitizeFilename(productLabel);
            const title = `${mainDocumentLabel} (${objectName})`;

            let object = template.object({
                uuid: rdf.newUUID(),
                externalId: mainId,
                type: "vdi:DocumentationContainer",
                name: title,
                source: {
                    data: blob,
                    name: `${containerName}.zip`,
                    type: blob.type,
                    size: blob.size
                }
            });

            let metaSets = [
                { uri: "vdi:has-language", value: [match.language(this.$store, this.getCurrentLocale)] },
                { uri: "vdi:has-title", value: title },
                { uri: "vdi:has-document-category", value: ["vdi:ClassId:01-01"] },
                { uri: "vdi:has-document-type", value: ["vdi:MainDocument"] },
                { uri: "plus:created-by-project", value: [this.getCurrentProjectUuid] },
                { uri: "plus:CreationDate", value: Date.now() }
            ];

            await this.saveObjectLocal(object);
            for (let { uri, value } of metaSets) {
                await this.addMetadata({ objectUuid: object.uuid, objectMeta: { uri, value } });
            }
            for (let { uri, value } of identities) {
                await this.addMetadata({ objectUuid: object.uuid, objectMeta: { uri, value } });
            }
            await this.addObjectsToProject({
                projectUuid: this.getCurrentProjectUuid,
                objectUuids: [object.uuid]
            });
        },
        generateDocumentXML(object, productLabel, mainDocument) {
            const objectsDomain = "http://data.plusmeta.de/objects";
            const objectsExtDomain = "http://data.plusmeta.de/objects/name";

            const namespaces = {
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.vdi.de/schemas/vdi2770 vdi2770.xsd",
                "xmlns": "http://www.vdi.de/schemas/vdi2770"
            };


            const root = create().ele("Document");

            for (let [key, value] of Object.entries(namespaces)) {
                root.att(key, value);
            }

            const now = new Date();
            root.com(`*** VDI 2770 Open Toolkit (v${process.env.VUE_APP_VERSION}) ***`);
            root.com(`*** generated on ${now.toLocaleString()} by ${this.getOrganization.user} <${this.getOrganization.mail}> ***`);


            root.ele("DocumentId", { "DomainId": objectsDomain, "IsPrimary": "true" }).txt((object.id));
            if (object.name) {
                root.ele("DocumentId", { "DomainId": objectsExtDomain }).txt(object.name);
            }

            root.ele("DocumentIdDomain", { "DocumentDomainId": objectsDomain })
                .ele("Party", { "Role": "Responsible" })
                .ele("Organization", {
                    "OrganizationId": this.getOrganization.url,
                    "OrganizationName": this.getOrganization.name,
                    "OrganizationOfficialName": this.getOrganization.fullName
                });

            const documentClassifications = this.getDocClassStrategies;
            for (let { concept, rel } of documentClassifications) {
                const classSystem = this.getPropertyAttributeById(concept, "plus:publicName");
                const assignedClasses = util.getMetadataValueAsArray(object, rel) || [];
                for (let classEntry of assignedClasses) {
                    const availableLabels = this.getPropertyLabels(classEntry);
                    const classId = this.getPropertyAttributeById(classEntry, "plus:publicName");
                    const elem = root.ele("DocumentClassification", { "ClassificationSystem": classSystem })
                        .ele("ClassId").txt(classId).up();
                    for (let [locale, label] of Object.entries(availableLabels)) {
                        elem.ele("ClassName", { Language: locale }).txt(label);
                    }
                }
            }

            const objectIds = this.getPropertiesByRole("plus:IdentityDomain");
            const projectIds = this.getPropertiesByRole("vdi:ProjectId");
            const refDesigIds = this.getPropertiesByRole("vdi:ReferenceDesignation");
            const equiIds = this.getPropertiesByRole("vdi:EquipmentId");
            const refObjIds = util.uniqueProperties([...objectIds, ...refDesigIds, ...equiIds, ...projectIds]);
            const referencedObject = root.ele("ReferencedObject");

            for (let identity of refObjIds) {
                const idRelation = this.getPropertyRelationById(identity.identifier, "plus:has-relations");
                const relation = (idRelation.length) ? idRelation[0] : identity.identifier;
                const metadataValue = util.getMetadataValue(object, relation);
                const normalizedIds = (Array.isArray(metadataValue)) ? metadataValue : [metadataValue];


                for (let value of normalizedIds.filter(Boolean)) {
                    let idValue = value;

                    const idLabel = this.getPropertyLabelById(value);
                    const idPublicNameByValue = this.getPropertyAttributeById(value, "plus:publicName");

                    if (idRelation.length && idLabel) idValue = idLabel;
                    if (idRelation.length && idPublicNameByValue) idValue = idPublicNameByValue;

                    if (objectIds.includes(identity)) {
                        const idType = this.getPropertyRelationById(identity.identifier, "vdi:is-object-identifier")[0];
                        const objType = this.getPropertyRelationById(idType, "vdi:has-object-type")[0];

                        const idTypeValue = (idType) ? this.getPropertyAttributeById(idType, "plus:publicName") : identity.identifier;
                        const objTypeValue = (objType) ? this.getPropertyAttributeById(objType, "plus:publicName") : "Type";

                        referencedObject.ele("ObjectId", {
                            "RefType": idTypeValue,
                            "ObjectType": objTypeValue,
                            "IsGloballyBiUnique": String(idTypeValue === "instance of object uri")
                        }).txt(idValue);
                    }
                    if (refDesigIds.includes(identity)) {
                        referencedObject.ele("ReferenceDesignation").txt(idValue);
                    }
                    if (equiIds.includes(identity)) {
                        referencedObject.ele("EquipmentId").txt(idValue);
                    }
                    if (projectIds.includes(identity)) {
                        referencedObject.ele("ProjectId").txt(idValue);
                    }
                }
            }

            referencedObject
                .ele("Party", { "Role": "Manufacturer" })
                .ele("Organization", {
                    "OrganizationId": this.getOrganization.url,
                    "OrganizationName": this.getOrganization.name,
                    "OrganizationOfficialName": this.getOrganization.fullName
                });

            referencedObject.ele("Description", { Language: this.getCurrentLocale }).txt(productLabel);

            const vers = root.ele("DocumentVersion");

            const revision = util.getMetadataValue(object, "iirds:revision") || 1;
            vers.ele("DocumentVersionId").txt(revision);

            const nrOfPages = util.getMetadataValue(object, "pdf:totalPages") || [];
            if (object.type === "plus:Document" && nrOfPages) {
                vers.att("NumberOfPages", nrOfPages);
            }

            const languages = util.getMetadataValue(object, "vdi:has-language") || [];
            for (let language of languages) {
                vers.ele("Language").txt(match.parseLocale(language));
            }

            vers.ele("Party", { "Role": "Author" })
                .ele("Organization", {
                    "OrganizationId": this.getOrganization.url,
                    "OrganizationName": this.getOrganization.name,
                    "OrganizationOfficialName": this.getOrganization.fullName
                });

            const description = (mainDocument) ? this.getPropertyById("vdi:MainDocument")?.description : util.getMetadataValue(object, "vdi:Comment");
            const keywords = (mainDocument) ? [this.getPropertyLabelById("vdi:MainDocument")] : util.getMetadataValue(object, "vdi:has-key-words");
            const title = (mainDocument) ? this.getPropertyLabelById("vdi:MainDocument") : util.getMetadataValue(object, "vdi:has-title");

            for (let language of languages) {
                const locale = match.parseLocale(language);
                const docDesc = vers.ele("DocumentDescription", { "Language": locale })
                    .ele("Title").txt(title).up()
                    .ele("Summary").txt(description).up();

                const docKeyWords = docDesc.ele("KeyWords");
                for (let keyword of keywords) {
                    docKeyWords.ele("KeyWord").txt(keyword);
                }
            }

            vers.ele("LifeCycleStatus", {
                SetDate: (new Date()).toISOString().split("T")[0],
                StatusValue: "Released"
            }).ele("Party", { "Role": "Responsible" })
                .ele("Organization", {
                    "OrganizationId": this.getOrganization.url,
                    "OrganizationName": this.getOrganization.name,
                    "OrganizationOfficialName": this.getOrganization.fullName
                });

            if (mainDocument) {
                const processDocsConfig = this.getCurrentObjectsByType(["plus:Document", "vdi:DocumentationContainer"]);
                for (let processObject of processDocsConfig)  {

                    const refRevision = util.getMetadataValue(processObject, "iirds:revision") || 1;
                    const refDescription = util.getMetadataValue(processObject, "vdi:Comment") || "";

                    const relationshipType = "RefersTo";
                    vers.ele("DocumentRelationship", { "Type": relationshipType })
                        .ele("DocumentId", { "DomainId": objectsDomain }).txt(processObject.id).up()
                        .ele("DocumentVersionId").txt(refRevision).up()
                        .ele("Description", { "Language": this.getCurrentLocale }).txt(refDescription);
                }
            }

            vers.ele("DigitalFile", { FileFormat: object.source.type, }).txt(object.source.name);
            return root.end({ prettyPrint: true });
        },
        generateMainDocumentTable(pv) {
            const head = [[
                "VDI-2770-ID",
                this.getPropertyLabelById("vdi:DocumentCategory"),
                this.getPropertyLabelById("plus:Document") + " ID",
                "Version",
                this.getPropertyLabelById("vdi:Language"),
                this.getPropertyLabelById("vdi:Title")
            ]];
            const body = [];
            if (pv) {
                const processDocsConfig = this.getCurrentObjectsByType(["plus:Document", "vdi:DocumentationContainer"]);
                for (let object of processDocsConfig) {
                    const vdiDocumentCategories = util.getMetadataValue(object, "vdi:has-document-category") || [];
                    const languages = util.getMetadataValue(object, "vdi:has-language") || [];
                    body.push([
                        vdiDocumentCategories.map(c => this.getPropertyAttributeById(c, "plus:publicName")).join(",\n"),
                        vdiDocumentCategories.map(c => this.getPropertyLabelById(c)).join(",\n"),
                        object.id,
                        util.getMetadataValue(object, "iirds:revision") || 1,
                        languages.map(lang => match.parseLocale(lang)).join(", "),
                        util.getMetadataValue(object, "vdi:has-title")
                    ]);
                }
            }
            return { head, body };
        },
        sanitizeWindowsFs(title) {
            // Ersetze invalide Symbole für Windows-FS ("\/:?<>*|)
            title = title.replace(/[\\"\/:?<>*|]+/g, " ");
            // Trimme doppelte Leerzeichen
            return title.replace(/[\s]+/g, " ");
        }
    }
};
</script>
