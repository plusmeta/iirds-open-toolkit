import JSzip from "jszip";
import util from "@/util";

import containerValidations from "@/config/imports/container-rules";
import systemValidations from "@/config/imports/system-rules";

export default {
    async validate(objectData, scope, fileName) {
        const containerViolations = [];
        const type = "Container";

        let zipArchive;
        let arrayBuffer;

        try {
            arrayBuffer = await util.readFile(objectData);
            zipArchive = await JSzip.loadAsync(arrayBuffer);
        } catch (error) {
            containerViolations.push(systemValidations["S1"]);
            return {containerViolations, zipArchive};
        }

        const scopedTests = containerValidations.filter(v => !scope || scope === v.scope);
        for (let test of scopedTests) {
            const pass = await test.assert(zipArchive, objectData, arrayBuffer);
            if (!pass) {
                const file = (test.getInvalid) ? test.getInvalid(zipArchive) : [];
                containerViolations.push({ ...test, file, type, fileName, scope });
                // abort early if recovery is not possible
                if (test.break) break;
            }
        }
        return {containerViolations, zipArchive};
    }
};
