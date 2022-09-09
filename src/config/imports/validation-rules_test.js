export default [
    {
        id: "M13",
        path: "Rendition has-selector",
        findInvalidElements: els => els.filter(el => el.querySelector("Selector")),
        prio: "MUST NOT",
        category: "not intended to be used directly",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#x-conformance:~:text=iirds%3ARendition%20MUST%20NOT,an%20end%20identifier",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Rendition DARF NICHT direkt iirds:Selector verwenden, sondern MUSS eine seiner Unterklassen verwenden, um Teile einer Datei zu referenzieren. Die Klasse iirds:Selector hat die folgenden Unterklassen: iirds:FragmentSelector;  iirds:RangeSelector",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M13_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M13_false.rdf"]
        }
    }
];
