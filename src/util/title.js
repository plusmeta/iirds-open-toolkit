import util from "@/util";

const titleUtils = {
    getTitlesWithInfo(store, object, ignoreGeneratedTitle = true) {
        const titles = [];
        let i = 99;

        store.getters["properties/getPropertiesByRole"]("plus:TitleProperty").forEach((prop) => {
            if (ignoreGeneratedTitle && prop.identifier === "plus:GeneratedTitle") return;
            if (ignoreGeneratedTitle && prop.identifier === "vdi:has-title") return;
            let value = util.getMetadataValue(object, prop.identifier);
            if (value && typeof value === "string") value = value.trim();
            let prio = Number(store.getters["properties/getPropertyAttributeById"](prop.identifier, "plus:titlePriority")) || i++;
            if (value) titles[prio] = { value, uri: prop.identifier, prio };
        });

        return titles.filter(Boolean).filter(title => title.value && typeof title.value === "string");
    },
    getTitles(store, object, ignoreGeneratedTitle) {
        return this.getTitlesWithInfo(store, object, ignoreGeneratedTitle).map(title => title.value);
    },
    getTitleBase(store) {
        return store.getters["properties/getPropertiesByRole"]("plus:TitlePart") || [];
    },
    getTitleParts(store, object) {
        const titleParts = [];
        let i = 99;

        this.getTitleBase(store).forEach((prop) => {
            let rels =  store.getters["properties/getPropertyRelationById"](prop.identifier, "plus:has-relations");
            let prio =  store.getters["properties/getPropertyAttributeById"](prop.identifier, "plus:titlePartPriority") || i++;
            if (!rels.length) rels = [prop.identifier];

            titleParts[prio] = {
                concept: prop.identifier,
                value: rels.flatMap(rel => util.getMetadataValue(object, rel, { $store: store }))
            };
        });

        return titleParts.filter(Boolean).filter(titlePart => !!titlePart.value);
    },
    generateTitle(store, object, locale) {
        const titlePartRole = store.getters["properties/getPropertyById"]("plus:TitlePart") || { indicators: [] };

        const titlePartSeperatorLvl1 = store.getters["properties/getPropertyAttributeById"](titlePartRole.identifier, "plus:titlePartSeparatorLevel1") || " - "; // Fallback seperator: -
        const titlePartSeperatorLvl2 = store.getters["properties/getPropertyAttributeById"](titlePartRole.identifier, "plus:titlePartSeparatorLevel2") || "+"; // Fallback seperator: /#

        const titleParts = this.getTitleParts(store, object);
        const titleBase = this.getTitleBase(store);

        let generatedTitle = titleParts
            .map((titlePart) => {
                if (Array.isArray(titlePart.value)) {
                    return titlePart.value
                        .map((titlePartEntry) => {
                            let externalName = store.getters["properties/getPropertyAttributeById"](titlePartEntry, "plus:externalName");
                            let publicName = store.getters["properties/getPropertyAttributeById"](titlePartEntry, "plus:publicName");
                            if (externalName && externalName !== "") {
                                return externalName;
                            } else if (publicName && publicName !== "") {
                                return publicName;
                            } else {
                                return store.getters["properties/getPropertyLabelById"](titlePartEntry, locale) || titlePartEntry;
                            }
                        })
                        .filter(Boolean)
                        .join(titlePartSeperatorLvl2);
                } else {
                    return store.getters["properties/getPropertyLabelById"](titlePart.value, locale) || titlePart.value;
                }
            })
            .filter(Boolean)
            .join(titlePartSeperatorLvl1);

        let confidence = (titleParts.length / titleBase.length);

        return {generatedTitle, confidence};
    }
};

export default titleUtils;
