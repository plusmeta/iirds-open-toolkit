/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import { extract } from "@/util/sanitize";
import template from "@/store/storage/template";
import util from "@/util";
import config from "@/config";

export default {
    async analyze (projectUuid, objectUuid, objectData, objectFilename, store) {
        let xmlContent = undefined;
        try {
            xmlContent = await util.readFile(objectData, "text");
        } catch (error) {
            return error;
        }

        // Decide which object type to use based on content length
        let objectType = (xmlContent.length > config.documentMinLength) ?
            "plus:Document" :
            "plus:Component";

        // extract text
        await store.dispatch("storage/saveObjectLocal", {
            uuid: objectUuid,
            type: objectType,
            name: this.cleanFileName(objectFilename),
            text: this.textExtract(xmlContent)
        });

        await store.dispatch("storage/addMetadata", {
            objectUuid, objectMeta: {
                uri: "plus:AnalysisCompleted",
                value: Date.now(),
                provenance: "System",
                generator: "XML"
            }
        });
    },
    textExtract (xml) {
        const extractedText = extract(xml);
        const trimmedText = extractedText.trim();
        return trimmedText.slice(0, 50000);
    },
    cleanFileName (fileName) {
        let fileNameParts = fileName.split(/[-_\/\s,.]/g);
        fileNameParts.pop();
        let cleanFileName = fileNameParts.join(" ");
        return cleanFileName.trim();
    }
};