

export default {
    fIsCorrect(expression, text) {
        return v => (!v || expression) || text;
    },
    fTestRegex(pattern, text) {
        return v => (!v || pattern.test(v)) || text;
    },
    fLengthEquals(val, text) {
        return v => (!v || v.length === val) || text;
    },
    fMaxLength(val = Infinity, textFunc = v => v) {
        return v => (!v || String(v).length <= val) || textFunc(val);
    },
    fMaxLengthRelValue(val = Infinity, textFunc = v => v) {
        return v => (!v || !v.value || v.value.length <= val) || textFunc(val);
    },
    fNotEmpty(text) {
        return v => (v !== null && v !== undefined && v !== "") || text;
    },
    fMinLength(val, text) {
        return v => (!v || (v)?.length >= val) || text;
    },
    fIsEmail(text) {
        const mailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return v => (!v || mailPattern.test(v)) || text;
    },
    fIsURL(text) {
        function isURL(str) {
            let url;

            try {
                url = new URL(str);
            } catch (_) {
                return false;
            }

            return url.protocol === "http:" || url.protocol === "https:";
        }
        return v => (!v || isURL(v)) || text;
    }
};
