/*!
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

export default {
    id: "iirds-open-toolkit",
    icon: "mdi-open-source-initiative",
    name: {
        de: "iiRDS Open Toolkit",
        en: "iiRDS Open Toolkit"
    },
    desc: {
        de: "Implementierung des iiRDS Open Toolkit",
        en: "Implementation of the iiRDS Open Toolkit"
    },
    publishable: true,
    steps: [{
        id: "start",
        editable: true,
        helpkey: "workflow.welcome",
        name: {
            de: "Willkommen",
            en: "Welcome"
        },
        rules: [
            store => store.getters["settings/getSetting"]("user_eula")
        ],
        ruleExpl: {
            de: "Sie müssen die Nutzungsbedingungen akzeptieren",
            en: "You have to accept the end user license agreement"
        },
        component: () => import(/* webpackChunkName: "StepWelcome.step" */ "@/toolkit/step/OtkStepWelcome")
    },
    {
        id: "add-content",
        editable: true,
        helpkey: "workflow.addObjects",
        name: {
            de: "Inhalte hinzufügen",
            en: "Add content"
        },
        rules: [
            store => store.getters["storage/countCurrentObjectsByType"]
            (["plus:Document", "plus:Component", "plus:Fragment"]) > 0
        ],
        ruleExpl: {
            de: "Mindestens ein Inhaltsobjekt wurde hinzugefügt",
            en: "At least one content object was added"
        },
        component: () => import(/* webpackChunkName: "StepAddObjects.step" */ "@/toolkit/step/OtkStepAddObjects")
    },
    {
        id: "assign-metadata",
        editable: true,
        helpkey: "workflow.assignMetadata",
        name: {
            de: "Metadaten vergeben",
            en: "Assign metadata"
        },
        props: {
            objecttype: ["plus:Document", "plus:Component", "plus:Fragment"]
        },
        component: () => import(/* webpackChunkName: "StepBulkAssignMetadata.step" */"@/toolkit/step/OtkStepBulkAssignMetadata")
    },
    {
        id: "generate-iirds",
        editable: false,
        helpkey: "workflow.generateIirds",
        name: {
            de: "iiRDS-Paket generieren",
            en: "Generate iiRDS package"
        },
        rules: [
            (store) => {
                return store.getters["storage/countCurrentObjectsByType"]("iirds:Container") > 0;
            }
        ],
        ruleExpl: {
            de: "iiRDS-Paket wurde erfolgreich erzeugt",
            en: "iiRDS package was generated successfully"
        },
        component: () => import(/* webpackChunkName: "StepGenerateIIRDS.step" */ "@/toolkit/step/OtkStepGenerateIIRDS")
    }]
};
