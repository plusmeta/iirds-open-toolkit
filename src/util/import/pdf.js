
/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import util from "@/util";

const maxWords = 500;
const thumbSize = 400;

export default {
    async analyze (projectUuid, objectUuid, objectData, objectFilename, store) {
        const arrayBuffer = await util.readFile(objectData, "buffer");
        const pdfDoc = await util.getDocument(arrayBuffer);
        const pdfMetadata = await pdfDoc.getMetadata();
        const pdfPages = pdfDoc.numPages;

        const dataURL = await this.generateThumbnail(pdfDoc);
        await store.dispatch("storage/uploadThumbnail", {
            objectUuid,
            file: this.dataURItoBlob(dataURL)
        });
        await this.saveTotalPage(store, objectUuid, pdfPages);

        const generateMetadata = async (obj, key, prov) => {
            if (typeof obj[key] !== "object" && obj[key].length !== 0) {
                return await store.dispatch("storage/addMetadata", {
                    objectUuid,
                    objectMeta: {
                        uri: (key.includes(":")) ? key : `pdf:${key}`,
                        value: obj[key],
                        provenance: prov,
                        generator: "AnalyzePDF"
                    }
                });
            }
        };

        // Check for standard PDF metadata
        if (pdfMetadata.info !== null) {
            for (let key of Object.keys(pdfMetadata.info)) {
                await generateMetadata(pdfMetadata.info, key, "pdfFileInfo");
            }
        }

        // Check for embedded RDF metadata
        if (pdfMetadata.metadata !== null) {
            for (let key of Object.keys(pdfMetadata.metadata)) {
                await generateMetadata(pdfMetadata.metadata, key, "pdfFileRDF");
            };
        }

        // Check for hidden metadata
        if (pdfMetadata.info.hasOwnProperty("_metadata")) {
            for (let key of Object.keys(pdfMetadata.info._metadata)) {
                await generateMetadata(pdfMetadata.info._metadata, key, "hiddenPDFFileRDF");
            };
        }

        let totalTextObj = [];
        let totalText = "";
        let currentPage = 1;

        while (currentPage <= pdfPages && totalText.split(/\b/).length - 1 < maxWords) {
            let pageObj = await pdfDoc.getPage(currentPage);
            let textObj = await pageObj.getTextContent();
            totalTextObj.push(textObj);

            totalText = totalTextObj.map(this.textExtract).join(" ");
            currentPage++;
        }


        // try title Heuristic
        let simpleTitleExtract = this.simpleTitleHeuristic(totalTextObj[0]);

        if (simpleTitleExtract && simpleTitleExtract.length) {
            await store.dispatch("storage/addMetadata", {
                objectUuid, objectMeta: { uri: "plus:SimplePDFTitle", value: simpleTitleExtract }
            });
        }

        // clean filename
        let cleanFileName = this.cleanFileName(objectFilename);

        await store.dispatch("storage/addMetadata", {
            objectUuid, objectMeta: { uri: "plus:CleanFileName", value: cleanFileName }
        });

        // better name?
        let titleFromPDF = store.getters["storage/getMetadataValueByURI"](objectUuid, "pdf:Title");
        titleFromPDF = (typeof titleFromPDF === "string") ? titleFromPDF.trim() : "";

        await store.dispatch("storage/saveObjectLocal", {
            uuid: objectUuid,
            name: titleFromPDF || objectFilename,
            text: totalText.trim(),
            source: { arrayBuffer }
        });

        await store.dispatch("storage/uploadSource", { projectUuid, objectUuid });

        await store.dispatch("storage/addMetadata", {
            objectUuid, objectMeta: { uri: "plus:AnalysisCompleted", value: Date.now() }
        });
    },

    textExtract (pdfTxtObj) {
        let text = "";
        for (let i = 0; i < pdfTxtObj.items.length; i++) {
            if (pdfTxtObj.items[i].str !== "" || pdfTxtObj.items[i].str !== " ") {
                text = text + " " + pdfTxtObj.items[i].str.replace(/[\s\n\t\n.]+/g, " ");
            }
        }
        return text.trim().replace(/[\s\n\t\n]+/g, " ");
    },

    simpleTitleHeuristic (pdfTxtObj) {
        let heights = [];
        let title = "";

        for (let item in pdfTxtObj.items) {
            if (pdfTxtObj.items[item].str !== "" || pdfTxtObj.items[item].str !== " ") {
                heights.push(pdfTxtObj.items[item].height);
            }
        }

        let maxHeight =  Math.max(...heights);
        let titleItems = pdfTxtObj.items.filter((item) => {
            return item.height === maxHeight;
        });

        for (let i = 0; i < titleItems.length; i++) {
            title = title + " " + titleItems[i].str.replace(/[\s\n\t\n]+/g, " ");
        }
        return title.trim();
    },

    cleanFileName (fileName) {
        let fileNameParts = fileName.split(/[_\/\s,.]/g);
        fileNameParts.pop();
        let cleanFileName = fileNameParts.join(" ");
        return cleanFileName.trim();
    },

    async generateThumbnail (pdfDoc) {
        const canvas = document.createElement("canvas");
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        canvas.width = canvas.height = thumbSize;
        const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height);

        canvas.width = Math.min(canvas.width, viewport.width * scale);
        canvas.height = Math.min(canvas.height, viewport.height * scale);

        const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: page.getViewport({ scale })
        };

        await page.render(renderContext).promise;

        return canvas.toDataURL("image/png");
    },
    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(",")[1]);

        // separate out the mime component
        var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;
    },
    async saveTotalPage(store, objectUuid, totalPages) {
        await store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                uri: "pdf:totalPages",
                value: totalPages,
                provenance: "System",
                generator: "AnalyzePDF"
            }
        });
    }
};