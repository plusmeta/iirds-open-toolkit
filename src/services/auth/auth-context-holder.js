/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import { AuthInterface } from "@/services/auth/auth-interface";

const singleton = Symbol();

/**
 * Authentifikation-Fassade
 */
export class AuthContextHolder {

    constructor(authService) {
        if (authService !== singletonAuthService) {
            throw new Error("Cannot construct singleton");
        }
    }

    /**
     * Zugriff auf Implementation-Singleton
     */
    static get instance() {
        if (this[singleton]) {
            return this[singleton];
        }

        return undefined;
    }

    /**
     * Switch zu Offline-Modus
     */
    static set instance(impl) {
        if (this[singleton]) {
            this[singleton].shutdown();
        }

        if (impl && impl instanceof AuthInterface) {
            this[singleton] = impl;
        } else {
            throw new Error("no AuthInterface");
        }
    }

    static get router() {
        return this[singleton]?.router;
    }

    static get store() {
        return this[singleton]?.store;
    }

    /**
     * Switch zu Offline-Modus
     */
    static setOffline() {
        if (!this[singleton].isOffline && this[singleton].hasOffline) {
            this[singleton] = this[singleton].getOfflineAuth;
        }
    }

    /**
     * Switch zu Offline-Modus
     */
    static get hasOffline() {
        return this[singleton]?.hasOffline;
    }

    /**
     * Switch zu Offline-Modus
     */
    static get isOffline() {
        return this[singleton]?.isOffline;
    }
}
