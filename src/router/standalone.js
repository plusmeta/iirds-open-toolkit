/*!
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";
import VueRouter from "vue-router";

import Main from "@/layout/Main";
import StepLoading from "@/shared/step/StepLoading";
import StepThankYou from "@/toolkit/step/OtkStepThankYou";

import staticRoutes from "@/router/static";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: Main,
            children: [
                {
                    path: "/",
                    component: () => ({
                        component: import(/* webpackChunkName: "Workflow.view" */ "@/views/OtkWorkflow"),
                        loading: StepLoading
                    }),
                    name: "OtkWorkflowView"
                },
                {
                    path: "/:workflowId/:stepId",
                    component: () => ({
                        component: import(/* webpackChunkName: "Workflow.view" */ "@/views/OtkWorkflow"),
                        loading: StepLoading
                    }),
                    name: "OtkWorkflowStep"
                }
            ]
        },
        {
            path: "/thankyou",
            component: StepThankYou,
            name: "OtkThankYou"
        },
        // 404: user is logged in
        {
            path: "*",
            component: Main,
            children: [
                ...staticRoutes
            ],
        }
    ]
});

export default router;