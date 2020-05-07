/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import util from "@/util";
import { NotifyService } from "@/services/notify-service";
import template from "@/store/properties/template";

export default {
    async analyze (projectUuid, objectUuid, objectData, objectFilename, store) {
        const textContent = await util.readFile(objectData, "text");

        let parsedData = [];

        try {
            parsedData = JSON.parse(textContent);
            if (!Array.isArray(parsedData)) throw Error("Metadata must be array");
            if (!parsedData.every(item => !!item.identifier)) throw Error("Metadata must be valid");
        } catch (error) {
            this.log(error);
        }

        // import properties
        for (let item of parsedData) {
            if (!item.subClassOf) return;
            if (!item.datatype) return;

            let property = template(item);
            store.dispatch("properties/addProperty", property);
        }

        await store.dispatch("storage/saveObjectLocal", {
            uuid: objectUuid,
            type: "plus:Configuration",
            text: JSON.stringify(parsedData)
        });

        // remove object from project after import of properties
        // store.dispatch("storage/deleteObject", objectUuid);
        // store.dispatch("projects/deleteObjectsFromProject", {projectUuid, objectUuids: [objectUuid]});

        NotifyService.instance.send("Erfolgreich importiert", "success", 5);
    },
    log(msg) {
        // eslint-disable-next-line no-console
        if (VERBOSE) console.log(msg);
    }
};