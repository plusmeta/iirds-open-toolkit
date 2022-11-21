/*!
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

export default {
    id: "vdi2770-open-toolkit",
    icon: "mdi-open-source-initiative",
    name: {
        de: "VDI 2770 Open Toolkit",
        en: "VDI 2770 Open Toolkit"
    },
    desc: {
        de: "Implementierung des VDI 2770 Open Toolkit",
        en: "Implementation of the VDI 2770 Open Toolkit"
    },
    publishable: true,
    steps: [{
        id: "start",
        editable: false,
        helpkey: "workflow.welcome",
        name: {
            de: "Daten angeben",
            en: "Input data"
        },
        rules: [
            store => store.getters["settings/getSetting"]("user_eula") &&
                    store.getters["settings/getSetting"]("base_user_name") &&
                    store.getters["settings/getSetting"]("base_user_mail") &&
                    store.getters["settings/getSetting"]("base_orga_name") &&
                    store.getters["settings/getSetting"]("base_orga_url")

        ],
        ruleExpl: {
            de: "Sie müssen die Nutzungsbedingungen akzeptieren",
            en: "You have to accept the end user license agreement"
        },
        component: () => import(/* webpackChunkName: "StepWelcome.step" */ "@/toolkit/step/OtkStepWelcome")
    },
    {
        id: "add-content",
        editable: false,
        helpkey: "workflow.addObjects",
        name: {
            de: "Inhalte hinzufügen",
            en: "Add content"
        },
        props: {
            objecttype: ["plus:Document"]
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
        editable: false,
        helpkey: "workflow.assignMetadata",
        name: {
            de: "Metadaten vergeben",
            en: "Assign metadata"
        },
        props: {
            objecttype: ["plus:Document"]
        },
        component: () => import(/* webpackChunkName: "StepBulkAssignMetadata.step" */"@/toolkit/step/OtkStepBulkAssignMetadata")
    },
    {
        id: "generate-vdi2770",
        editable: false,
        helpkey: "workflow.generateVdi2770",
        name: {
            de: "VDI-2770-Container generieren",
            en: "Generate VDI 2770 container"
        },
        rules: [
            (store) => {
                return store.getters["storage/countCurrentObjectsByType"]("vdi:DocumentationContainer") > 0;
            }
        ],
        ruleExpl: {
            de: "VDI-2770-Container wurde erfolgreich erzeugt",
            en: "VDI 2770 container was generated successfully"
        },
        component: () => import(/* webpackChunkName: "StepGenerateIIRDS.step" */ "@/toolkit/step/OtkStepGenerateVDI2770")
    }]
};
