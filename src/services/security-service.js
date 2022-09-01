/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

const singleton = Symbol();
const singletonSecurityService = Symbol();

/**
 * Globale Rechte und Rollen-Checks
 */
export class SecurityService {

    constructor(securityService) {
        if (securityService !== singletonSecurityService) {
            throw new Error("Cannot construct singleton");
        }

        this._permissions = [];
        this._roles = [];
    }

    /**
     * Zugriff auf Singleton
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new SecurityService(singletonSecurityService);
        }

        return this[singleton];
    }

    set permissions(permissions) {
        this._permissions = permissions;
    }

    set roles(roles) {
        this._roles = roles;
    }

    /**
     * Hole alle Berechtigungen
     */
    get permissions() {
        return (this._permissions || []);
    }

    /**
     * Hole alle Rollen
     */
    get roles() {
        return (this._roles || []);
    }

    /**
     * Prüfung auf Berechtigung.
     * @param {...string} arguments - Alle Berechtigungen müssen gegeben sein
     */
    check() {
        // Siehe arguments zur Verwaltung von n Parametern.
        // ...arg funktioniert bspw. nicht im Edge.
        return Array.from(arguments).every((arg) => {
            if (typeof arg === "string" && this._permissions !== null) {
                return this.permissions.indexOf(arg) !== -1;
            }

            return true;
        });
    }

    /**
     * Prüfung auf Berechtigung.
     * @param {(string|string[])} arguments - Mindestens eine der Berechtigungen muss gegeben sein
     */
    checkOr() {
        // Siehe arguments zur Verwaltung von n Parametern.
        // ...arg funktioniert bspw. nicht im Edge.
        return Array.from(arguments).some((arg) => {
            if (typeof arg === "string" && this._permissions !== null) {
                return this.permissions.indexOf(arg) !== -1;
            }

            return true;
        });
    }

    /**
     * Prüfung auf Rolle.
     * @param {string} role
     */
    hasRole(role) {
        if (typeof role === "string" && this._roles !== null) {
            return this.roles.indexOf(role) !== -1;
        }

        return true;
    }
}