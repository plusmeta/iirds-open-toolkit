/* eslint-disable no-alert */
/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import * as Sentry from "@sentry/browser";

import { SecurityService } from "@/services/security-service";
import { AuthInterface } from "@/services/auth/auth-interface";

import router from "@/router/standalone";
import store from "@/store/standalone";

import Vue from "vue";

/**
 * Verwaltet Authentifikation und hält benutzerbezogene Daten
 */
export class StandaloneService extends AuthInterface {

    constructor() {
        super();
        this._authContext = null;

        this._refreshTokenInterval = null;
        this._localUser = null;
        this._isPublic = null;

        SecurityService.instance.roles = null;
        SecurityService.instance.permissions = null;
    }

    initEventBus(appCtx) {}

    changeLocale(locale) {}

    shutdown() {}

    get hasOffline() {
        return false;
    }

    get isOffline() {
        return true;
    }

    get router() {
        return router;
    }

    get store() {
        return store;
    }

    logout() {}

    ready() {
        if (!this._authContext) {
            return this._initContext();
        }

        return !!this._authContext;
    }

    cleanupPreauthSession(reason) {
        // eslint-disable-next-line no-console
        SecurityService.instance.permissions = null;
        SecurityService.instance.roles = null;
        localStorage.clear();
        if (!!+process.env.VUE_APP_SENTRY_IS_ACTIVE) {
            Sentry.setUser({});
        }
    }

    checkServerStatus() {
        return true;
    }

    signIn(authContext) {
        this.cleanupPreauthSession("publicId");
        this._authContext = authContext;
        if (!!+process.env.VUE_APP_SENTRY_IS_ACTIVE) {
            Sentry.setUser({
                id: this.sub,
                email: this.email,
                username: this.name
            });
        }
        localStorage.setItem("userContext", JSON.stringify(authContext));
    }

    get isPublic() {
        return true;
    }

    get localUser() {
        return this._localUser;
    }

    get orgaId() {
        return this._authContext?.email || "";
    }

    get sub() {
        return this._authContext?.email || "";
    }

    get email() {
        return this._authContext?.email || "";
    }

    get name() {
        return this._authContext?.email || "";
    }

    get username() {
        return this._authContext?.email || "";
    }

    get identityPoolId() {
        return "";
    }

    get userIdentityId() {
        return "";
    }

    getFile(filePath, download = true) {
        return true;
    }

    putFile(filePath, mimeType, file) {
        return true;
    }

    set authContext(authContext) {
        Vue.set(this, "_authContext", authContext);
    }

    _handleAuthException(e, internalMsg) {
        if (typeof e === "string") {
        } else if (typeof e.message === "string" && e.message.toUpperCase() === "network error".toUpperCase()) {
            throw e;
        }
        // eslint-disable-next-line no-console
        console.debug(e);
        this.cleanupPreauthSession(internalMsg);
    }

    _initContext() {
        this._setUserContext();
        return this._authContext;
    }

    _setUserContext() {
        try {
            // Userdaten aus Storage ziehen
            this.signIn(JSON.parse(localStorage.getItem("userContext")));
        } catch (e) {
            this._handleAuthException(e, "_setUserContext");
            throw e;
        }
    }
}
