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

export function iirdsValidateXmlRule(rdfDoc, iirdsRule) {
    let result = rdfDoc.documentElement.querySelectorAll(iirdsRule.path);
    return iirdsRule.assert(Array.from(result));
}

export function iirdsValidateXmlContent(xmlContent) {
    const parser = new DOMParser();
    const rdfDoc = parser.parseFromString(xmlContent, "application/xml");

    let validationMessages = [];

    validations.forEach((iirdsRule) => {
        let assertion = iirdsValidateXmlRule(rdfDoc, iirdsRule);
        if (!assertion) validationMessages.push(iirdsRule.rule?.en);
    });

    return validationMessages;
}

export const IIRDS_RULES = validations;

