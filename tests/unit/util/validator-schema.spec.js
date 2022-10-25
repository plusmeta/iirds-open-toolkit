/*
 * plusmeta app
 * (c) 2022 plusmeta GmbH
 */

import { expect } from "chai";

import validations from "@/config/imports/schema-rules";
import { validateSingleRule } from "@/util/validator-schema.js";
import { readFileSync } from "fs";

let rdfDoc;

describe("validate iiRDS schema", () => {
    for (let validation of validations) {
        for (let [expectation, filePathList] of Object.entries(validation?.testFiles ?? [])) {
            for (let [idx, filePath] of filePathList.entries()) {
                const expectSymbol = expectation.substr(0,1).toUpperCase() + idx;
                const testText = validation.rule.en.substr(0, 45) + "...";

                it(`[${validation.id}][${expectSymbol}] ${testText}`, () => {
                    const xmlContent = readFileSync(filePath, "utf8");
                    const parser = new DOMParser();
                    rdfDoc = parser.parseFromString(xmlContent, "application/xml");
                    const { succeeded, invalidElements } = validateSingleRule(rdfDoc, validation);

                    if (expectation === "true" ) {
                        expect(succeeded).to.be.true;
                        expect(invalidElements).to.be.empty;
                    } else {
                        expect(succeeded).to.be.false;
                        expect(invalidElements).not.to.be.empty;
                    }
                });
            }
        }
    }
});
