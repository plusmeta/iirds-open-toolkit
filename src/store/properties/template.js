/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import { v4 as uuid } from "uuid";

export default (propertyProps) => {
    let template = {
        id: undefined,
        organizationId: undefined,
        subClassOf: undefined,
        datatype: undefined,
        identifier: `urn:uuid:${uuid()}`,
        label: undefined,
        labels: {
            de: undefined,
            en: undefined
        },
        rels: {},
        modifiedAt: undefined,
        modifier: undefined,
        creator: undefined,
        created: undefined
    };

    return Object.assign(template, propertyProps);
};
