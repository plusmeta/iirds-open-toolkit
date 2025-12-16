/*!
 * Copyright 2020 plusmeta GmbH
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
    indizesByType: (state, getters) => {
        return getters._dict.ixsByType;
    },
    indizesByClass: (state, getters) => {
        return getters._dict.ixsByClass;
    },
    indizesByRole: (state, getters) => {
        return getters._dict.ixsByRole;
    },
    getDict: (state, getters) => {
        return getters._dict;
    },
    isProperty: (state, getters) => (identifier) => {
        return !!state.properties[getters.indexByIdentifier[identifier]];
    },
    getPropertyById: (state, getters) => (identifier) => {
        return state.properties[getters.indexByIdentifier[identifier]];
    },
    getPropertyIndexById: (state, getters) => (identifier) => {
        return getters.indexByIdentifier[identifier];
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
    getPropertiesByType: (state, getters) => (type) => {
        if (type === undefined) {
            return state.properties;
        } else if (typeof type === "string") {
            return getters.indizesByType[type]?.map(ix => state.properties[ix]).filter(Boolean) || [];
        } else if (Array.isArray(type)) {
            return type.flatMap(name => getters.indizesByType[name]?.map(ix => state.properties[ix])).filter(Boolean) || [];
        } else return [];
    },
    getPropertiesByRole: (state, getters) => (role) => {
        if (role === undefined) {
            return state.properties;
        } else if (typeof role === "string") {
            return getters.indizesByRole[role]?.map(ix => state.properties[ix]).filter(Boolean) || [];
        } else if (Array.isArray(role)) {
            // FIXME no uniqueness if using standard method
            return getters.indizesByRole[role[0]]?.map(ix => state.properties[ix]).filter(Boolean) || [];
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
            } else if (!!property.labels && typeof property.labels === "object" && !!property.labels[locale]) {
                return property.labels[locale];
            } else if (!!property.label && typeof property.label === "object" && !!property.label[locale]) {
                return property.label[locale];
            } else if (typeof property.label === "string") {
                return property.label;
            } else {
                return "";
            }
        } else return "";
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
    getPropertyTooltip: (state, getters, rootState, rootGetters) => (propId) => {
        let attrValue = getters.getPropertyAttributeById(propId, "plus:tooltipInfo");
        let locale = rootGetters["settings/getCurrentLocale"];
        if (attrValue && locale) {
            return attrValue[locale] || attrValue[process.env.VUE_APP_I18N_FALLBACK_LOCALE];
        } else {
            return undefined;
        }
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
    }
};

const actions = {

    addRoleToProperty({commit, getters}, {identifier, role}) {
        let property = getters.getPropertyById(identifier);
        if (!property) return;

        const existingRoles = property.rels?.["plus:has-roles"] || [];

        if (existingRoles.includes(role)) return;

        const updatedRoles = [...existingRoles, role];
        const updatedProperty = {
            ...property,
            rels: {
                ...(property.rels || {}),
                "plus:has-roles": updatedRoles
            }
        };
        commit("UPDATE_PROPERTY", [property, updatedProperty]);
    },

    deleteRoleFromProperty({commit, getters}, {identifier, role}) {
        let property = getters.getPropertyById(identifier);
        if (property && property.rels && Array.isArray(property.rels["plus:has-roles"])) {
            const updatedRoles = property.rels["plus:has-roles"].filter(r => r !== role);
            const updatedProperty = {
                ...property,
                rels: {
                    ...property.rels,
                    "plus:has-roles": updatedRoles
                }
            };
            commit("UPDATE_PROPERTY", [property, updatedProperty]);
        }
    },
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
