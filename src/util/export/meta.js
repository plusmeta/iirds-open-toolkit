/*!
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import XMLbuilder from "xmlbuilder";

export default {
    export (metadata, $store) {
        const configuredNamespaces = $store.getters["properties/getPropertiesByClass"]("plus:Namespace");

        let namespaceConfig = configuredNamespaces.reduce((config, ns) => {
            ns.indicators?.forEach((prefix) => {
                config[`@xmlns:${prefix}`] = ns.identifier;
            });
            return config;
        }, {});

        const root = XMLbuilder.create({
            "rdf:RDF": namespaceConfig
        });

        let now = new Date();
        root.com(`*** iiRDS Open Toolkit (v${process.env.VUE_APP_VERSION}) ***`);
        root.com(`*** generated on ${now.toLocaleString()} ***`);

        metadata.forEach((meta) => {
            // instance element with corresponding class
            let metaElement = root.ele(meta.subClassOf, {"rdf:about": meta.identifier});
            // language-neutral labeö
            if (meta.label && typeof meta.label === "string") {
                return metaElement.ele("rdfs:label", meta.label);
            }
            // multiple language-specific labels
            if (meta.labels && typeof meta.labels === "object") {
                Object.keys(meta.labels).forEach((lang) => {
                    return metaElement.ele("rdfs:label", {"xml:lang": lang}, meta.labels[lang]);
                });
            }
        });

        return root.end({ pretty: true });
    }
};
