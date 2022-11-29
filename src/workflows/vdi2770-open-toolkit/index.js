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
        en: "VDI 2770 Open Toolkit",
        zh: "VDI 2770 开放工具包"
    },
    desc: {
        de: "Implementierung des VDI 2770 Open Toolkit",
        en: "Implementation of the VDI 2770 Open Toolkit",
        zh: "VDI 2770 开放工具包的实施"
    },
    publishable: true,
    steps: [{
        id: "start",
        editable: false,
        helpkey: "workflow.welcome",
        name: {
            de: "Daten angeben",
            en: "Input data",
            zh: "输入数据"
        },
        rules: [
            store => store.getters["settings/isOrgaIsNotValidCount"] === 0 &&
                store.getters["settings/isProductNotValidCount"] === 0
        ],
        ruleExpl: {
            de: "Sie müssen die Nutzungsbedingungen akzeptieren und alle mit '*' markierten Felder ausfüllen.",
            en: "You have to accept the terms of use and fill out all fields marked with '*'.",
            zh: "您必须接受使用条款并填写所有标有 '*' 的字段。"
        },
        component: () => import(/* webpackChunkName: "StepWelcome.step" */ "@/toolkit/step/OtkStepWelcome")
    },
    {
        id: "add-content",
        editable: false,
        helpkey: "workflow.addObjects",
        name: {
            de: "Inhalte hinzufügen",
            en: "Add content",
            zh: "添加内容"
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
            en: "At least one content object was added",
            zh: "至少添加了一个内容对象"
        },
        component: () => import(/* webpackChunkName: "StepAddObjects.step" */ "@/toolkit/step/OtkStepAddObjects")
    },
    {
        id: "assign-metadata",
        editable: false,
        helpkey: "workflow.assignMetadata",
        name: {
            de: "Metadaten vergeben",
            en: "Assign metadata",
            zh: "分配元数据"
        },
        props: {
            objecttype: ["plus:Document"]
        },
        rules: [
            store => store.getters["storage/countInvalidObjects"] === 0
        ],
        ruleExpl: {
            de: "Sie müssen alle mit '*' markierten Felder ausfüllen.",
            en: "You have to fill out all fields marked with '*'.",
            zh: ""
        },
        component: () => import(/* webpackChunkName: "StepBulkAssignMetadata.step" */"@/toolkit/step/OtkStepBulkAssignMetadata")
    },
    {
        id: "generate-vdi2770",
        editable: false,
        helpkey: "workflow.generateVdi2770",
        name: {
            de: "VDI-2770-Container generieren",
            en: "Generate VDI 2770 container",
            zh: "生成 VDI 2770 容器"
        },
        rules: [
            (store) => {
                return store.getters["storage/countCurrentObjectsByType"]("vdi:DocumentationContainer") > 0;
            }
        ],
        ruleExpl: {
            de: "VDI-2770-Container wurde erfolgreich erzeugt",
            en: "VDI 2770 container was generated successfully",
            zh: "成功生成 VDI 2770 容器"
        },
        component: () => import(/* webpackChunkName: "OtkStepGenerateVDI2770.step" */ "@/toolkit/step/OtkStepGenerateVDI2770")
    }]
};
