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

                const expectSymbol = expectation.substr(0,1).toUpperCase() + idx;
                const testText = iirdsRule.rule.en.substr(0, 45) + "...";

                it(`[${iirdsRule.id}][${expectSymbol}] ${testText}`, () => {
                    const xmlContent = readFileSync(filePath, "utf8");
                    const parser = new DOMParser();
                    rdfDoc = parser.parseFromString(xmlContent, "application/xml");
                    const { succeeded, invalidElements } = iirdsValidateXmlRule(rdfDoc, iirdsRule);

                    if (expectation === "true" ) {
                        expect(invalidElements).to.be.empty;
                        expect(succeeded).to.be.true;
                    } else {
                        expect(invalidElements).not.to.be.empty;
                        expect(succeeded).to.be.false;
                    }
                });
            }
        }
    }
});
