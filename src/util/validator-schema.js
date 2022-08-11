import validations from "@/config/imports/validation-rules";

export default {
    validateDocument(document, scope, filename) {
        let validationMessages = [];
        let scopedTests = validations.filter(v => !!v.assert);
        for (let test of scopedTests) {
            let result = document.querySelectorAll(test.path);
            let assertion = result.length && test.assert(Array.from(result));
            if (!assertion) validationMessages.push(`${filename}: ${test.rule.de}`);
        }
        let validationResult = !validationMessages.length;
        return [validationResult, validationMessages];
    }
};
