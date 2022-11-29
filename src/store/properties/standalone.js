/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import util from "@/util";

const init = () => {
    const modules = require.context("@/config/props", true, /\.json$/);
    const properties = modules.keys().map(modules);
    return properties.flat();
};

const state = {
    properties: []
};

const getters = {
    _dict: (state) => {
        return state.properties.reduce(({ ixById, ixsByType, ixsByClass, ixsByRole }, item, index) => {
            ixById[item.identifier] = index;
            // by DataType
            if (!ixsByType.hasOwnProperty(item.datatype)) {
                ixsByType[item.datatype] = [];
            }
            ixsByType[item.datatype].push(index);
            // by Class/Taxonomy
            if (!ixsByClass.hasOwnProperty(item.subClassOf)) {
                ixsByClass[item.subClassOf] = [];
            }
            ixsByClass[item.subClassOf].push(index);
            // by Role
            let roleRelation = (item.rels ?? {})["plus:has-roles"] ?? [];
            roleRelation.forEach((role) => {
                if (!ixsByRole.hasOwnProperty(role)) {
                    ixsByRole[role] = [];
                }
                ixsByRole[role].push(index);
            });
            return { ixById, ixsByType, ixsByClass, ixsByRole };
        }, { ixById: {}, ixsByType: {}, ixsByClass: {}, ixsByRole: {} });
    },
    indexByIdentifier: (state, getters) => {
        return getters._dict.ixById;
    },
    indizesByClass: (state, getters) => {
        return getters._dict.ixsByClass;
    },
    indizesByRole: (state, getters) => {
        return getters._dict.ixsByRole;
    },
    isProperty: (state, getters) => (identifier) => {
        return !!state.properties[getters.indexByIdentifier[identifier]];
    },
    getPropertyById: (state, getters) => (identifier) => {
        return state.properties[getters.indexByIdentifier[identifier]];
    },
    getPropertiesByClass: (state, getters) => (className) => {
        if (className === undefined) {
            return state.properties;
        } else if (typeof className === "string") {
            return getters.indizesByClass[className]?.map(ix => state.properties[ix]).filter(Boolean) || [];
        } else if (Array.isArray(className)) {
            return className.flatMap(name => getters.indizesByClass[name]?.map(ix => state.properties[ix])).filter(Boolean) || [];
        } else return [];
    },
    getPropertiesByRole: (state, getters) => (role) => {
        if (role === undefined) {
            return state.properties;
        } else if (typeof role === "string") {
            return getters.indizesByRole[role]?.map(ix => state.properties[ix]).filter(Boolean) || [];
        } else if (Array.isArray(role)) {
            let collection = role.flatMap(name => getters.indizesByRole[name]?.map(ix => state.properties[ix])).filter(Boolean) || [];
            return util.uniqueProperties(collection);
        } else return [];
    },
    getInstancesByClass: (state, getters) => (className) => {
        if (className === undefined) {
            return state.properties;
        }  else {
            const props =[];
            getters.indizesByClass[className]?.forEach((index) => {
                let prop = state.properties[index] ?? {};
                if (prop.datatype === "plus:Instance") {
                    props.push(prop);
                }
                if (prop.datatype === "plus:Class") {
                    props.push(...getters.getInstancesByClassOrRole(prop.identifier));
                }
            });
            return props;
        }
    },
    getInstancesByClassOrRole: (state, getters) => (className) => {
        if (className === undefined) {
            return state.properties;
        }  else {
            const props =[];
            getters.indizesByClass[className]?.forEach((index) => {
                let prop = state.properties[index] ?? {};
                if (prop.datatype === "plus:Instance") {
                    props.push(prop);
                }
                props.push(...getters.getInstancesByClass(prop.identifier));
            });
            getters.indizesByRole[className]?.forEach((index) => {
                let prop = state.properties[index] ?? {};
                if (prop.datatype === "plus:Instance") {
                    props.push(prop);
                }
                props.push(...getters.getInstancesByClass(prop.identifier));
            });
            return util.uniqueProperties(props);
        }
    },
    getPropertyType: (state, getters) => (propId) => {
        let known = getters.getPropertyById(propId);
        return (known) ? known.datatype : undefined;
    },
    getPropertyLabelById: (state, getters, rootState, rootGetters) => (propId, lang) => {
        if (!!propId) {
            let property = getters.getPropertyById(propId);
            let locale = lang ?? rootGetters["settings/getCurrentLocale"];
            if (!property) {
                return "";
            } else if (!!property.labels && typeof property.labels === "object" && (!!property.labels[locale] || !!property.labels[process.env.VUE_APP_I18N_FALLBACK_LOCALE])) {
                return property.labels[locale];
            } else if (!!property.label && typeof property.label === "object" && (!!property.label[locale] || !!property.labels[process.env.VUE_APP_I18N_FALLBACK_LOCALE])) {
                return property.label[locale];
            } else if (typeof property.label === "string") {
                return property.label;
            } else {
                return "";
            }
        } else return "";
    },
    getPropertyLabels: (state, getters, rootState, rootGetters) => (propId) => {
        if (!!propId) {
            let property = getters.getPropertyById(propId);
            let locale = rootGetters["settings/getCurrentLocale"];
            if (property) {
                if (property && property.labels && Object.keys(property.labels).length) {
                    return property.labels;
                } else {
                    if (typeof property.label !== "string") {
                        return property.label;
                    }
                    return { [locale]: property.label };
                }
            } else return {};
        } else return {};
    },
    getPropertyRelationById: (state, getters) => (propId, relId) => {
        let property = getters.getPropertyById(propId);
        if (!!property &&
            !!property.rels &&
            !!property.rels[relId]) {
            return property.rels[relId];
        } else {
            return [];
        }
    },
    isRequired: (state, getters) => (uri) => {
        return getters.getPropertyAttributeById(uri, "plus:requiredAssignment") === true;
    },
    resolveAssignedRelationType: (state, getters) => (uri) => {
        let resolved = getters.getPropertyRelationById(uri, "plus:has-relations");
        if (resolved.length > 0) {
            return resolved[0];
        }
        return uri;
    },
    getPropertyAttributeById: (state, getters) => (propId, attrId) => {
        let property = getters.getPropertyById(propId);
        if (!!property &&
            !!property.attrs &&
            !!property.attrs[attrId]) {
            return property.attrs[attrId];
        } else {
            return undefined;
        }
    },
    getPropertyIcon: (state, getters) => (propId, defaultIcon) => {
        let icon = getters.getPropertyRelationById(propId, "plus:has-icons");
        icon = icon ? icon[0] : undefined;
        icon = icon ? icon.replace(":", "-") : defaultIcon;
        return icon;
    },
    getGuidelines: (state, getters, rootState, rootGetters) => {
        return Object.keys(rootGetters["projects/getCurrentProjectRelations"])
            .filter((rel) => {
                let prop = getters.getPropertyById(rel);
                if (prop?.rels) {
                    let roles = getters.getPropertyRelationById(rel, "plus:has-roles");
                    return roles.includes("plus:EquipmentMetadata");
                }
                return false;
            })
            .map(rel => getters.getPropertyById(rel))
            .map((prop) => {
                let id = prop.identifier;
                const position = getters.getPropertyAttributeById(id, "plus:guidelineListPriority") || 99;
                const icon = getters.getPropertyIcon(id);

                return {
                    id,
                    value: rootGetters["projects/getCurrentProjectRelationById"](id),
                    text: getters.getPropertyLabelById(id),
                    type: prop.datatype,
                    position,
                    icon
                };
            })
            .filter(prop => prop?.value?.length > 0)
            .sort((a, b) => a?.text?.localeCompare(b?.text))
            .sort((a, b) => a.position - b.position);
    },
    getPropertyTooltip: (state, getters, rootState, rootGetters) => (propId) => {
        let attrValue = getters.getPropertyAttributeById(propId, "plus:tooltipInfo");
        let locale = rootGetters["settings/getCurrentLocale"];
        if (attrValue && locale) {
            return attrValue[locale] || attrValue[process.env.VUE_APP_I18N_FALLBACK_LOCALE];
        } else {
            return undefined;
        }
    }
};

