import rdf from "@/util/rdf";
import match from "@/util/match";
import { extract } from "@/util/sanitize";
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
                    uri: key,
                    value: val,
                    provenance: prov,
                    confidence: conf,
                    generator: "HTML"
                }
            });
        };

        const normalizeValue = (value) => {
            let castValue = util.castString(value);
            if (typeof castValue === "string") {
                return rdf.collapse(castValue.trim(), store);
            } else if (Array.isArray(castValue)) {
                return castValue.map(val => rdf.collapse(val.trim(), store));
            } else {
                return castValue;
            }
        };

        // Check for <meta> elements in <head>
        const metaElements = document.querySelectorAll("head meta");
        if (metaElements !== null) {
            for (let meta of Array.from(metaElements)) {
                if (!!meta.name.length && !!meta.content.length) {

                    let metaName = normalizeValue(meta.name);
                    if (!rdf.isPrefixed(metaName)) metaName = `html:${metaName}`;
                    let metaValue = normalizeValue(meta.content);

                    if (store.getters["properties/isProperty"](metaName)) {
                        if (store.getters["properties/getPropertyType"](metaName) === "plus:Relation" ||
                            store.getters["properties/getPropertyRelationById"](metaName, "plus:has-roles").includes("plus:Relation")) {
                            const relatedNamespace = store.getters["properties/getPropertyRelationById"](metaName, "plus:has-namespace")[0];
                            const namespaceProp = store.getters["properties/getPropertyById"](relatedNamespace);

                            metaValue = (Array.isArray(metaValue)) ? metaValue : [metaValue];
                            if (!!relatedNamespace && !!namespaceProp){
                                metaValue = metaValue.map((val) => {
                                    let prefixed = `${namespaceProp.indicators[0]}:${String(val)}`;
                                    return prefixed;
                                });
                            }

                            const existing = store.getters["storage/getMetadataValueByURI"](objectUuid, metaName);
                            const assigned = (existing && Array.isArray(existing)) ? existing : [];

                            metaValue = util.uniqueValues([...metaValue, ...assigned]);
                        }
                    }

                    await generateMetadata(metaName, metaValue, "File");
                }
            };
        }

        // Check for @lang or @xml:lang attribute on <html>
        const langAttribute = document.firstElementChild.lang;
        let langSetForDocument = null;
        if (langAttribute && langAttribute !== "") {
            let matchedLang = match.language(store, langAttribute);
            if (!!matchedLang) {
                await generateMetadata("iirds:language", [matchedLang], "File");
                langSetForDocument = [langAttribute];
            }
        }


        // Check for @id attribute on <html> and <body>
        const idAttribute = document.firstElementChild.id || document.body.id;
        if (idAttribute && idAttribute !== "") {
            await store.dispatch("storage/saveObjectLocal", {
                uuid: objectUuid,
                xid: idAttribute,
            });
            await generateMetadata("html:id", idAttribute, "File");
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
        if (objectType && ["plus:Fragment", "plus:Document", "plus:Component"].includes(objectType)) {
            await store.dispatch("storage/saveObjectLocal", {
                uuid: objectUuid,
                type: objectType,
            });
        }

        // clean filename
        const cleanFileName = this.cleanFileName(objectFilename);

        await store.dispatch("storage/addMetadata", {
            objectUuid, objectMeta: {
                uri: "plus:CleanFileName",
                value: cleanFileName,
                provenance: "File",
                generator: "HTML"
            }
        });

        const iirdsTitle = store.getters["storage/getMetadataValueByURI"](objectUuid, "iirds:title");

        let title = objectFilename;
        if (!!iirdsTitle) {
            title = iirdsTitle;
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

        // store HTML content
        await store.dispatch("storage/uploadSource", { objectUuid });
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
            return extract(document.querySelector("h1").innerHTML).substr(0,200);
        } else if (document.querySelector("header") !== null) {
            return extract(document.querySelector("header").innerHTML).substr(0,200);
        } else {
            return extract(document.body.firstElementChild.innerHTML).substr(0,200);
        }
    },
    cleanFileName (fileName) {
        let fileNameParts = fileName.split(/[-_\/\s,.]/g);
        fileNameParts.pop();
        let cleanFileName = fileNameParts.join(" ");
        return cleanFileName.trim();
    }
};
