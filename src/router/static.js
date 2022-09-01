/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import StepNotFound from "@/shared/step/StepNotFound";

export default [
    {
        path: "*",
        name: "NotFound",
        component: StepNotFound,
        meta: {
            breadcrumbs: [{
                label: "App.notFound",
                view: "/workflows"
            }]
        }
    }
];
