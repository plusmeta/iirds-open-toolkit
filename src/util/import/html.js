/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import rdf from "@/util/rdf";
import match from "@/util/match";
import { extract } from "@/util/sanitize";
import template from "@/store/storage/template";
import util from "@/util";

export default {
    async analyze (projectUuid, objectUuid, objectData, objectFilename, store) {
        let htmlContent = undefined;
        try {
            htmlContent = await util.readFile(objectData, "text");
        } catch (error) {
            return error;
        }
        const parser = new DOMParser();
        const document = parser.parseFromString(htmlContent, "text/html");

        const generateMetadata = async (key, val, prov, id = objectUuid, conf = 1) => {
            await store.dispatch("storage/addMetadata", {
                objectUuid: id,
                objectMeta: {
                    uri: (key.includes(":")) ? key : `html:${key}`,
                    value: val,
                    provenance: prov,
                    confidence: conf,
                    generator: "AnalyzeHTML"
                }
            });
        };

        const extractFragments = store.getters["workflows/getCurrentWorkflowSetting"]("plus:extract-fragments");

        // Check for <meta> elements in <head>
        const metaElements = document.querySelectorAll("head meta");
        if (metaElements !== null) {
            for (let meta of Array.from(metaElements)) {
                if (!!meta.name.length && !!meta.content.length) {

                    let metaName = rdf.collapse(meta.name, store);
                    if (!metaName.includes(":")) metaName = `html:${metaName}`;
                    let metaValue = rdf.collapse(meta.content, store);

                    if (store.getters["properties/isProperty"](metaName)) {
                        if (store.getters["properties/getPropertyType"](metaName) === "plus:Relation" ||
                            store.getters["properties/getPropertyRelationById"](metaName, "plus:has-roles").includes("plus:Relation")) {
                            const relatedNamespace = store.getters["properties/getPropertyRelationById"](metaName, "plus:has-namespace")[0];
                            const namespaceProp = store.getters["properties/getPropertyById"](relatedNamespace);
                            if (!!relatedNamespace && !!namespaceProp) metaValue = `${namespaceProp.indicators[0]}:${metaValue}`;
                            const existing = store.getters["storage/getMetadataValueByURI"](objectUuid, metaName);
                            const assigned = (existing && Array.isArray(existing)) ? [...existing] : [];
                            if (!assigned.includes(metaValue)) assigned.push(metaValue);
                            metaValue = assigned;
                        }
                    }

                    await generateMetadata(metaName, metaValue, "HTML");
                }
            };
        }

        // Check for @lang or @xml:lang attribute on <html>
        const langAttribute = document.firstElementChild.lang;
        let langSetForDocument = null;
        if (langAttribute && langAttribute !== "") {
            let matchedLang = match.language(store, langAttribute);
            await generateMetadata("iirds:language", [matchedLang], "HTML");
            langSetForDocument = [langAttribute];
        }

        // Check for Fragments in the HTML
        if (extractFragments) {
            const fragmentUuids = [];
            let selector = "[data-plus-convert-to-object='iirds:Fragment'], [data-plus-convert-to-object='plus:Fragment']";
            let fragments = document.querySelectorAll(selector);
            if (fragments !== null) {
                for (let fragment of Array.from(fragments)) {
                    let fragmentText = extract(fragment);
                    let fragmentUUID = rdf.uuidFromString(fragmentText.trim());
                    let fragmentName = (fragmentText.trim().length > 50) ? fragmentText.trim().substr(0,50) + "..." : fragmentText.trim();
                    let newFile = new File(
                        [fragment.outerHTML],
                        `${fragmentUUID}.html`,
                        {type: "text/html"}
                    );
                    let fragmentObject = template.object({
                        uuid: fragmentUUID,
                        type: "plus:Fragment",
                        name: fragmentName,
                        text: fragmentText,
                        published: store.getters["projects/getPublishedState"](projectUuid),
                        source: {
                            data: newFile,
                            name: `${fragmentUUID}.html`,
                            type: "text/html",
                            size: newFile.size
                        }
                    });

                    if (!store.getters["storage/getObjectByUuid"](fragmentUUID)) {
                        store.dispatch("storage/saveObjectLocal", fragmentObject);
                        await store.dispatch("storage/uploadSource", { objectUuid: fragmentUUID });
                        fragmentUuids.push(fragmentUUID);
                    }

                    await generateMetadata("plus:has-parent-topic", [objectUuid], "HTML", fragmentUUID, 1);

                    if (langSetForDocument) {
                        await generateMetadata("iirds:language", [langSetForDocument], "System", fragmentUUID, 0.75);
                    }

                    // Check for @data-* attributes on fragment
                    for (let {name, value} of Array.from(fragment.attributes)) {

                        if (name.startsWith("data-plus-")) {
                            name = `plus:${name.substring(10)}`;
                        } else if (name.startsWith("data-iirds-")) {
                            name = `iirds:${name.substring(11)}`;
                        } else {
                            name = `html:${name}`;
                        }

                        let metaName = rdf.collapse(name, store);
                        if (!metaName.includes(":")) metaName = `html:${metaName}`;
                        let metaValue = rdf.collapse(value, store);

                        if (store.getters["properties/isProperty"](metaName)) {
                            if (store.getters["properties/getPropertyType"](metaName) === "plus:Relation" ||
                                store.getters["properties/getPropertyRelationById"](metaName, "plus:has-roles").includes("plus:Relation")) {
                                const relatedNamespace = store.getters["properties/getPropertyRelationById"](metaName, "plus:has-namespace")[0];
                                const namespaceProp = store.getters["properties/getPropertyById"](relatedNamespace);
                                if (!!relatedNamespace && !!namespaceProp) metaValue = `${namespaceProp.indicators[0]}:${metaValue}`;

                                const existing = store.getters["storage/getMetadataValueByURI"](objectUuid, metaName);
                                const assigned = (existing && Array.isArray(existing)) ? [...existing] : [];
                                if (!assigned.includes(metaValue)) assigned.push(metaValue);
                                metaValue = assigned;
                            }
                        }

                        await generateMetadata(metaName, metaValue, "System", fragmentUUID, 0.8);
                    };

                    let iirdsTitleSetForFragment = store.getters["storage/getMetadataValueByURI"](fragmentUUID, "iirds:title");
                    let plusTitleSetForFragment = store.getters["storage/getMetadataValueByURI"](fragmentUUID, "plus:Title");
                    if (!!iirdsTitleSetForFragment || !!plusTitleSetForFragment) {
                        await store.dispatch("storage/saveObjectLocal", {
                            uuid: fragmentUUID,
                            name: plusTitleSetForFragment || iirdsTitleSetForFragment,
                        });
                    }
                };

                if (projectUuid) {
                    store.dispatch("projects/addObjectsToProject", {projectUuid, objectUuids: fragmentUuids});
                }
                while (fragmentUuids.length) {
                    let fragmentUuidsBatch = fragmentUuids.splice(0,5);
                    if (projectUuid) {
                        await store.dispatch("storage/saveObjectsToProjectRemote", {projectUuid, objectUuids: fragmentUuidsBatch});
                    } else {
                        await store.dispatch("storage/saveObjectsRemoteByUuids", fragmentUuidsBatch);
                    }
                }
            }
        }

        // Check for @id attribute on <html> and <body>
        const idAttribute = document.firstElementChild.id || document.body.id;
        if (idAttribute && idAttribute !== "") {
            await store.dispatch("storage/saveObjectLocal", {
                uuid: objectUuid,
                xid: idAttribute,
            });
            await generateMetadata("id", idAttribute, "HTML");
        }

        // try title Heuristic
        const simpleTitle = this.simpleTitleHeuristic(document);
        if (simpleTitle && simpleTitle.length) {
            await store.dispatch("storage/addMetadata", {
                objectUuid, objectMeta: { uri: "plus:SimpleHTMLTitle", value: simpleTitle }
            });
        }

        // change object type if PI is set
        const objectType = store.getters["storage/getMetadataValueByURI"](objectUuid, "plus:convert-to-object");
        if (objectType && ["plus:Fragment", "plus:Document"].includes(objectType)) {
            await store.dispatch("storage/saveObjectLocal", {
                uuid: objectUuid,
                type: objectType,
            });
        }

        // clean filename
        const cleanFileName = this.cleanFileName(objectFilename);

        await store.dispatch("storage/addMetadata", {
            objectUuid, objectMeta: { uri: "plus:CleanFileName", value: cleanFileName }
        });

        const iirdsTitle = store.getters["storage/getMetadataValueByURI"](objectUuid, "iirds:title");
        const plusTitle = store.getters["storage/getMetadataValueByURI"](objectUuid, "plus:Title");

        let title = objectFilename;
        if (!!iirdsTitle) {
            title = iirdsTitle;
        } else if (!!plusTitle) {
            title = plusTitle;
        } else if (!!simpleTitle) {
            title = simpleTitle;
        }

        // extract text
        let extractedText = this.textExtract(document, title);
        await store.dispatch("storage/saveObjectLocal", {
            uuid: objectUuid,
            name: title,
            text: extractedText.trim(),
            published: store.getters["projects/getPublishedState"](projectUuid),
            source: { htmlContent }
        });

        await store.dispatch("storage/addMetadata", {
            objectUuid, objectMeta: { uri: "plus:AnalysisCompleted", value: Date.now() }
        });

        // store HTML content
        await store.dispatch("storage/uploadSource", { objectUuid });
    },
    async extractFragment(renditionFile, selectorQuery, infoUnitUuid) {
        let htmlContent = undefined;
        try {
            htmlContent = await util.readFile(renditionFile, "text");
        } catch (error) {
            return error;
        }
        const parser = new DOMParser();
        const document = parser.parseFromString(htmlContent, "text/html");

        let fragment = document.querySelector(selectorQuery);
        if (fragment) {
            return new File(
                [fragment.outerHTML],
                `${infoUnitUuid}.html`,
                {type: "text/html"}
            );
        } else return undefined;
    },
    textExtract (document, title) {
        let extractedText = extract(document.body.innerHTML);
        // remove exact title string from body text
        let escapedTitle = util.escapeRegExp(title);
        let titleRegExp = new RegExp(escapedTitle, "g");
        extractedText = extractedText.replace(titleRegExp, "");
        return extractedText.trim();
    },
    simpleTitleHeuristic (document) {
        if (document.title && document.title !== "") {
            return document.title.trim().substr(0,200);
        } else if (document.querySelector("h1") !== null) {
            return extract(document.querySelector("h1")).substr(0,200);
        } else if (document.querySelector("header") !== null) {
            return extract(document.querySelector("header")).substr(0,200);
        } else {
            return extract(document.body.firstElementChild).substr(0,200);
        }
    },
    cleanFileName (fileName) {
        let fileNameParts = fileName.split(/[-_\/\s,.]/g);
        fileNameParts.pop();
        let cleanFileName = fileNameParts.join(" ");
        return cleanFileName.trim();
    }
};