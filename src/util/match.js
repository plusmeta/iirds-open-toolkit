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
    language(store, locale) {
        const languages = store.getters["properties/getPropertiesByClass"]("plus:Language");

        const indicators = languages.reduce((all, lang) => {
            if (!!lang.indicators) all.push(...lang.indicators);
            return all;
        }, []);

        let match = undefined;

        if (locale && languages.map(lang => lang.identifier).includes(locale)) {
            match = locale;
        }
        if (locale && !match && indicators.includes(locale)) {
            match = languages.find((lang) => {
                return !!lang.indicators && lang.indicators.includes(locale);
            })?.identifier;
        }
        if (locale && !match && typeof locale === "string" && indicators.includes(locale.split("-")[0])) {
            match = languages.find((lang) => {
                return !!lang.indicators && lang.indicators.includes(locale);
            })?.identifier;
        }
        return match;
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
    }
};
