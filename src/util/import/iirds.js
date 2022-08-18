import JSzip from "jszip";
import semver from "semver";

import objectTemplate from "@/store/storage/template";
import iirds from "@/config/imports/iirdsMappings";

import util from "@/util";
import rdf from "@/util/rdf";

import validation from "@/util/validator-schema";

import { ConfConst } from "@/config/imports/const";

const VERBOSE = process.env.NODE_ENV !== "production";

export default {
    mimeType: {
        name: "application/iirds+zip",
        extension: "iirds"
    },
    params: {
        projectUuid: null,
        store: null
    },
    logs: [],
    async analyze(projectUuid, objectUuid, objectData, objectFilename, store, saveOnEnd = true) {
        this.params = {projectUuid, store};

        const blobContent = await util.readFile(objectData);
        const zip = await JSzip.loadAsync(blobContent);
        const parser = new DOMParser();

        if (!zip || !zip.files) {
            let rule = ({en: "Corrupt ZIP container"});
            return await this.setViolation(objectUuid, rule);
        }

        if (!Object.keys(zip.files).length) {
            let rule = ({en: "Empty ZIP container"});
            return await this.setViolation(objectUuid, rule);
        }

        const mimetypeFile = zip.files["mimetype"];
        if (!mimetypeFile) {
            let rule = ({en: "No mimetype file detected"});
            return await this.setViolation(objectUuid, rule);
        }

        let mimetypeString = null;
        if (mimetypeFile) mimetypeString = await zip.files["mimetype"].async("string");
        if (!mimetypeString || mimetypeString !== "application/iirds+zip") {
            let rule = ({en: "Wrong mimetype: " + mimetypeString});
            return await this.setViolation(objectUuid, rule);
        }

        const metadataFile = zip.files["META-INF/metadata.rdf"];
        if (!metadataFile) {
            let rule = ({en: "No metadata file detected"});
            return await this.setViolation(objectUuid, rule);
        }

        let metadataString = null;
        if (metadataFile) metadataString = await zip.files["META-INF/metadata.rdf"].async("string");

        if (!metadataString) {
            let rule = ({en: "Couldn't read metadata file"});
            return await this.setViolation(objectUuid, rule);
        }

        const metadataDoc = parser.parseFromString(metadataString, "application/xml");
        if (!metadataDoc) {
            let rule = ({en: "Malformed metadata file (XML parsing error)"});
            return await this.setViolation(objectUuid, rule);
        }

        // Schema validation based on ruleset
        const validationResult = validation.validateDocument(metadataString, null, "metadata.rdf");
        if (validationResult && Array.isArray(validationResult)) {
            await Promise.allSettled(validationResult.map(test => this.setViolation(objectUuid, test)));
        } else {
            let rule = ({en: "XML validation failed for M   ain document"});
            await this.setViolation(objectUuid, rule);
        }

        // const {version, restriction} = this.checkConformanceLevel(objectUuid);

        // await this.setViolation(objectUuid, version, restriction);

        await this.params.store.dispatch("projects/nextProjectStepLocal");

    },
    checkConformanceLevel(objectUuid) {
        let version = this.params.store.getters["storage/getMetadataValueByURI"](objectUuid, "iirds:iiRDSVersion");
        let restriction = this.params.store.getters["storage/getMetadataValueByURI"](objectUuid, "iirds:formatRestriction");

        if (version) {
            version = semver.coerce(String(version));
            version = [semver.major(version), semver.minor(version)].join(".");
        } else {
            this.log("No iiRDS version set", "error");
            version = "1.0";
        }

        if (restriction) {
            restriction = String(restriction).toUpperCase();
        }
        return {version, restriction};
    },
    async setViolation(objectUuid, test, version, restriction) {
        const locale = this.params.store.getters["settings/getCurrentLocale"];

        const violationObject = objectTemplate.object({
            externalId: objectUuid,
            type: "plus:RuleViolation",
            name: test.rule[locale],
            text: test.location,
            meta: {
                "plus:RuleText": objectTemplate.metadata({
                    uri: "plus:RuleText",
                    value: test.rule[locale],
                }),
                "plus:Rule": objectTemplate.metadata({
                    uri: "plus:Rule",
                    value: test.id,
                }),
                "plus:LineNr": objectTemplate.metadata({
                    uri: "plus:LineNr",
                    value: Number(test.lineNr),
                }),
                "plus:Line": objectTemplate.metadata({
                    uri: "plus:LineNr",
                    value: test.line,
                }),
                "plus:Level": objectTemplate.metadata({
                    uri: "plus:Level",
                    value: test.prio,
                }),
                "plus:Spec": objectTemplate.metadata({
                    uri: "plus:Spec",
                    value: test.spec,
                }),
                "plus:OriginalFileName": objectTemplate.metadata({
                    uri: "plus:OriginalFileName",
                    value: test.fileName,
                }),
                "plus:RuleType": objectTemplate.metadata({
                    uri: "plus:RuleType",
                    value: "plus:MetadataRule",
                })

            }
        });

        await this.params.store.dispatch("storage/saveObjectLocal", violationObject);
        await this.params.store.dispatch("projects/addObjectsToProject", {projectUuid: this.params.projectUuid, objectUuids: [violationObject.uuid]});
    },
    async setValidationResult(objectUuid, version, restriction) {
        let conformityString = `iiRDS ${version}`;
        if (restriction) conformityString = `${conformityString}/${restriction}`;

        if (this.logs.length) {
            await this.params.store.dispatch("storage/addMetadata", {
                objectUuid,
                objectMeta: {
                    uri: ConfConst.CONFORMITY_REPORT_PROP_ID,
                    value: this.logs,
                    provenance: "System"
                }
            });
        }

        await this.params.store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                uri: ConfConst.CONFORMITY_PROP_ID,
                value: [conformityString],
                provenance: "System"
            }
        });

        this.logs = [];
    },
    async handleDirectories(directoryNodes, projectUuid, localObjectStore) {
        const directoryUuids = [];

        // get only root directory nodes
        const directoryRoots = Array.from(directoryNodes).filter((node) => {
            return !["iirds:has-next-sibling", "iirds:has-first-child"].includes(node.parentNode.tagName);
        });

        for (let dir of directoryRoots) {
            const dirTree = [];
            const dirUuid = rdf.newUUID();
            const dirExtId = dir.getAttribute("rdf:about");

            let nodeId = 0;

            // normalize Directory and remove nested information units
            const nodeReferences = dir.querySelectorAll("relates-to-information-unit");
            Array.from(nodeReferences).forEach((nodeRef) => {
                if (nodeRef.hasAttribute("rdf:resource")) return;
                let node = nodeRef.querySelector(iirds.$("objects"));
                if (node.hasAttribute("rdf:about")) {
                    let nodeUri = node.getAttribute("rdf:about");
                    nodeRef.setAttribute("rdf:resource", nodeUri);
                    nodeRef.removeChild(node);
                }
            });

            const getLabel = (node, object) => {
                let rdfLabel = node.querySelector(":scope > label");
                return rdfLabel.textContent || object?.name || "Direcory Node";
            };
            const getObject = (node) => {
                let extRef = node.querySelector(":scope > relates-to-information-unit");
                let extId = (extRef) ? extRef.getAttribute("rdf:resource") : null;
                return localObjectStore.find(o => o.externalId === extId);
            };

            const treeWalker = (node, tree) => {
                let relObj = getObject(node);
                let newNode = { id: ++nodeId, name: getLabel(node, relObj)};
                let sibling = node.querySelector(":scope > has-next-sibling > DirectoryNode");
                let child = node.querySelector(":scope > has-first-child > DirectoryNode");

                if (relObj) {
                    newNode.object = relObj.uuid;
                }

                if (child) {
                    newNode.children = [];
                    treeWalker(child, newNode.children);
                }

                tree.push(newNode);

                if (sibling) {
                    treeWalker(sibling, tree);
                }
            };

            treeWalker(dir, dirTree);


            const newFile = new Blob(
                [JSON.stringify(dirTree)],
                {type: "application/json"}
            );

            let name = "Directory";

            // limit query to direct children with :scope pseudo selector
            const nameEl = dir.querySelector(":scope > label");
            if (nameEl) name = nameEl.textContent;

            let type = "iirds:TableOfContents";
            const typeEl = dir.querySelector("has-directory-structure-type");
            if (typeEl) {
                if (typeEl.hasAttribute("rdf:resource")) {
                    type = typeEl.getAttribute("rdf:resource");
                }

                if (this.isEmpty(type)) {
                    const instance = dir.querySelector("DirectoryNodeType");
                    type = (!!instance) ? instance.getAttribute("rdf:about") : undefined;
                }
            }

            // normalize type
            type = rdf.collapse(type, this.params.store);

            const dirObject = objectTemplate.object({
                uuid: dirUuid,
                externalId: dirExtId,
                type: "plus:Directory",
                name: name,
                text: JSON.stringify(dirTree),
                published: this.params.store.getters["projects/getPublishedState"](projectUuid),
                source: {
                    data: newFile,
                    name: `${dirUuid}.json`,
                    type: "application/json",
                    size: newFile.size
                }
            });

            await this.params.store.dispatch("storage/saveObjectLocal", dirObject);
            await this.params.store.dispatch("storage/addMetadata", {
                objectUuid: dirUuid,
                objectMeta: {
                    uri: "iirds:has-directory-structure-type",
                    value: type,
                    provenance: "File"
                }
            });

            directoryUuids.push(dirUuid);
        }
        return directoryUuids;
    },
    isEmpty(str) {
        // eslint-disable-next-line no-eq-null
        return !str || 0 === str.length;
    },
    log(msg, level) {
        if (level !== "info") this.logs.push(msg);
        // eslint-disable-next-line no-console
        if (VERBOSE) console.log(msg);
    }
};
