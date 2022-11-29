/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

export default {
    mimeType(store, fsFileType, fsFileName) {
        const types = store.getters["properties/getPropertiesByClass"]("plus:MimeType");
        const name = fsFileName ?? "";
        const fsExt = name.split(".").pop();

        const indicators = types.reduce((all, type) => {
            if (!!type.indicators) all.push(...type.indicators);
            return all;
        }, []);

        if (types.map(type => type.identifier).includes(fsFileType)) {
            return fsFileType;
        }
        if (indicators.includes(fsFileType)) {
            return types.find(type => !!type.indicators && type.indicators.includes(fsFileType)).identifier;
        }
        if (indicators.includes(fsExt)) {
            return types.find(type => !!type.indicators && type.indicators.includes(fsExt)).identifier;
        }

        return fsFileType;
    },
    objectType(store, fsFileType, fsFileName, propObjectType) {
        const types = store.getters["properties/getPropertiesByClass"]("plus:Objecttype");
        const mimeType = this.mimeType(store, fsFileType, fsFileName);

        const indicators = types.reduce((all, type) => {
            if (!!type.indicators) all.push(...type.indicators);
            return all;
        }, []);

        if (typeof propObjectType === "string") {
            return propObjectType;
        }
        if (indicators.includes(mimeType)) {
            return types.find(type => !!type.indicators && type.indicators.includes(mimeType)).identifier;
        }

        return "plus:Document";
    },
    parseLocale(identifier) {
        const prefix = "plus:lang:ISO-639-1:";
        if (identifier?.includes(prefix)) {
            return identifier.substring(prefix.length);
        } else if (identifier?.match(/^(\w\w)-(\w\w)$/)) {
            return identifier.split("-")[0];
        } else {
            // Fallback
            return identifier.substring(0, identifier.lastIndexOf(":"));
        }
    },
    country(store, locale) {
        const languageTag = this.language(store, locale);
        const country = ((languageTag || "").split("-") || [])[1];
        return country;
    },
    filterObjectType(store, objectUuid, propObjectType) {
        let object = store.getters["storage/getObjectByUuid"](objectUuid);

        if (propObjectType === undefined) {
            return true;
        } else if (typeof propObjectType === "string") {
            return propObjectType === object.type;
        } else if (Array.isArray(propObjectType)) {
            propObjectType.includes(object.type);
        } else return false;
    },
    language(store, locale, concept = "vdi:Language") {
        if (!locale) return null;

        const normalizeIndicator = ind => (ind.substr(0,1) === "-" || ind.substr(0,1) === "#") ? ind.slice(1) : ind;

        const languageProps = store.getters["properties/getPropertiesByClass"](concept)
            .filter(prop => !store.getters["properties/getPropertyAttributeById"](prop.identifier, "plus:inactiveProperty"));
        const languageCodes = languageProps.flatMap(lang => (lang?.indicators ?? [] )).map(normalizeIndicator);

        let match = undefined;

        // if locale seems like language Tag "xx-XX"
        if (locale && typeof locale === "string" && locale.match(/^(\w\w)-(\w\w)$/)) {
            match = languageProps.find(prop => prop.indicators.map(normalizeIndicator).includes(locale.split("-")[0]));
        }
        if (locale && languageCodes.includes(locale)) {
            match = languageProps.find(prop => prop.indicators.map(normalizeIndicator).includes(locale));
        }
        return (match) ? match.identifier : null;
    },
};
