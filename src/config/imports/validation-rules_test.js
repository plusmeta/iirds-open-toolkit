export default [
    {
        id: "M1",

        path: "InformationUnit",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-package-and-container:~:text=iiRDS%20Generators%20MUST%20NOT%20use%20the%20iirds%3AInformationUnit%20class%20directly%20but%20MUST%20use%20one%20of%20the%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS-Generatoren DÜRFEN die Klasse iirds:InformationUnit NICHT direkt verwenden, sondern MÜSSEN eine der Unterklassen verwenden",
            "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M1_false.rdf"]
        }
        /*COMMENTS

        */
    },
    {
        id: "M3.1",
        path: "Package",
        findInvalidElements: els => els.slice(1),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=Each%20iiRDS%20package%20MUST%20have%20exactly%20one%20corresponding%20iirds%3APackage%20instance%20in%20the%20metadata.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Jedes iiRDS-Paket MUSS genau eine entsprechende iirds:Package-Instanz in den Metadaten haben.",
            "en": "Each iiRDS package MUST have exactly one corresponding iirds:Package instance in the metadata."
        },
        info: {
            "de": " ",
            "en": "More than one iirds:Package instance found."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M3.1_false.rdf"]
        }
    },
];
