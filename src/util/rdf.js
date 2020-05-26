/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import { v4 as uuid4, v5 as uuid5 } from "uuid";
import config from "@/config";
import util from "@/util";

const RDF = {
    urn(uuid) {
        return `urn:uuid:${uuid}`;
    },
    newURN() {
        return this.urn(uuid4());
    },
    newUUID() {
        return uuid4();
    },
    uuidFromString(string) {
        return uuid5(string, config.plusmetaNamespaceUUID);
    },
    uuidFromObject(object) {
        return this.uuidFromString(JSON.stringify(object));
    },
    isValidLanguageTag(str) {
        const pattern = /^[A-Za-z]{2,4}([_-][A-Za-z]{4})?([_-]([A-Za-z]{2}|[0-9]{3}))?$/;
        return !!str.match(pattern);
    },
    isPrefixed(str) {
        return !!String(str).trim().match(/^(\w+):(\w+)$/);
    },
    getKnownPrefixes($store) {
        const namespaces = $store.getters["properties/getPropertiesByClass"]("plus:Namespace");
        return namespaces.flatMap(ns => ns.indicators);
    },
    isKnownPrefixed(str, $store) {
        const known = this.getKnownPrefixes($store);
        let parsed = String(str).trim().match(/^(\w+):(\w+)$/);
        if (parsed && parsed.length === 3) {
            let assignedPrefix = parsed[1];
            return known.includes(assignedPrefix);
        } else return false;
    },
    expand(uri, $store) {
        const namespaces = $store.getters["properties/getPropertiesByClass"]("plus:Namespace");

        let parsed = String(uri).trim().match(/^(\w+):(\w+)$/);
        if (parsed && parsed.length === 3) {
            let assignedPrefix = parsed[1];
            let assignedSuffix = parsed[2];
            let assigedNamespace = namespaces.find(ns => ns.indicators.includes(assignedPrefix));
            if (assigedNamespace) return assigedNamespace.identifier + assignedSuffix;
        }

        return uri;
    },
    collapse(uri, $store) {
        const namespaces = $store.getters["properties/getPropertiesByClass"]("plus:Namespace");
        let result = uri;

        namespaces.forEach((ns) => {
            let escaped = util.escapeRegExp(ns.identifier);
            let matcher = new RegExp(`^(${escaped})(.+)$`);
            let parsed = String(uri).trim().match(matcher);
            if (parsed && parsed.length === 3 && ns.indicators?.length) {
                let assignedSuffix = parsed[2];
                result = `${ns.indicators[0]}:${assignedSuffix}`;
            }
        });

        return result;
    }
};

export default RDF;