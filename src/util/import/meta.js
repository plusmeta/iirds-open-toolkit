/*!
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import util from "@/util";
import template from "@/store/properties/template";
import importable from "@/config/iirds/import";

export default {
    async analyze (objectData, store) {
        const textContent = await util.readFile(objectData, "text");
        const xmlParser = new DOMParser();

        const metadataDoc = xmlParser.parseFromString(textContent, "application/xml");
        if (!metadataDoc) throw Error("Malformed XML file");

        const instanceSelector = Object.keys(importable).join(", ");
        const knownInstances = metadataDoc.querySelectorAll(instanceSelector);
        if (!knownInstances.length) throw Error("No known instances to import");

        for (let instance of knownInstances) {
            const propClass = importable[instance.localName];
            const propId = instance.getAttribute("rdf:about") || ":no-id";

            let propLabel = undefined;
            const labels = instance.querySelectorAll("label");

            // one label = language neutral
            if (labels.length === 1) {
                propLabel = labels.item(0).textContent;
                // multiple labels
            } else if (labels.length > 1) {
                // multiple language-specific labels
                if ([...labels].every(l => l.hasAttribute("xml:lang"))) {
                    propLabel = {};
                    for (let languageSpecificLabel of labels) {
                        let locale = languageSpecificLabel.getAttribute("xml:lang");
                        if (!!locale) propLabel[locale] = languageSpecificLabel.textContent;
                    }
                    // multiple language-neutral labels
                } else {
                    propLabel = [];
                    for (let languageNeutralLabel of labels) {
                        propLabel.push(languageNeutralLabel.textContent);
                    }
                    propLabel = propLabel.filter(Boolean).join(" - ");
                }
                // fallback label derived from Class + ID
            } else {
                propLabel = propClass.split(":")?.pop() + "-" + propId.split(/[:\/]/)?.pop();
            }

            let property = template({
                subClassOf: propClass,
                datatype: "plus:Instance",
                identifier: propId,
                label: propLabel,
                rels: { "plus:has-roles": ["plus:CustomMetadata"] }
            });

            store.dispatch("properties/addProperty", property);
        }
    }
};
