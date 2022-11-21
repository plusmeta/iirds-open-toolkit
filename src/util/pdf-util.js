export default {
    async getDocument(url) {
        // Using import statement in this way allows Webpack
        // to treat pdf.js as an async dependency so we can
        // avoid adding it to one of the main bundles
        const pdfjsLib = await import(/* webpackChunkName: "pdfjs.restricted" */ "pdfjs-dist/webpack");
        return await pdfjsLib.getDocument(url).promise;
    },
    async renderText(textContent, textLayerEl, viewport) {
        const pdfjsLib = await import(/* webpackChunkName: "pdfjs.restricted" */ "pdfjs-dist/webpack");
        return await pdfjsLib.renderTextLayer({
            textContent: textContent,
            container: textLayerEl,
            viewport: viewport,
            textDivs: []
        }).promise;
    },
    getHeuristicTitle(pdfTxtObj) {
        let heights = [];
        let title = "";

        for (let item in pdfTxtObj.items) {
            if (pdfTxtObj.items[item].str !== "" || pdfTxtObj.items[item].str !== " ") {
                heights.push(pdfTxtObj.items[item].height || 0);
            }
        }

        let sortedHeights = Array.from(heights).sort((a, b) => b - a);
        let maxHeight = sortedHeights[0];
        let nrOfValues = heights.filter(val => val === maxHeight).length;
        let confidence = (maxHeight - sortedHeights[nrOfValues]) / (maxHeight - sortedHeights[sortedHeights.length - 1]);

        let titleItems = pdfTxtObj.items.filter((item) => {
            return item.height === maxHeight;
        });

        for (let i = 0; i < titleItems.length; i++) {
            title = title + " " + titleItems[i].str.replace(/[\s\n\t]+/g, " ");
        }
        return {
            uri: "plus:SimplePDFTitle",
            value: title,
            provenance: "System",
            confidence,
            generator: "HE"
        };
    },
    extractTextFromPage(pdfTxtObj) {
        let textBlocks = pdfTxtObj?.items || [];
        let extractedText = "";
        let prevBlock = null;

        for (let block of textBlocks) {
            if (prevBlock !== null && prevBlock.str[prevBlock.str.length - 1] !== " ") {
                if (block.transform[4] < prevBlock.transform[4]) { // X-Koordinaten
                    extractedText += "\n";
                } else if (prevBlock.transform[5] !== block.transform[5] && // Y-Koordinaten
                    (prevBlock.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) === null)) {
                    extractedText += "\n";
                } else if (prevBlock.transform[4] < block.transform[4] - 50 && // X-Abstände & Umlaut-Sonderfall
                    (block.str.match(/^([öäüß]).*/) === null)) {
                    extractedText += " ";
                }
            }
            extractedText += block.str;
            prevBlock = block;
        }

        return extractedText
            .trim()
            .replace(/[     ]+/g, " ")
            .replace(/\n+/g, "\n");
    },
};
