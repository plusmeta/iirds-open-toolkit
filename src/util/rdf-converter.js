/*!
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import jsonld from "jsonld";
import * as $rdf from "rdflib";

/**
 * Converts RDF/XML string to JSON-LD format
 * @param {string} rdfXmlString - RDF/XML content as string
 * @param {object} context - JSON-LD context object
 * @param {boolean} compact - Whether to compact the output (default: true)
 * @returns {Promise<object>} JSON-LD document
 */
async function rdfXmlToJsonLd(rdfXmlString, context = null, compact = true) {
    try {
        const store = $rdf.graph();
        const baseUri = "https://www.iirds.org/";

        try {
            $rdf.parse(rdfXmlString, store, baseUri, "application/rdf+xml");
        } catch (parseError) {
            throw new Error(`RDF/XML parsing failed: ${parseError.message}. Check if all namespaces are properly declared in the XML.`);
        }

        const nquads = $rdf.serialize(null, store, baseUri, "application/n-quads");

        let jsonLdDoc = await jsonld.fromRDF(nquads, {
            format: "application/n-quads"
        });

        if (compact && context) {
            jsonLdDoc = await jsonld.compact(jsonLdDoc, context);
        }

        return jsonLdDoc;
    } catch (error) {
        throw new Error(`Failed to convert RDF/XML to JSON-LD: ${error.message}`);
    }
}

/**
 * Creates JSON-LD context from namespace configuration
 * @param {object} $store - Vuex store
 * @returns {object} JSON-LD context
 */
function createJsonLdContext($store) {
    const namespaces = $store.getters["properties/getPropertiesByClass"]("plus:Namespace");

    const context = {};
    namespaces.forEach((ns) => {
        ns.indicators?.forEach((prefix) => {
            if (!["mdi", "pdf", "html"].includes(prefix)) {
                context[prefix] = ns.identifier;
            }
        });
    });

    return context;
}


export default {
    rdfXmlToJsonLd,
    createJsonLdContext
};

