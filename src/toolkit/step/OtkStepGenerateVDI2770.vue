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
      <v-flex xs3>
        <v-card class="pa-0 flex-grow-1 text-center" color="info">
          <v-card-text class="display-3 pb-0">
            {{ percent }} %
          </v-card-text>
          <v-card-text class="title pb-0">
            {{ $t('Packages.progress') }}
          </v-card-text>
          <v-card-text class="subtitle-1 pt-0">
            {{ $t('Packages.packaging') }} ({{ mainContainer || totalContainers }})
          </v-card-text>
        </v-card>
      </v-flex>
    </ProcessObjects>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { create } from "xmlbuilder2";

import JSzip from "jszip";
import ObjectHash from "object-hash";

import allSettled from "@ungap/promise-all-settled";

import util from "@/util";
import rdf from "@/util/rdf";
import pdfutil from "@/util/import/pdf";
import match from "@/util/match";
import titleUtils from "@/util/title";
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
            productLabelToRefValues: {},
            assignedManufacturersOnDocs: []
        };
    },
    computed: {
        getOrganization() {
            return {
                name: this.getSetting("base_orga_name"),
                user: this.getSetting("base_user_name"),
                mail: this.getSetting("base_user_mail"),
                url: this.getSetting("base_orga_url"),
                fullName: this.getSetting("base_orga_fullname") || this.getSetting("base_orga_name"),
            };
        },
        hasDownloadableFile() {
            return this.getCurrentProjectRelationById("plus:relates-to-vdi2770-package").length > 0;
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
            "getCurrentProjectName",
            "getCurrentProjectRelationById",
            "getProjectRelationById"
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
                let packageObjectUuid = this.getCurrentProjectRelationById("plus:relates-to-vdi2770-package")[0];
                let packageObject = this.getObjectByUuid(packageObjectUuid);
                util.downloadBlob(await this.fetchSource(packageObjectUuid), packageObject?.source?.name);
                this.downloadPackageLoading = false;
            }
        },
        async generateVDI() {
            this.titleMessage = this.$t("Packages.generate");

            const productLabel = this.getCurrentProjectRelationById("vdi:ProductVariant")?.[0];
            const autoIdValues = this.getCurrentProjectRelationById("vdi:IEC61406");
            const snValues = this.getCurrentProjectRelationById("vdi:SerialNumber");
            this.identities = [];
            if (autoIdValues?.length > 0) {
                this.identities.push({ uri: "vdi:IEC61406", value: autoIdValues});
            }
            if (snValues?.length > 0) {
                this.identities.push({uri: "vdi:SerialNumber", value: snValues });
            }

            const [containerName, main] = await this.generateDocumentationContainer([productLabel, this.identities]);

            let packageID = await this.addToStorage(main, containerName);
            await this.updateCurrentProjectRelations({ "plus:relates-to-vdi2770-package": [packageID] });

            this.$refs?.status?.finish();
        },
        async generateDocumentationContainer(pvIdentity) {
            const [productLabel, identities] = pvIdentity;

            let zip = new JSzip();
            let objectName = productLabel;
            let containerName = this.sanitizeFilename(productLabel);

            // Main pdf
            const table = await this.generateMainDocumentTable(productLabel);
            const pdf = await this.generateMainDocumentPDF(table, objectName, identities);
            zip.file("VDI2770_Main.pdf", pdf);

            // Main xml
            const main = await this.generateMainDocumentObject(pdf, table, productLabel, identities);
            const xml = await this.generateDocumentXML(main, productLabel);
            zip.file("VDI2770_Main.xml", xml);

            // Container per File
            const processDocsConfig = this.getCurrentObjectsByType(["plus:Document", "vdi:DocumentationContainer"]);
            for (let doc of processDocsConfig) {
                if (doc.type === "plus:Document") {

                    let documentContainer = new JSzip();

                    const docData = await this.fetchSource(doc.uuid);
                    documentContainer.file(doc.source.name, docData);

                    let documentMetadataXML = await this.generateDocumentXML(doc);
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
            const footerInfo = `VDI 2770 Open Toolkit -  ${this.getOrganization.fullName} (Contact: ${this.getOrganization.mail})`;
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
        generateDocumentXML(object, productLabel) {
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

            let now = new Date();
            root.com(`*** VDI 2770 Open Toolkit (v${process.env.VUE_APP_VERSION}) ***`);
            root.com(`*** generated on ${now.toLocaleString()} by ${this.getOrganization.user} <${this.getOrganization.mail}> ***`);


            root.ele("DocumentId", { "DomainId": objectsDomain, "IsPrimary": "true" }).txt((object.id || 1312));
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
                let classSystem = this.getPropertyAttributeById(concept, "plus:publicName");
                let assignedClasses = util.getMetadataValueAsArray(object, rel) || [];
                for (let classEntry of assignedClasses) {
                    let availableLabels = this.getPropertyLabels(classEntry);
                    let classId = this.getPropertyAttributeById(classEntry, "plus:publicName");
                    let elem = root.ele("DocumentClassification", { "ClassificationSystem": classSystem })
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
            const refObjIds = util.uniqueProperties([...objectIds, ...projectIds, ...refDesigIds, ...equiIds]);
            const refObjIdsIdentifier = [];
            const refObjIdsIndividualIdentifier = [];
            let mainObjectRef = root.ele("ReferencedObject");

            for (let identity of refObjIds) {
                let idRelation = this.getPropertyRelationById(identity.identifier, "plus:has-relations");
                let relation = (idRelation.length) ? idRelation[0] : identity.identifier;
                let metadataValue = util.getMetadataValue(object, relation);
                let normalizedIds = (Array.isArray(metadataValue)) ? metadataValue : [metadataValue];

                refObjIdsIdentifier.push(...normalizedIds);

                for (let value of normalizedIds.filter(Boolean)) {
                    let idValue = value;
                    const idLabel = this.getPropertyLabelById(value);
                    const idPublicNameByValue = this.getPropertyAttributeById(value, "plus:publicName");
                    if (idRelation.length && idLabel) idValue = idLabel;
                    if (idRelation.length && idPublicNameByValue) idValue = idPublicNameByValue;

                    // Reihenfolge wichtig! ObjectId -> ReferenceDesignation -> EquipmentId -> ProjectId ----> Party -----> Description
                    // ObjectId
                    if (objectIds.includes(identity)) {
                        let idType = this.getPropertyRelationById(identity.identifier, "vdi:is-object-identifier")[0];
                        let objType = this.getPropertyRelationById(idType, "vdi:has-object-type")[0];
                        let objTypeFallback = this.getPropertyRelationById(identity.identifier, "vdi:has-object-type")[0];

                        let idTypeValue = (idType) ? this.getPropertyById(idType)?.indicators[0] : identity.identifier;
                        let objTypeValue = (objType) ? this.getPropertyById(objType)?.indicators[0] : "Type";
                        if (objTypeFallback) objTypeValue = this.getPropertyById(objTypeFallback)?.indicators[0];

                        if (objTypeValue === "Individual") {
                            refObjIdsIndividualIdentifier.push(idValue);
                        }

                        mainObjectRef.ele("ObjectId", {
                            "RefType": idTypeValue,
                            "ObjectType": objTypeValue,
                            "IsGloballyBiUnique": String(idTypeValue === "instance of object uri")
                        }).txt(idValue);
                    }
                    // ReferenceDesignation
                    if (refDesigIds.includes(identity)) {
                        mainObjectRef.ele("ReferenceDesignation").txt(idValue);
                    }
                    // EquipmentId
                    if (equiIds.includes(identity)) {
                        mainObjectRef.ele("EquipmentId").txt(idValue);
                    }
                    // ProjectId
                    if (projectIds.includes(identity)) {
                        mainObjectRef.ele("ProjectId").txt(idValue);
                    }
                }
            }

            mainObjectRef
                .ele("Party", { "Role": "Manufacturer" })
                .ele("Organization", {
                    "OrganizationId": this.getOrganization.url,
                    "OrganizationName": this.getOrganization.name,
                    "OrganizationOfficialName": this.getOrganization.fullName
                });

            mainObjectRef.ele("Description", { Language: this.getCurrentLocale }).txt(productLabel);

            const vers = root.ele("DocumentVersion");

            let revision = util.getMetadataValue(object, "iirds:revision") || 1;
            if (Array.isArray(revision) && revision.length > 0) {
                revision = revision[0];
            }
            vers.ele("DocumentVersionId").txt(revision);

            let nrOfPages = util.getMetadataValue(object, "pdf:totalPages") || [];
            if (object.type === "plus:Document" && nrOfPages) {
                vers.att("NumberOfPages", nrOfPages);
            }

            let languages = util.getMetadataValue(object, "vdi:has-language") || [];
            for (let language of languages) {
                vers.ele("Language").txt(match.parseLocale(language));
            }

            vers.ele("Party", { "Role": "Author" })
                .ele("Organization", {
                    "OrganizationId": this.getOrganization.url,
                    "OrganizationName": this.getOrganization.name,
                    "OrganizationOfficialName": this.getOrganization.fullName
                });

            const title = util.getMetadataValue(object, "vdi:has-title") || "";

            for (let language of languages) {
                const locale = match.parseLocale(language);

                let { generatedTitle } = titleUtils.generateTitle(this.$store, object, locale);
                if (!generatedTitle) {
                    let docTypeId = util.getMetadataValueAsArray(object, "vdi:has-document-type")[0];
                    let docTypeProp = this.getPropertyById(docTypeId);
                    if (docTypeProp && docTypeProp.description) {
                        generatedTitle = docTypeProp.description;
                    }
                }

                let docDesc = vers.ele("DocumentDescription", { "Language": locale })
                    .ele("Title").txt(title).up()
                    .ele("Summary").txt(generatedTitle).up();
                let docKeyWords = docDesc.ele("KeyWords");
                let keyWords = this.getKeyWords(object, documentClassifications, locale);
                for (let keyWord of keyWords) {
                    docKeyWords.ele("KeyWord").txt(keyWord);
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

            if (productLabel) {
                const processDocsConfig = this.getCurrentObjectsByType(["plus:Document", "vdi:DocumentationContainer"]);
                for (let processObject of processDocsConfig)  {

                    let docVers = util.getMetadataValue(processObject, "iirds:revision") || 1;
                    let { generatedTitle } = titleUtils.generateTitle(this.$store, processObject, this.getCurrentLocale);

                    const relationshipType = (processObject.type === "plus:MediaArchive") ? "includesSupplierData" : "RefersTo";
                    vers.ele("DocumentRelationship", { "Type": relationshipType })
                        .ele("DocumentId", { "DomainId": objectsDomain }).txt(processObject.id || 1312).up()
                        .ele("DocumentVersionId").txt(docVers).up()
                        .ele("Description", { "Language": this.getCurrentLocale }).txt(generatedTitle);
                }
            }

            if (object.type === "plus:MediaArchive") {
                let supplierlabel = this.getPropertyLabelById("iirds:Supplier");
                let supplierFileName = `${supplierlabel}.pdf`;
                vers.ele("DigitalFile", { FileFormat: "application/pdf", }).txt(supplierFileName);
            } else {
                vers.ele("DigitalFile", { FileFormat: object.source.type, }).txt(object.source.name);
            }
            const wasOCR = !!util.getMetadataValue(object, "plus:OCRCompleted");
            if (wasOCR && object.text.length) {
                vers.ele("DigitalFile", { FileFormat: "Text/plain", }).txt(object.source.name + ".txt");
            }

            return root.end({ prettyPrint: true });
        },
        getKeyWords(object, documentClassifications, locale) {
            let values = [];
            let customKeywords = util.getMetadataValue(object, "vdi:has-key-words");

            if (customKeywords && customKeywords.length) {
                values = customKeywords.filter(Boolean);
            } else {
                values = [
                    Object.values(this.identities),
                    this.getOrganization.name
                ];

                for (let { rel } of documentClassifications) {
                    values.push(util.getMetadataValue(object, rel));
                }

                values = values
                    .filter(Boolean)
                    .flatMap(v => this.getPropertyLabelById(v, locale) || this.getPropertyLabelById(v))
                    .filter(Boolean);
            }
            return util.uniqueValues(values);
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
            let body = [];
            if (pv) {
                const processDocsConfig = this.getCurrentObjectsByType(["plus:Document", "vdi:DocumentationContainer"]);
                for (let object of processDocsConfig) {
                    let VDIDocumentCategories = util.getMetadataValue(object, "vdi:has-document-category") || [];
                    let languages = util.getMetadataValue(object, "vdi:has-language") || [];
                    body.push([
                        VDIDocumentCategories.map(c => this.getPropertyAttributeById(c, "plus:publicName")).join(",\n"),
                        VDIDocumentCategories.map(c => this.getPropertyLabelById(c)).join(",\n"),
                        util.getMetadataValue(object, "vdi:DocumentId") || (object.id || 1312),
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
