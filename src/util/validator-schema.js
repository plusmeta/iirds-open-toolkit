import validations from "@/config/imports/validation-rules";
import { v4 as uuid } from "uuid";

const Serializer = new XMLSerializer();
const Parser = new DOMParser();

const validationIdAttr = "iirds:validation";
const documentMimeType = "application/xml";


export default {
    validateDocument(documentString, scope, fileName) {
        const violations = [];

        const { processedString, lineMap, lineArr } = this.preprocessDocumentString(documentString);
        const document = Parser.parseFromString(processedString, documentMimeType);

        const scopedTests = validations.filter(v => !scope || scope === v.scope);
        for (let test of scopedTests) {
            const selection = document.querySelectorAll(test.path);
            const result = test.assert(Array.from(selection));
            const pass = !selection.length || !result.length;
            if (!pass) {
                for (let element of result) {
                    const { location, lineNr, lines } = this.getLocation(element, lineMap, lineArr);
                    violations.push({ ...test, fileName, scope, location, lineNr, lines });
                }
            }
        }
        return violations;
    },
    preprocessDocumentString(documentString) {
        const lineArr = documentString.split("\n");
        const lineMap = {};

        const processedString = lineArr.map((line, i) => {
            return line.replace(/(<\w+:(?!RDF)[\w\-]+)([\s>])/g,
                (match, p1, p2) => {
                    const validationId = uuid();
                    lineMap[validationId] = i + 1;
                    return `${p1} ${validationIdAttr}="${validationId}"${p2}`;
                });
        }).join("\n");

        return { processedString, lineMap, lineArr };
    },
    getLocation(element, lineMap, lineArr) {
        const validationId = element.getAttribute(validationIdAttr);
        const lineNr = lineMap[validationId];
        const lines = lineArr.slice(Math.max(0, lineNr - 4), Math.min(lineArr.length, lineNr + 3));

        const validationIdRexExp = `${validationIdAttr}="[\\w\\-\\/\\.#\\d:]+"\\s?`;
        let xmlTxt = Serializer.serializeToString(element);

        xmlTxt = xmlTxt.replace(/xmlns:\w{2,5}="[\w\-\/\.#\d:]+"\s?/g, "");
        xmlTxt = xmlTxt.replace(new RegExp(validationIdRexExp, "g"), "");

        return { location: xmlTxt, lineNr, lines: lines.join("\n") };
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

