
/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */


import util from "@/util";
import pdfUtil from "@/util/pdf-util";
import imgUtil from "@/util/image-util";
import generic from "@/util/import/generic";

export default {
    mimeType: {
        name: "application/pdf",
        extension: "pdf"
    },
    async getPdfDoc(objectData, inMemoryDoc) {
        if (inMemoryDoc) {
            return inMemoryDoc;
        } else {
            const arrayBuffer = await util.readFile(objectData, "buffer");
            return await pdfUtil.getDocument(arrayBuffer);
        }
    },
    async extractTextFromDocument(objectData, inMemoryDoc, config) {
        let pdfDoc = await this.getPdfDoc(objectData, inMemoryDoc);

        let pdfPages = pdfDoc.numPages;
        let totalTextObj = [];
        let totalText = "";
        let currentPage = 1;

        while (currentPage <= pdfPages && totalText.split(/\b/).length - 1 < config.maxWords) {
            let pageObj = await pdfDoc.getPage(currentPage);
            let textObj = await pageObj.getTextContent();
            totalTextObj.push(textObj);

            totalText = totalTextObj.map(pdfUtil.extractTextFromPage).filter(Boolean).join("\n\n");
            totalText = totalText.trim();
            currentPage++;
        }

        return { extractedText: totalText, firstPageObject: totalTextObj[0] };
    },
    async extractPageRangeFromDocument(objectData, inMemoryDoc, pageRange = [1, 1]) {
        let pdfDoc = await this.getPdfDoc(objectData, inMemoryDoc);

        let currentPage = Math.max(pageRange[0], 1);
        let pdfPages = Math.min(pageRange[1], pdfDoc.numPages);
        let totalTextObj = [];
        let totalText = "";

        while (currentPage <= pdfPages) {
            let pageObj = await pdfDoc.getPage(currentPage);
            let textObj = await pageObj.getTextContent();
            totalTextObj.push(textObj);

            totalText = totalTextObj.map(pdfUtil.extractTextFromPage).join("\n\n");
            currentPage++;
        }

        return totalText;
    },
    async extractObjectsFromDocument(objectData, inMemoryDoc) {
        let pdfDoc = await this.getPdfDoc(objectData, inMemoryDoc);
        let pdfPages = pdfDoc.numPages;
        let totalTextObj = [];
        let currentPage = 1;

        while (currentPage <= pdfPages) {
            let pageObj = await pdfDoc.getPage(currentPage);
            let textObj = await pageObj.getTextContent();
            totalTextObj.push(textObj);
            currentPage++;
        }

        return totalTextObj;
    },
    async getNrOfPages(objectData, inMemoryDoc) {
        let pdfDoc = await this.getPdfDoc(objectData, inMemoryDoc);
        return pdfDoc.numPages;
    },
    async analyzeContent(objectUuid, pdfDoc, objectFilename, config, { $store }) {
        const pdfMetadata = await pdfDoc.getMetadata();
        const pdfPages = pdfDoc.numPages;

        // text extraction
        let { extractedText, firstPageObject } = await this.extractTextFromDocument(null, pdfDoc, config);

        // try title Heuristic
        let heuristicTitleMeta = pdfUtil.getHeuristicTitle(firstPageObject);
        if (!!heuristicTitleMeta.value) {
            await $store.dispatch("storage/addMetadata", {
                objectUuid, objectMeta: heuristicTitleMeta
            });
        }

        await $store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                uri: "pdf:totalPages",
                value: pdfPages,
                provenance: "System",
                generator: "PDF"
            }
        });

        const generateMetadata = async (obj, key, prov) => {
            if (typeof obj[key] !== "object" && obj[key].length !== 0) {
                return await $store.dispatch("storage/addMetadata", {
                    objectUuid,
                    objectMeta: {
                        uri: (key.includes(":")) ? key : `pdf:${key}`,
                        value: obj[key],
                        provenance: prov,
                        generator: "PDF"
                    }
                });
            } else if (typeof obj[key] === "object" && key === "Custom") {
                let customMetadata = obj[key];
                for (let nestedKey of Object.keys(customMetadata)) {
                    await $store.dispatch("storage/addMetadata", {
                        objectUuid,
                        objectMeta: {
                            uri: (nestedKey.includes(":")) ? nestedKey : `pdfx:${nestedKey}`,
                            value: customMetadata[nestedKey],
                            provenance: prov,
                            generator: "PDF"
                        }
                    });
                }
            }
        };

        let xmpDetected = false;

        // Check for XMP metadata
        if (pdfMetadata.metadata !== null) {
            let metadataMap = pdfMetadata.metadata.getAll();
            if (metadataMap) {
                xmpDetected = true;
                for (let key of Object.keys(metadataMap)) {
                    await generateMetadata(metadataMap, key, "File");
                }
            }
        }

        if (!xmpDetected && pdfMetadata.metadata !== null) {
            let xmlContent = pdfMetadata.metadata.getRaw();
            if (xmlContent) {
                try {
                    const parser = new DOMParser();
                    const rdfDoc = parser.parseFromString(xmlContent, "application/xml");

                    let descriptions = rdfDoc.getElementsByTagName("rdf:Description");
                    if (descriptions && descriptions.length) {
                        xmpDetected = true;

                        for (let i = 0; i < descriptions.length; i++) {
                            let desc = descriptions.item(i);
                            let attrs = desc.attributes;
                            for (let j = 0; j < attrs.length; j++) {
                                let attr = attrs.item(j);
                                if (attr.prefix !== "xmlns") {
                                    await generateMetadata({ [attr.name]: attr.value }, attr.name, "File");
                                }
                            }
                        }
                    }
                } catch (error) {
                    xmpDetected = false;
                }
            }
        }

        // Check for standard PDF metadata
        if (pdfMetadata.info !== null) {
            for (let key of Object.keys(pdfMetadata.info)) {
                await generateMetadata(pdfMetadata.info, key, "File");
            }
        }

        // Check for PDF/A Conformance
        let specPart = $store.getters["storage/getMetadataValueByURI"](objectUuid, "pdfaid:part");
        let specConf = $store.getters["storage/getMetadataValueByURI"](objectUuid, "pdfaid:conformance");
        if (specPart && specConf) {
            let conformity = `PDF/A-${specPart}${specConf}`;
            await $store.dispatch("storage/addMetadata", {
                objectUuid, objectMeta: {
                    uri: "plus:Conformity",
                    value: [conformity],
                    provenance: "File",
                    generator: "PDF",
                    confidence: 1
                }
            });
        }

        await $store.dispatch("storage/saveObjectLocal", {
            uuid: objectUuid,
            name: objectFilename,
            text: extractedText
        });
    },
    async analyze(projectUuid, objectUuid, objectData, objectFilename, store, saveOnEnd = false) {
        const config = {
            maxWords: 100 * 100,
            thumbSize: 400
        };

        const pdfDoc = await this.getPdfDoc(objectData);
        await this.analyzeContent(objectUuid, pdfDoc, objectFilename, config, { $store: store });

        const thumbnailFile = await imgUtil.generateImageFromPDF(pdfDoc, config.thumbSize);
        if (thumbnailFile) {
            await store.dispatch("storage/uploadThumbnail", {
                objectUuid,
                file: thumbnailFile
            });
        }

        // add generic metadata
        await generic.addGenericMetadata(objectUuid, objectData, objectFilename, store);
    }
};
