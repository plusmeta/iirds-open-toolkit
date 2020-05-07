/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import { Subject } from "rxjs";

const singleton = Symbol();
const singletonNotifyService = Symbol();

export class NotifyService {
    constructor(notifyService) {
        if (notifyService !== singletonNotifyService) {
            throw new Error("Cannot construct singleton");
        }

        this._notify$ = new Subject();
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new NotifyService(singletonNotifyService);
        }

        return this[singleton];
    }

    send(message = "", messageType = "info", messageSeconds = 2) {
        this._notify$.next({
            text: message,
            color: messageType,
            timeout: messageSeconds * 1000
        });
    }

    onMessage() {
        return this._notify$;
    }
}
