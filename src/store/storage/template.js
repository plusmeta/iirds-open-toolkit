/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import { v4 as uuid } from "uuid";

export default {
    object(objectProps) {
        let template = {
            uuid: uuid(),
            externalId: undefined,
            type: "plus:Document",
            name: undefined,
            text: undefined,
            meta: {},
            owner: 1,
            published: 0,
            source: {
                type: undefined,
                name: undefined,
                data: undefined,
                size: undefined,
                uri: undefined,
                thumbnailUri: undefined
            }
        };

        return Object.assign(template, objectProps);
    },

    metadata(metaData) {
        let template = {
            uuid: uuid(),
            uri: undefined,
            value: undefined,
            confidence: 0,
            provenance: undefined,
            approved: 0
        };

        return Object.assign(template, metaData);
    }
};
