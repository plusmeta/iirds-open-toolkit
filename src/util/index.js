/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import { UnitConverter } from "@/util/unit-converter";

export default {
    castString(str) {
        if (typeof str === "string") {
            if (!str.length) return undefined;
            const safeForJSON = /(^null$)|(^true$)|(^false$)|(^[\d\.e]+$)|(^\[.*\]$)|(^\{.*\}$)/;
            let safe = str.match(safeForJSON);
            if (!safe) return String(str);
            let complex = !!safe[5] || !!safe[6];
            if (complex) str = str.replace(/('(.+?)'(?=[,\s|\]|:])){1,}/g, "\"$2\"");
            try {
                let parsed = JSON.parse(str);
                return parsed;
            } catch (error) {
                return String(str);
            }
        } else if (!!str) {
            return String(str);
        } else {
            return undefined;
        }
    },
    waitForUI() {
        return new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    resolve(true);
                });
            });
        });
    },
    readFile(file, readAs = "buffer") {
        return new Promise((resolve, reject) => {
            let isBlob = file instanceof Blob;
            if (!isBlob) reject("not a Blob");
            let reader = new FileReader();
            reader.onload = () => { resolve(reader.result); };
            reader.onerror = reject;
            if (readAs === "text") reader.readAsText(file);
            if (readAs === "buffer") reader.readAsArrayBuffer(file);
            if (readAs === "bstring") reader.readAsBinaryString(file);
            if (readAs === "dataUrl") reader.readAsDataURL(file);
        });
    },
    sanitizeXML(string) {
        if (string && typeof string === "string" && string !== "") {
            return string.replace(/\&[a-z]+?;/g, " ").replace(/<\?xml[A-Z].*?\?>/g, "");
        } else return "";
    },
    openFile(fileData) {
        let fileObjectURL = window.URL.createObjectURL(fileData);
        this.openURI(fileObjectURL);
    },
    openURI(uri) {
        const newWindow = window.open();
        newWindow.location = uri;
    },
    downloadURL(url, filename) {
        let link = document.createElement("a");
        let name = filename ?? url.split("/").pop();

        link.download = name;
        link.href = `${document.location.origin}/${url}`;
        link.click();
        link.remove();
    },
    downloadBlob(blob, filename) {
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        let name = filename ?? blob.name;

        link.download = name;
        link.href = url;
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    },
    downloadJSON(obj, filename) {
        let json = JSON.stringify(obj, null, 4);
        let href = "data:text/json;charset=utf-8," + encodeURIComponent(json);
        let link = document.createElement("a");

        link.download = filename;
        link.href = href;
        link.click();
        link.remove();
    },
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    withoutArray(arr, without) {
        return arr.filter(x => !without.includes(x));
    },
    unionArray(arr1, arr2) {
        return this.uniqueValues([...arr1, ...arr2]);
    },
    createTitle(title = "⌛", org = "plusmeta") {
        let browserTitle = `${title} - ${org}`;
        return browserTitle;
    },
    selectInputText(event, text) {
        if (text && text.length) {
            event.target.setSelectionRange(0, text.length);
        }
    },
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
    },
    getDateTime(timestamp, locale) {
        if (timestamp) {
            const date = new Date(timestamp);
            const options = {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short"
            };
            return date.toLocaleDateString(locale,  options);
        } else {
            return "";
        }
    },
    getFormatedDate(timestamp, locale) {
        if (timestamp) {
            const date = new Date(timestamp);
            const options = {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            };
            return date.toLocaleDateString(locale,  options);
        } else {
            return "";
        }
    },
    uniqueValues(array) {
        return Array.from(new Set(array));
    },
    uniqueProperties(propArray) {
        return propArray.reduce((unique, entry)  => {
            if (!unique.find(u => entry.identifier === u.identifier)) {
                unique.push(entry);
            }
            return unique;
        }, []);
    },
    compareMetadata(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            return [...a].sort().toString() === [...b].sort().toString();
        } else {
            return a === b;
        }

    },
    getOS() {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
        const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
        const iosPlatforms = ["iPhone", "iPad", "iPod"];

        let os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = "Mac";
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = "iOS";
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = "Windows";
        } else if (/Android/.test(userAgent)) {
            os = "Android";
        } else if (!os && /Linux/.test(platform)) {
            os = "Linux";
        }

        return os;
    },
    isIE() {
        return navigator.userAgent.includes("MSIE") || navigator.appVersion.includes("Trident/");
    },
    parseBoolean(value) {
        const truthy = [true, "true", "yes", "on", "1"];
        const falsy = [false, "false", "no", "none", "off", "0", "-1", 0, -1];
        if (typeof value === "boolean") {
            return value;
        } else {
            if (truthy.includes(value)) {
                return true;
            } else if (falsy.includes(value)) {
                return false;
            } else {
                return undefined;
            }
        }
    },
    copyToClipboard(text) {
        navigator.clipboard.writeText(text);
    },
    async getDocument(url) {
        const pdfjs = await import(/* webpackChunkName: 'pdfjs-dist' */ "pdfjs-dist/webpack");
        return await pdfjs.getDocument(url).promise;
    },
    getMetadata(object, uri) {
        return object?.meta?.[uri];
    },
    hasMetadatum(object, uri) {
        return !!this.getMetadata(object, uri);
    },
    getMetadataValue(object, uri) {
        return this.getMetadata(object, uri)?.value ?? null;
    },
    getMetadataValueAsArray(object, uri) {
        let v = this.getMetadataValue(object, uri);
        if (!v) return [];
        return Array.isArray(v) ? v : [v];
    },
    getOrderedMetaValues(objectUuid, uris, $store, attr) {
        let i = 99;
        let uniqueValues = uris.reduce((prev, uri) => {
            const idx = $store.getters["properties/getPropertyAttributeById"](uri, attr) || i++;
            let value = $store.getters["storage/getSanitizedMetaValueByURI"](objectUuid, uri);
            prev[idx] = value || prev[idx];
            return prev;
        }, {});

        return Array.from(new Set(Object.values(uniqueValues)))
            .filter(Boolean)
            .filter(val => typeof val === "string" && val.length > 1);
    },
    getOrderedMetaValuesByObject(object, uris, $store) {
        let i = 99;
        let uniqueValues = uris.reduce((prev, uri) => {
            const idx = $store.getters["properties/getPropertyAttributeById"](uri, "plus:objectNamePriority") || i++;
            // Direkter Zugriff auf Object, statt über store
            let value = this.getMetadataValue(object, uri);
            value = (Array.isArray(value)) ? value[0] : value;
            prev[idx] = value || prev[idx];
            return prev;
        }, {});

        return Array.from(new Set(Object.values(uniqueValues)))
            .filter(Boolean)
            .filter(val => typeof val === "string" && val.length > 1);
    },
    getSourceName(obj) {
        return (obj?.source) ? obj?.source?.name : obj?.name;
    },
    getSourceType(obj) {
        return (obj?.source) ? obj.source?.type : obj.type;
    },
    getSourceSize(obj, { $i18n }) {
        return UnitConverter.byteToDisplayText({ $i18n }, obj?.source?.size);
    },
};
