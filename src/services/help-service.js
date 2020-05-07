/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import config from "@/config";

const singleton = Symbol();
const singletonHelpService = Symbol();

export class HelpService {
    constructor(helpService) {
        if (helpService !== singletonHelpService) {
            throw new Error("Cannot construct singleton");
        }

        this.context = [];
        this.locale = "de";
        this.fallback = "start.welcome";
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new HelpService(singletonHelpService);
        }

        return this[singleton];
    }

    setHelpLocale(locale, context) {
        this.context = context;
        this.locale = locale;
    }

    getContextHelp(helpkey) {
        if (helpkey && this.context && Array.isArray(this.context)) {
            return this.context.find(page => page?.key === helpkey);
        }

        return undefined;
    }

    getFallbackPage() {
        const fallbackContext = this.getContextHelp(this.fallback);
        if (fallbackContext && fallbackContext.page) {
            return fallbackContext.page;
        }
    }

    getSectionFragment(helpkey) {
        const contextHelp = this.getContextHelp(helpkey);

        if (contextHelp && contextHelp.section) {
            let sectionSlug = contextHelp.section.replace(/\s+/, "-").toLowerCase();
            return `#${sectionSlug}`;
        }

        return "";
    }

    getHelpLink(helpkey) {
        const url = `${config.helpRoot}/${this.locale}/`;
        const contextHelp = this.getContextHelp(helpkey);
        const sectionFragment = this.getSectionFragment(helpkey);

        if (contextHelp && contextHelp.page) {
            return url + contextHelp.page + sectionFragment;
        }

        return url + this.getFallbackPage();
    }

    getHelpTitle(helpkey) {
        const contextHelp = this.getContextHelp(helpkey);
        if (contextHelp && contextHelp.title) {
            return contextHelp.title;
        }

        return  undefined;
    }

    getHelpText(helpkey) {
        const contextHelp = this.getContextHelp(helpkey);
        if (contextHelp && contextHelp.text) {
            return contextHelp.text;
        }

        return  undefined;
    }
}
