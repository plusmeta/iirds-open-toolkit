/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import { UnitConverter } from "@/util/unit-converter";

export default {
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
        return `${title} - ${org}`;
    },
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
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
    isIE() {
        return navigator.userAgent.includes("MSIE") || navigator.appVersion.includes("Trident/");
    },
    async getDocument(url) {
        const pdfjs = await import(/* webpackChunkName: 'pdfjs-dist' */ "pdfjs-dist/webpack");
        return await pdfjs.getDocument(url).promise;
    },
    getMetadata(object, uri) {
        return object?.meta?.[uri];
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
    }
};
