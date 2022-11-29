/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";

// state
const state = {
    projects: []
};

// getters
const getters = {
    getProjectByUuid: state => (projectUuid) => {
        return state.projects.find((project) => {
            return project.uuid === projectUuid;
        });
    },
    getCurrentProject: (state, getters) => {
        return state.projects.find((project) => {
            return project.uuid === getters.getCurrentProjectUuid;
        });
    },
    getCurrentProjectUuid: (state, getters, rootState, rootGetters) => {
        return rootGetters["settings/getCurrentProjectUuid"];
    },
    getCurrentProjectName: (state, getters) => {
        let currentProject = getters.getCurrentProject;
        return (currentProject) ? currentProject.name : null;
    },
    getCurrentProgress: (state, getters) => {
        let currentProject = getters.getCurrentProject;
        return (currentProject) ? currentProject.progress : null;
    },
    getCurrentWorkflowId: (state, getters) => {
        let currentProject = getters.getCurrentProject;
        return (currentProject) ? currentProject.workflow : null;
    },
    getCurrentObjectUuids: (state, getters) => {
        let currentProject = getters.getCurrentProject;
        return (currentProject && currentProject.objectUuids) ? currentProject.objectUuids : [];
    },
    getCurrentProjectRelationById: (state, getters) => (relId) => {
        let currentProject = getters.getCurrentProject;
        if (currentProject && currentProject.rels.hasOwnProperty(relId)) {
            return currentProject.rels[relId];
        } else {
            return [];
        }
    },
    getCurrentProjectRelations: (state, getters) => {
        let currentProject = getters.getCurrentProject;
        return currentProject?.rels || {};
    },
};

// actions
const actions = {
    setCurrentProgressLocal({ commit, getters, dispatch }, toProgress) {
        let project = getters.getCurrentProject;
        if (project && project?.progress !== toProgress) {
            commit("SET_WORKFLOW_STEP", {project, toProgress});
        }
    },
    nextProjectStepLocal({ commit, getters }) {
        let project = getters.getCurrentProject;
        commit("NEXT_WORKFLOW_STEP", project);
    },
    previousProjectStepLocal({ commit, getters }) {
        let project = getters.getCurrentProject;
        commit("PREV_WORKFLOW_STEP", project);
    },
    startNewProjectLocal ({ commit, dispatch }, project) {
        dispatch("saveProjectLocal", project);
        dispatch("settings/setCurrentProjectLocal", project.uuid, { root: true });
    },
    saveProjectLocal({ commit, getters, rootGetters, dispatch }, newProject) {
        let oldProject = getters.getProjectByUuid(newProject.uuid);
        if (oldProject !== undefined) {
            commit("UPDATE_PROJECT", { oldProject, newProject });
            commit("SET_PROJECT_OBJECT_UUIDS", { project: oldProject, objectUuids: newProject.objectUuids });
        } else {
            commit("ADD_PROJECT", newProject);
        }
    },
    deleteObjectsFromProject({ commit, getters, dispatch, rootGetters }, { projectUuid, objectUuids }) {
        const project = getters.getProjectByUuid(projectUuid);
        const filteredObjectUuids = project.objectUuids.filter(objectUuid => objectUuids.indexOf(objectUuid) === -1);
        commit("SET_PROJECT_OBJECT_UUIDS", { project, objectUuids: filteredObjectUuids });
    },
    addObjectsToProject({ commit, getters }, { projectUuid, objectUuids }) {
        const project = getters.getProjectByUuid(projectUuid);
        let allObjectUuids = objectUuids;
        if (project.objectUuids) {
            allObjectUuids = objectUuids.filter(uuid => (project.objectUuids.indexOf(uuid) === -1));
            allObjectUuids = allObjectUuids.concat(project.objectUuids);
        }
        commit("SET_PROJECT_OBJECT_UUIDS", { project, objectUuids: allObjectUuids });
    },
    updateProjectStatus(context, {projectUuid, status}) {
        let project = context.getters.getProjectByUuid(projectUuid);
        context.commit("UPDATE_PROJECT_STATUS", {project, status});
    },
    updateCurrentProjectRelations(context, relation) {
        let project = context.getters.getCurrentProject;
        context.commit("UPDATE_PROJECT_RELS", {project, relation});
    }
};

// mutations
const mutations = {
    ADD_PROJECT (state, payload) {
        state.projects.push(payload);
    },
    SET_PROJECT_OBJECT_UUIDS (state, { project, objectUuids }) {
        Vue.set(project, "objectUuids", objectUuids);
    },
    UPDATE_PROJECT (state, {oldProject, newProject}) {
        oldProject = Object.assign(oldProject, newProject);
    },
    UPDATE_PROJECT_STATUS (state, {project, status}) {
        project.status = status;
    },
    UPDATE_PROJECT_RELS (state, {project, relation}) {
        project.rels = Object.assign({}, project.rels, relation);
    },
    SET_WORKFLOW_STEP (state, {project, toProgress}) {
        project.progress = toProgress;
    },
    NEXT_WORKFLOW_STEP (state, project) {
        project.progress++;
    },
    PREV_WORKFLOW_STEP (state, project) {
        project.progress--;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

