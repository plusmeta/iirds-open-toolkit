/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import JSzip from "jszip";

import util from "@/util";
import html from "@/util/import/html";
import template from "@/store/storage/template";

export default {
    async analyze (projectUuid, objectUuid, objectData, objectFilename, store) {
        const blobContent = await util.readFile(objectData);
        const zip = await JSzip.loadAsync(blobContent);

        if (!Object.keys(zip.files).length) throw "Empty container";

        const htmlFiles = Object.keys(zip.files).filter((key) => {
            return !!key?.match(/.+?\.html$/);
        });

        if (!htmlFiles.length) throw "No HTML files";

        for (let key of htmlFiles) {
            await this.processHTML(zip, key, projectUuid, store);
        }

        await store.dispatch("storage/saveObjectLocal", {
            uuid: objectUuid,
            type: "plus:MediaArchive",
            name: objectFilename.replace(/\.zip$/, "")
        });
    },
    async processHTML (zip, key, projectUuid, store) {
        let file = await zip.files[key].async("blob");

        let object = template.object({
            type: "plus:Component",
            name: key,
            externalId: key,
            source: {
                type: "text/html",
                data: file,
                size: file.size,
                name: file.name,
                uri: undefined
            }
        });

        store.dispatch("storage/saveObjectLocal", object);
        store.dispatch("projects/addObjectsToProject", {
            projectUuid: projectUuid,
            objectUuids: [object.uuid]
        });

        return html.analyze(projectUuid, object.uuid, file, key, store);
    }

};