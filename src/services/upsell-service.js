/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

const singleton = Symbol();
const singletonUpsellService = Symbol();

export class UpsellService {
    constructor(confirmService) {
        if (confirmService !== singletonUpsellService) {
            throw new Error("Cannot construct singleton");
        }

        this._upsellRef = null;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new UpsellService(singletonUpsellService);
        }

        return this[singleton];
    }

    register(confimRef) {
        this._upsellRef = confimRef;
    }

    unregister() {
        this._upsellRef = null;
    }

    async open(reason) {
        if (this._upsellRef) {
            return await this._upsellRef.openDialog(reason);
        }
        // eslint-disable-next-line no-console
        console.debug("Upsell-Dialog not registered");
        return true;
    }
}
