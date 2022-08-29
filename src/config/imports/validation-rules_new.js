export default [
    {
        id: "r001",
        path: "InformationUnit",
        assert: els => els,
        section: "6.2 Information Units",
        link: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#properties-and-relations-overview:~:text=iiRDS%20Generators%20MUST%20NOT%20use%20the%20iirds%3AInformationUnit%20class%20directly%20but%20MUST%20use%20one%20of%20the%20subclasses.",
        prio: "MUST",
        version: ["1.0", "1.1"],
        rule: {
            "de": "iiRDS-Ersteller DÜRFEN NICHT die Klasse iirds:InformationUnit direkt verwenden, sondern MÜSSEN eine der Unterklassen benutzen",
            "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_informationUnit.rdf"]
        }
    },
    {
        id: "r002",
        path: "Document, Topic, Fragment, Package",
        assert: els => els.every(el => (el.childElementCount !== 0 && el.hasAttribute("rdf:about"))),
        section: "6.2 Information Units",
        link: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#properties-and-relations-overview:~:text=An%20instance%20of%20an%20iirds%3AInformationUnit%20subclass%20MUST%20have%20an%20IRI%20and%20MUST%20NOT%20be%20a%20blank%20node.",
        prio: "MUST",
        version: ["1.0", "1.1"],
        rule: {
            "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse MUSS einen IRI haben und DARF KEIN leerer Knoten sein.",
            "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI and MUST NOT be a blank node."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
    },
    {
        id: "r003",
        path: "Package",
        assert: els => els.length === 1,
        section: "6.2.1 Subclasses of iirds:InformationUnit",
        link: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#properties-and-relations-overview:~:text=Each%20iiRDS%20package%20MUST%20have%20exactly%20one%20corresponding%20iirds%3APackage%20instance%20in%20the%20metadata.",
        prio: "MUST",
        version: ["1.0", "1.1"],
        rule: {
            "de": "Jedes iiRDS-Paket MUSS genau eine entsprechende iirds:Paket-Instanz in den Metadaten haben.",
            "en": "Each iiRDS package MUST have exactly one corresponding iirds:Package instance in the metadata."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
    },
    {
        id: "r004",
        path: "Rendition",
        assert: els => els.every(el => el.querySelector("source")),
        section: "6.3 Content References of Information Units",
        link: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#relations-1:~:text=To%20identify%20the%20physical%20file%2C%20the%20property%20iirds%3Asource%20MUST%20relate%20the%20rendition%20to%20the%20URL%20of%20the%20physical%20file.",
        prio: "MUST",
        version: ["1.0", "1.1"],
        rule: {
            "de": "",
            "en": "An iirds:Rendition MUST have the property iirds:source."
        },
        testFiles:{
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
    },
    {
        id: "r005",
        path: "Rendition",
        assert: els => els.every(el => el.querySelector("format")),
        section: "6.3 Content References of Information Units",
        link: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#relations-1:~:text=An%20iirds%3ARendition%20MUST%20also%20have%20the%20property%20iirds%3Aformat.",
        prio: "MUST",
        version: ["1.0", "1.1"],
        rule: {
            "de": "",
            "en": "An iirds:Rendition MUST have the property iirds:format."
        },
        testFiles:{
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
    },
    {
        id: "r006",
        path: "Package",
        assert: "",
        section: "6.3 Content References of Information Units",
        link: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#relations-1:~:text=iirds%3APackage%20elements%20representing%20the%20enclosing%20iiRDS%20package%20itself%20MUST%20NOT%20be%20subjects%20of%20any%20iirds%3Ahas%2Drendition%20relation.",
        prio: "MUST",
        version: ["1.1"],
        rule: {
            "de": "",
            "en": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation."
        },
        testFiles:{
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
    },
];