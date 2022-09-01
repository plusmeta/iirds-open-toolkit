/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

const singleton = Symbol();
const singletonConfirmService = Symbol();

export class ConfirmService {
    constructor(confirmService) {
        if (confirmService !== singletonConfirmService) {
            throw new Error("Cannot construct singleton");
        }

        this._confirmRef = null;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ConfirmService(singletonConfirmService);
        }

        return this[singleton];
    }

    register(confimRef) {
        this._confirmRef = confimRef;
    }

    unregister() {
        this._confirmRef = null;
    }

    async open(title, message, options) {
        if (this._confirmRef) {
            return await this._confirmRef.open(
                title,
                message,
                options
            );
        }
        // eslint-disable-next-line no-console
        console.debug("Confirm-Dialog not registered");
        return true;
    }
}
