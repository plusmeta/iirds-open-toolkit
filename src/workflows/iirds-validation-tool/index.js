/*!
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

export default {
    id: "iirds-validation-tool",
    icon: "mdi-open-source-initiative",
    name: {
        de: "iiRDS Validation Tool",
        en: "iiRDS Validation Tool"
    },
    desc: {
        de: "Implementierung des iiRDS Validation Tool",
        en: "Implementation of the iiRDS Validation Tool"
    },
    publishable: true,
    steps: [
        {
            id: "validate-iirds",
            editable: false,
            props: {
                objecttype: ["iirds:Container"]
            },
            name: {
                de: "iiRDS validieren",
                en: "Validate iiRDS"
            },
            rules: [
                //store => store.getters["storage/countCurrentObjectsByType"] ("plus:RuleViolation").length > 0
            ],
            ruleExpl: {
                de: "Ein Validierungsreport wurde erzeugt",
                en: "A validation report was created"
            },
            component: () => import(/* webpackChunkName: "StepAddObjects.step" */ "@/toolkit/step/OtkStepAddObjects")
        },{
            id: "show-report",
            editable: false,
            props: {
                objecttype: ["plus:RuleViolation"]
            },
            name: {
                de: "Validierungsreport anzeigen",
                en: "Show validation report"
            },
            component: () => import(/* webpackChunkName: "StepBulkAssignMetadata.step" */ "@/toolkit/step/OtkStepBulkAssignMetadata")
        }]
};
