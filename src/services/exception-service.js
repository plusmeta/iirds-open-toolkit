/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import { NotifyService } from "@/services/notify-service";

const singleton = Symbol();
const singletonExeptionService = Symbol();

export class ExeptionService {
    constructor(exeptionService) {
        if (exeptionService !== singletonExeptionService) {
            throw new Error("Cannot construct singleton");
        }

        this._ns = NotifyService.instance;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ExeptionService(singletonExeptionService);
        }

        return this[singleton];
    }
    handleException(error) {
        if (typeof error === "string") {
            // eslint-disable-next-line no-console
            console.debug(error);
        } else if (typeof error.message === "string" && error.message.toUpperCase() === "network error".toUpperCase()) {
            return;
        }
        if (error.response) {
            /*
            * The request was made and the server responded with a
            * status code that falls out of the range of 2xx
            */
            this._ns.send(error.response.data.message || error.response.data.Message, "error");
            this.progress = 0;
        } else if (error.request) {
            /*
            * The request was made but no response was received, `error.request`
            * is an instance of XMLHttpRequest in the browser and an instance
            * of http.ClientRequest in Node.js
            */
            this._ns.send(error.message, "error");
        } else {
            // Something happened in setting up the request and triggered an Error
            // eslint-disable-next-line no-console
            console.log(error, "info");
            if (error.message) {
                this._ns.send(error.message, "error");
            } else {
                this._ns.send("Unknown Error", "error");
            }
        }
    }
};