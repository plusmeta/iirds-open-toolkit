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
        editable: false,
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
        id: "variant",
        editable: false,
        helpkey: "workflow.variant",
        name: {
            de: "Variante wählen",
            en: "Choose variant"
        },
        rules: [
            (store) => {
                const variant = store.getters["projects/getCurrentProjectRelationById"]("iirds:formatRestriction");
                const iirdsVariant = variant.length > 0 ? variant[0] : "iirds";

                if (iirdsVariant === "H") {
                    const companyName = store.getters["projects/getCurrentProjectRelationById"]("plus:companyName");
                    const domain = store.getters["projects/getCurrentProjectRelationById"]("plus:domain");
                    const productType = store.getters["projects/getCurrentProjectRelationById"]("iirds:ProductType");
                    const objectTypeURI = store.getters["projects/getCurrentProjectRelationById"]("iirds:ObjectTypeURI");
                    const objectInstanceUri = store.getters["projects/getCurrentProjectRelationById"]("iirds:ObjectInstanceURI");
                    const serialNumber = store.getters["projects/getCurrentProjectRelationById"]("plus:serialNumber");

                    return companyName?.[0] &&
                        domain?.[0] &&
                        productType?.[0] &&
                        (objectTypeURI?.[0] || objectInstanceUri?.[0] || serialNumber?.[0]);
                }

                return true;
            }
        ],
        ruleExpl: {
            de: "Für iiRDS/H müssen Organisation, Domain, Produkttyp und Produktreferenz ausgefüllt sein",
            en: "For iiRDS/H, Organisation, Domain, Product Type and Product Reference must be filled"
        },
        component: () => import(/* webpackChunkName: "StepChooseVariant.step" */ "@/toolkit/step/OtkStepChooseVariant")
    },
    {
        id: "add-content",
        editable: false,
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
        editable: false,
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
