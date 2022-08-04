export class UnitConverter {

    static byteToDisplayText({ $i18n }, value = null, defaultString = "--", outputUnits = ["kilobyte", "megabyte", "gigabyte"], threshold = 1000) {
        if (isNaN(value) || value === null) {
            return defaultString;
        }
        let unitValue = value;
        let unit;
        for (const outputUnit of outputUnits) {
            unitValue = unitValue / 1000;
            if (unitValue < threshold) {
                unit = outputUnit;
                break;
            }
        }

        return $i18n.n(unitValue, { style: "unit", unit: unit, maximumFractionDigits: 1, minimumFractionDigits: 1 });
    }
}
