import JSzip from "jszip";
import semver from "semver";

import template from "@/store/properties/template";
import objectTemplate from "@/store/storage/template";
import iirds from "@/config/imports/iirdsMappings";

import util from "@/util";
import rdf from "@/util/rdf";
import match from "@/util/match";

import validation from "@/util/validator-schema";
import generic from "@/util/import/generic";

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
            this.log("Corrupt ZIP container", "warning");
            return await this.setValidationResult(objectUuid);
        }

        if (!Object.keys(zip.files).length) {
            this.log("Empty ZIP container", "error");
            return await this.setValidationResult(objectUuid);
        }

        const mimetypeFile = zip.files["mimetype"];
        if (!mimetypeFile) {
            this.log("No mimetype file detected", "warning");
            return await this.setValidationResult(objectUuid);
        }

        let mimetypeString = null;
        if (mimetypeFile) mimetypeString = await zip.files["mimetype"].async("string");
        if (!mimetypeString || mimetypeString !== "application/iirds+zip") {
            this.log("Wrong mimetype: " + mimetypeString, "warning");
            return await this.setValidationResult(objectUuid);
        }

        const metadataFile = zip.files["META-INF/metadata.rdf"];
        if (!metadataFile) {
            this.log("No metadata file detected", "error");
            return await this.setValidationResult(objectUuid);
        }

        let metadataString = null;
        if (metadataFile) metadataString = await zip.files["META-INF/metadata.rdf"].async("string");

        if (!metadataString) {
            this.log("Couldn't read metadata file", "error");
            return await this.setValidationResult(objectUuid);
        }

        const metadataDoc = parser.parseFromString(metadataString, "application/xml");
        if (!metadataDoc) {
            this.log("Malformed metadata file (XML parsing error)", "error");
            return await this.setValidationResult(objectUuid);
        }

        // Schema validation based on ruleset
        const [validationResult, validationMessages] = validation.validateDocument(metadataDoc, "Main", "//META-INF/metadata.rdf");
        console.log(validationResult, validationMessages);
        if (!validationResult) {
            if (validationMessages && Array.isArray(validationMessages)) {
                validationMessages.forEach(msg => this.log(msg, "error"));
            } else {
                this.log("XML validation failed for Main document", "error");
            }
            return await this.setValidationResult(objectUuid);
        }

        let infoUnitCount = 0;
        let packageExtId2Uuid = [];

        const infoUnitUuids = [];
        const infoUnitObjects = (!!metadataDoc) ? metadataDoc.querySelectorAll(iirds.$("objects")) : [];

        const localObjectStore = []; // needed to build directory

        for (let IU of infoUnitObjects) {
            const objectType = iirds.objects[IU.localName];
            let infoUnitUuid = rdf.newUUID();

            let objectExternalId = undefined;

            if (objectType === "iirds:Container") {
                infoUnitUuid = objectUuid;
                objectExternalId = IU.getAttribute("rdf:about");
                packageExtId2Uuid = [objectExternalId, objectUuid];
            } else if (IU.hasAttribute("rdf:about")) {
                infoUnitCount++;
                objectExternalId = IU.getAttribute("rdf:about");
            }

            if (!IU.childElementCount && objectType !== "plus:GenericObject") {
                this.log("Skipping empty InformationUnit: " + infoUnitUuid, "error");
                continue;
            }

            if (["iirds:Fragment", "plus:Fragment"].includes(objectType) && extractFragments) {
                this.log("Only extracting fragments from HTML: " + infoUnitUuid, "error");
                continue;
            }

            const RD = IU.querySelector("Rendition");
            // Rendition properties
            const renditionFileType = (RD && RD.querySelector("format")) ? RD.querySelector("format").textContent.trim() : undefined;
            const renditionFilePath = (RD && RD.querySelector("source")) ? RD.querySelector("source").textContent.trim() : "";
            const renditionFileName = (!!renditionFilePath) ? renditionFilePath.split("/").pop() : "";
            // Available props
            const titleAvailable = !!IU.querySelector("title");
            const fileAvailable = zip.files[renditionFilePath];
            const matchedMimeType = match.mimeType(store, String(renditionFileType), String(renditionFileName));

            // set title for object
            let objectName = null;
            let iirdsTitle = null;
            if (titleAvailable) {
                iirdsTitle = IU.querySelector("title").textContent;
                objectName = iirdsTitle.trim();
            } else if (renditionFileName) {
                objectName = renditionFileName;
            } else if (objectType === "iirds:Container") {
                objectName = objectFilename;
            } else {
                objectName = `${IU.localName} ${infoUnitCount}`;
            }

            // get file for object
            let renditionFile = null;
            if (fileAvailable) {
                renditionFile = await zip.files[renditionFilePath].async("blob");
            } else if (!!RD) {
                this.log("Unavailable rendition: " + renditionFilePath, "error");
                continue;
            }

            let renditionSize = (renditionFile) ? renditionFile.size : 0;

            const object = {
                uuid: infoUnitUuid,
                published: this.params.store.getters["projects/getPublishedState"](projectUuid),
                name: objectName,
                type: objectType
            };

            if (objectExternalId) {
                object.externalId = objectExternalId;
            }

            if (fileAvailable && renditionFileName && renditionFile) {
                object.source = {
                    type: matchedMimeType,
                    name: renditionFileName,
                    data: renditionFile,
                    size: renditionSize
                };
            }

            await this.params.store.dispatch("storage/saveObjectLocal", object);
            localObjectStore.push(object);

            if (!!iirdsTitle) {
                await this.params.store.dispatch("storage/addMetadata", {
                    objectUuid: infoUnitUuid, objectMeta: {
                        uri: "iirds:title",
                        provenance: "File",
                        generator: "iiRDS",
                        confidence: 1,
                        value: iirdsTitle
                    }
                });
            }

            if (!!renditionFilePath) {
                let struct = renditionFilePath.split("/").filter(Boolean) || [];
                if (struct.length > 1) {
                    await this.params.store.dispatch("storage/addMetadata", {
                        objectUuid: infoUnitUuid, objectMeta: {
                            uri: "plus:DirectoryPath",
                            provenance: "File",
                            generator: "iiRDS",
                            confidence: 1,
                            value: struct.slice(0, struct.length - 1),
                        }
                    });
                }
            }


            if (projectUuid) {
                this.params.store.dispatch("projects/addObjectsToProject", {projectUuid, objectUuids: [infoUnitUuid]});
            }
            infoUnitUuids.push(infoUnitUuid);


            const METADATA = IU.querySelectorAll(iirds.$("metadata"));
            for (let META of METADATA) {

                const relation = `iirds:${META.localName}`;
                const existing = this.params.store.getters["storage/getMetadataValueByURI"](infoUnitUuid, relation);

                let current = undefined;

                // Reference to resource
                if (META.hasAttribute("rdf:resource")) {
                    current = META.getAttribute("rdf:resource");
                }

                // Reference to Package in Container
                if (current && relation === "iirds:is-part-of-package" && packageExtId2Uuid.length) {
                    // if reference matches contained package then remap to object uuid
                    if (current === packageExtId2Uuid[0]) current = packageExtId2Uuid[1];
                }

                // Nested instance definition
                const mapping = iirds.metadata[META.localName];
                if (this.isEmpty(current) && !!mapping) {
                    const selector = Array.isArray(mapping) ? mapping.join(", ") : mapping;
                    const instance = META.querySelector(selector);
                    current = (!!instance) ? instance.getAttribute("rdf:about") : undefined;
                }

                // Case for nested instance definition which are not predefined
                if (this.isEmpty(current)) {
                    let nestedDefinitions = META.querySelectorAll("*");
                    // loop necessary because querySelector/All with namespaced attributes fails in browser
                    for (let DEF of nestedDefinitions) {
                        if (DEF && DEF.hasAttribute("rdf:about")) {
                            current = DEF.getAttribute("rdf:about");
                        }
                    }
                }

                // Property literal
                if (this.isEmpty(current) && META.firstChild?.nodeType === 3) {
                    if (relation === "iirds:language") {
                        current = match.language(store, META.textContent);
                    } else {
                        current = META.textContent;
                    }
                }

                if (!this.isEmpty(current)) {
                    const value = rdf.collapse(current, store);
                    const assigned = (existing) ? [...existing] : [];
                    if (!assigned.includes(value)) assigned.push(value);

                    await this.params.store.dispatch("storage/addMetadata", {
                        objectUuid: infoUnitUuid, objectMeta: {
                            uri: relation,
                            provenance: "File",
                            generator: "iiRDS",
                            confidence: 1,
                            value: assigned
                        }
                    });
                }
            }
        }

        const directoryNodes = (!!metadataDoc) ? metadataDoc.querySelectorAll(iirds.directory) : [];
        const directoryUuids = await this.handleDirectories(directoryNodes, projectUuid, localObjectStore);

        if (directoryUuids.length) {
            infoUnitUuids.push(...directoryUuids);

            await this.params.store.dispatch("storage/addMetadata", {
                objectUuid,
                objectMeta: {
                    uri: "plus:has-directories",
                    value: directoryUuids
                }
            });
        }

        const propObjects = [];
        const PROPS = metadataDoc.querySelectorAll(iirds.$("properties"));

        for (let PROP of PROPS) {
            const propClass = iirds.properties[PROP.localName];
            const propId = PROP.getAttribute("rdf:about") || ":no-id";
            const normalizedPropId = rdf.collapse(propId, store);

            let propLabel = undefined;
            const LABELS = PROP.querySelectorAll("label");

            // one label = language neutral
            if (LABELS.length === 1) {
                propLabel = LABELS.item(0).textContent;
                // multiple labels
            } else if (LABELS.length > 1) {
                // multiple language-specific labels
                if ([...LABELS].every(l => l.hasAttribute("xml:lang"))) {
                    propLabel = {};
                    for (let LOC of LABELS) {
                        let locale = LOC.getAttribute("xml:lang");
                        if (!!locale) propLabel[locale] = LOC.textContent;
                    }
                    // multiple language-neutral labels
                } else {
                    propLabel = [];
                    for (let LOC of LABELS) {
                        propLabel.push(LOC.textContent);
                    }
                    propLabel = propLabel.filter(Boolean).join(" - ");
                }
                // fallback label derived from Class + ID
            } else {
                propLabel = (propClass.split(":") || []).pop() + "-" + (normalizedPropId.split(/[:\/]/)).pop();
            }

            const propObject = template({
                subClassOf: propClass,
                datatype: "plus:Instance",
                identifier: normalizedPropId,
                label: propLabel
            });

            propObjects.push(propObject);
        }

        await this.params.store.dispatch("properties/createProperties", util.uniqueProperties(propObjects));
        await this.params.store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                uri: "plus:iiRDSAnalysisComplete",
                value: Date.now()
            }
        });

        await generic.addGenericMetadata(objectUuid, objectData, objectFilename, store);

        const {version, restriction} = this.checkConformanceLevel(objectUuid);

        await this.setValidationResult(objectUuid, version, restriction);

        if (projectUuid) {
            this.params.store.dispatch("projects/addObjectsToProject", {projectUuid, objectUuids: infoUnitUuids});
        }

        if (saveOnEnd) {
            while (infoUnitUuids.length) {
                let infoUnitsBatch = infoUnitUuids.splice(0, 5);
                if (projectUuid) {
                    await this.params.store.dispatch("storage/saveObjectsToProjectRemote", {
                        projectUuid,
                        objectUuids: infoUnitsBatch
                    });
                } else {
                    await this.params.store.dispatch("storage/saveObjectsRemoteByUuids", infoUnitsBatch);
                }
            }
        }
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