const actions = {
    savePropertiesLocal ({ commit, getters, dispatch }, properties) {
        properties = (Array.isArray(properties)) ? properties : [properties];
        properties.forEach((prop) => {
            let old = getters.getPropertyById(prop.identifier);
            if (old) {
                commit("UPDATE_PROPERTY", [old, prop]);
            } else {
                commit("ADD_PROPERTY", prop);
            }
        });
    },
    fetchProperties ({ commit }) {
        commit("INIT_PROPERTIES", init());
    },
    addProperty ({ commit }, property) {
        commit("ADD_PROPERTY", property);
    },
    changePropertyId ({ commit, getters, state }, {oldId, newId}) {
        let index = getters.indexByIdentifier[oldId];
        let property = state.properties[index];
        property.identifier = newId;
        if (index) commit("CHANGE_PROPERTY_ID", {index, property});
    },
    deleteProperty ({ commit, getters }, propId) {
        let index = getters.indexByIdentifier[propId];
        if (index) commit("DELETE_PROPERTY", index);
    },
    createProperty ({ commit, getters }, properties) {
        properties = (Array.isArray(properties)) ? properties : [properties];
        properties.forEach((property) => {
            if (property && property.hasOwnProperty("identifier")) {
                let exists = getters.getPropertyById(property.identifier);
                if (!exists) {
                    commit("ADD_PROPERTY", property);
                    return true;
                } else return false;
            }
        });
    }
};

const mutations = {
    INIT_PROPERTIES (state, properties) {
        state.properties = properties;
    },
    ADD_PROPERTY (state, property) {
        state.properties.push(property);
    },
    DELETE_PROPERTY (state, index) {
        state.properties.splice(index, 1);
    },
    CHANGE_PROPERTY_ID (state, {index, property}) {
        state.properties[index] = property;
    },
    UPDATE_PROPERTY (state, [old, update]) {
        Object.assign(old, update);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
