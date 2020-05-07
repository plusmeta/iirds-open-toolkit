/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import { v4 as uuid } from "uuid";
import Vue from "vue";

export default {
    project(projectProps) {
        let template = {
            id: undefined,
            uuid: uuid(),
            name: undefined,
            owner: Vue.auth.email,
            creator: Vue.auth.email,
            created: Date.now(),
            locked: 0,
            status: 0,
            published: 0,
            workflow: undefined,
            progress: 0,
            position: 1,
            objectUuids: [],
            rels: {}
        };

        return Object.assign(template, projectProps);
    },

    status: [
        "plus:NewProject",
        "plus:OpenProject",
        "plus:CompletedProject",
        "plus:ClosedProject"
    ],

    published: [
        "plus:PrivateProject",
        "plus:SharedProject",
        "plus:PublicProject"
    ],

    filePathResolver: [
        (userIdentityId, identityPoolId) => `private/${userIdentityId}`,
        (userIdentityId, identityPoolId) => `protected/${identityPoolId}`,
        (userIdentityId, identityPoolId) => `public/${identityPoolId}`
    ]
};
