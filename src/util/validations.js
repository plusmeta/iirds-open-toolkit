export default {
    fMaxLengthRelValue(val = Infinity, textFunc = v => v) {
        return v => (!v || !v.value || v.value.length <= val) || textFunc(val);
    },
    fNotEmpty(text) {
        return v => (v !== null && v !== undefined && v !== "") || text;
    },
    fIsURL(text) {
        function isURL(str) {
            let url;

            try {
                url = new URL(str);
            } catch (_) {
                return false;
            }

            if (url.protocol !== "http:" && url.protocol !== "https:") {
                return false;
            }

            const hostname = url.hostname;

            if (hostname === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
                return true;
            }

            return hostname.includes(".") && hostname.length > 3;
        }

        return v => (!v || isURL(v)) || text;
    },
    fAtLeastOneOf(getFields, text) {
        return (v) => {
            const fields = typeof getFields === "function" ? getFields() : getFields;
            const hasValue = fields.some(field =>
                field !== null && field !== undefined && field !== ""
            );
            return hasValue || text;
        };
    }
};
