/*
 * plusmeta app
 * (c) 2022 plusmeta GmbH
 */

// Utilities
import { expect } from "chai";

import { iirdsValidateXmlRule, IIRDS_RULES } from "@/util/validator-schema.js";
import { readFileSync } from "fs";

let rdfDoc;

describe("validate iirds xml", () => {
    for (const iirdsRule of IIRDS_RULES) {
        for (const [expectation, filePathList] of Object.entries(iirdsRule?.testFiles ?? [])) {
            for (const [idx, filePath] of filePathList.entries()) {
                it(iirdsRule.rule.en.substr(0, 45) + `... - [${expectation.substr(0,1).toUpperCase()}][${idx}]`, () => {
                    const xmlContent = readFileSync(filePath, "utf8");
                    const parser = new DOMParser();
                    rdfDoc = parser.parseFromString(xmlContent, "application/xml");
                    let result = iirdsValidateXmlRule(rdfDoc, iirdsRule);
                    expect(result).to.be.eq(expectation === "true");
                });
            }
        }
    }
});
