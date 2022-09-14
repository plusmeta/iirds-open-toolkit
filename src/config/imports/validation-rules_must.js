const ABSOLUTE_IRI_REGEX = /(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/;
const iri_absolute_regex = /'^(?:[a-z]+:)?\/\/'/;
const iri_with_https = /^http[s]?\:\/\//;
const iri_with_www = /www\..*?\..*?\//;
const iri_with_uuid = /urn\:uuid\:[a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}/;
const mustNotBeABlankNode = el => el.childElementCount === 0;
const mustHaveChild = child => el => el.querySelectorAll(child).length === 1;
const mustNotHaveChild = child => el => el.querySelectorAll(child).length === 0;
const mustNotHaveMoreThanOneChild = child => el => Array.from(el.querySelectorAll(child)).slice(1);
const includesAll = (small, big) => small.every(n => big.indexOf(n) !== -1);

export default [
    {
        id: "M1",
        path: "InformationUnit",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "not intended to be used directly",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-package-and-container:~:text=iiRDS%20Generators%20MUST%20NOT%20use%20the%20iirds%3AInformationUnit%20class%20directly%20but%20MUST%20use%20one%20of%20the%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS-Generatoren DÜRFEN die Klasse iirds:InformationUnit NICHT direkt verwenden, sondern MÜSSEN eine der Unterklassen verwenden",
            "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
        },
        info: {
            "de": "iiRDS-Generatoren DÜRFEN die Klasse iirds:InformationUnit NICHT direkt verwenden, sondern MÜSSEN eine der Unterklassen verwenden",
            "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M1_false.rdf"]
        }
    },
    {
        id: "M2.1",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.filter(el => !el.hasAttribute("rdf:about")),
        prio: "MUST",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=An%20instance%20of%20an%20iirds%3AInformationUnit%20subclass%20MUST%20have%20an%20IRI%20and%20MUST%20NOT%20be%20a%20blank%20node.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse MUSS einen IRI haben und darf KEIN leerer Knoten sein.",
            "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI and MUST NOT be a blank node."
        },
        info: {
            "de": " ",
            "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.1_false.rdf"]
        }
    },
    {
        id: "M2.2",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.filter(el => el.childElementCount === 0),
        prio: "MUST",
        category: "must not be a blank node",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=An%20instance%20of%20an%20iirds%3AInformationUnit%20subclass%20MUST%20have%20an%20IRI%20and%20MUST%20NOT%20be%20a%20blank%20node.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse MUSS einen IRI haben und darf KEIN leerer Knoten sein.",
            "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI and MUST NOT be a blank node."
        },
        info: {
            "de": " ",
            "en": "An instance of an iirds:InformationUnit subclass MUST NOT be a blank node."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.2_false.rdf"]
        }
    },
    {
        id: "M2.3",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("dateOfCreation"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        Spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3AdateOfCreation%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:dateOfCreation property - http://www.w3.org/2001/XMLSchema#dateTimeStamp"
        },
        info: {
            "de": " ",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:dateOfCreation."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.3_false.rdf"]
        }
    },
    {
        id: "M2.4",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("dateOfLastModification"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        Spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3AdateOfLastModification%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:dateOfLastModification property - http://www.w3.org/2001/XMLSchema#dateTimeStamp"
        },
        info: {
            "de": " ",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:dateOfLastModification."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_-M2.4_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.4_false.rdf"]
        }
    },
    {
        id: "M2.5",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("revision"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        Spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Arevision%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:revision property - http://www.w3.org/2000/01/rdf-schema#Literal"
        },
        info: {
            "de": " ",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:revision."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.5_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.5_false.rdf"]
        }
    },
    {
        id: "M2.6",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("title"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        Spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Atitle%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:title property - http://www.w3.org/2000/01/rdf-schema#Literal"
        },
        info: {
            "de": " ",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:title."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.6_false.rdf"]
        }
    },
    {
        id: "M2.7",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("has-abstract"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        Spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Ahas%2Dabstract%20property",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:has-abstract property"
        },
        info: {
            "de": " ",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:has-abstract."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.7_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.7_false.rdf"]
        }
    },
    {
        id: "M2.8",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("is-replacement-of "),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        Spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Ais%2Dreplacement%2Dof%20property%20%2D%20iirds%3AInformationUnit",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 	0..1  iirds:is-replacement-of property - iirds:InformationUnit"
        },
        info: {
            "de": " ",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:is-replacement-of ."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.8_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.8_false.rdf"]
        }
    },
    {
        id: "M2.9",
        path: "Document, Topic, Fragment, Package",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("is-version-of "),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        Spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Ais%2Dversion%2Dof%20property%20%2D%20iirds%3AInformationObject",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 	0..1  iirds:is-version-of property - iirds:InformationObject"
        },
        info: {
            "de": " ",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:is-version-of ."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.9_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.9_false.rdf"]
        }
    },
    {
        id: "M3.1",
        path: "Package",
        findInvalidElements: els => els.slice(1),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=Each%20iiRDS%20package%20MUST%20have%20exactly%20one%20corresponding%20iirds%3APackage%20instance%20in%20the%20metadata.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        category: "cardinality 1",
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
    {
        id: "M3.2",
        path: "*",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=Each%20iiRDS%20package%20MUST%20have%20exactly%20one%20corresponding%20iirds%3APackage%20instance%20in%20the%20metadata.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        category: "cardinality 1",
        rule: {
            "de": "Jedes iiRDS-Paket MUSS genau eine entsprechende iirds:Package-Instanz in den Metadaten haben.",
            "en": "Each iiRDS package MUST have exactly one corresponding iirds:Package instance in the metadata."
        },
        info: {
            "de": " ",
            "en": "No iirds:Package instance found."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf.rdf"],
            "false": ["./tests/files/util/iirds-validation/mmetadata_iirds_sample-M3.2_false.rdf"]
        }
    },
    {
        id: "M4",
        path: "Package",
        findInvalidElements: els => els.filter(el => !el.querySelector("iiRDSVersion")),
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=0..1-,iirds%3APackage,1,-iirds%3AParty",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS:Package MUSS die Eigenschaft iirds:iiRDSVersion verwenden",
            "en": "iiRDS:Package MUST use property iirds:iiRDSVersion"
        },
        info: {
            "de": "iiRDS:Package MUSS die Eigenschaft iirds:iiRDSVersion verwenden",
            "en": "iiRDS:Package MUST use property iirds:iiRDSVersion"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M4_false.rdf"]
        }

    },
    {
        id: "M5",
        path: "Package",
        findInvalidElements: els => els.filter(el => el.querySelectorAll("is-part-of-package")),
        prio: "MUST NOT",
        category: "must not use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20corresponding%20iirds%3APackage%20instance%20of%20an%20iiRDS%20package%20MUST%20NOT%20be%20a%20member%20of%20another%20iiRDS%20package%20expressed%20by%20the%20property%20iirds%3Ais%2Dpart%2Dof%2Dpackage.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die entsprechende iirds:Package-Instanz eines iiRDS-Pakets DARF NICHT Mitglied eines anderen iiRDS-Pakets sein, das durch die Eigenschaft iirds:is-part-of-package ausgedrückt wird.",
            "en": "The corresponding iirds:Package instance of an iiRDS package MUST NOT be a member of another iiRDS package expressed by the property iirds:is-part-of-package."
        },
        info: {
            "de": "Die entsprechende iirds:Package-Instanz eines iiRDS-Pakets DARF NICHT Mitglied eines anderen iiRDS-Pakets sein, das durch die Eigenschaft iirds:is-part-of-package ausgedrückt wird.",
            "en": "The corresponding iirds:Package instance of an iiRDS package MUST NOT be a member of another iiRDS package expressed by the property iirds:is-part-of-package."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M5_false.rdf"]
        }
    },
    {
        id: "M6",
        path: "*",
        findInvalidElements: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => [!iri_with_www, !iri_with_uuid, !iri_with_https].every(regx => regx.test(el.getAttribute("rdf:about")))),
        prio: "RECOMMENDED",
        category: "absolute IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20is%20RECOMMENDED%20to%20use%20absolute%20IRIs%20in%20rdf%3Aabout.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es wird EMPFOHLEN absolute IRIs in rdf:about zu verwenden.",
            "en": "It is RECOMMENDED to use absolute IRIs in rdf:about."
        },
        info: {
            "de": "Es wird EMPFOHLEN absolute IRIs in rdf:about zu verwenden.",
            "en": "It is RECOMMENDED to use absolute IRIs in rdf:about."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M6_false.rdf"]
        }
    },
    {
        id: "M7",
        path: "RDF",
        findInvalidElements: () => {
            // TODO: Regel hat Lauftzeitkomplexität
            const versions = Array.from(document.querySelectorAll(
                "Document, Topic, Fragment, Package")).map(el => el.querySelector(
                "is-version-of").getAttribute("rdf:resource"));
            const ios = Array.from(document.querySelectorAll("InformationObject")).map(el => el
                .getAttribute("rdf:about"));
            return includesAll(versions, ios);
        },
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=If%20information%20objects%20are%20used%2C%20each%20information%20unit%20MUST%20only%20be%20related%20to%20exactly%20one%20information%20object%20via%20iirds%3Ais%2Dversion%2Dof.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Wenn Informationsobjekte verwendet werden, DARF jede Informationseinheit nur auf genau ein Informationsobjekt über iirds:is-version-of bezogen werden.",
            "en": "If information objects are used, each information unit MUST only be related to exactly one information object via iirds:is-version-of."
        },
        info: {
            "de": "Wenn Informationsobjekte verwendet werden, DARF jede Informationseinheit nur auf genau ein Informationsobjekt über iirds:is-version-of bezogen werden.",
            "en": "If information objects are used, each information unit MUST only be related to exactly one information object via iirds:is-version-of."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants-M7_false.rdf"]
        }
    },

    {
        id: "M8.1",
        path: "InformationObject",
        findInvalidElements: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => [!iri_with_www, !iri_with_uuid, !iri_with_https].every(regx => regx.test(el.getAttribute("rdf:about")))),
        prio: "MUST",
        category: "absolute IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20information%20object%20MUST%20have%20an%20absolute%20IRI%20and%20MAY%20be%20related%20to%20additional%20identifications%20via%20the%20iirds%3Ahas%2Didentity%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein Informationsobjekt MUSS einen absoluten IRI haben und DARF über die Eigenschaft iirds:has-identity mit zusätzlichen Identifikationen verbunden sein.",
            "en": "An information object MUST have an absolute IRI and MAY be related to additional identifications via the iirds:has-identity property."
        },
        info: {
            "de": " ",
            "en": "An information object MUST have an absolute IRI."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants-M8.1_false.rdf"]
        }
    },
    {
        id: "M8.2",
        path: "InformationObject",
        prio: "MAY",
        category: "may use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20information%20object%20MUST%20have%20an%20absolute%20IRI%20and%20MAY%20be%20related%20to%20additional%20identifications%20via%20the%20iirds%3Ahas%2Didentity%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein Informationsobjekt MUSS einen absoluten IRI haben und DARF über die Eigenschaft iirds:has-identity mit zusätzlichen Identifikationen verbunden sein.",
            "en": "An information object MUST have an absolute IRI and MAY be related to additional identifications via the iirds:has-identity property."
        },
        info: {
            "de": " ",
            "en": "An information object MAY be related to additional identifications via the iirds:has-identity property."
        },
    },
    {
        id: "M9",
        path: "Package",
        findInvalidElements: els => els.filter(el => el.querySelectorAll("has-rendition")),
        prio: "MUST NOT",
        category: "must not use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iirds%3APackage%20elements%20representing%20the%20enclosing%20iiRDS%20package%20itself%20MUST%20NOT%20be%20subjects%20of%20any%20iirds%3Ahas%2Drendition%20relation.",
        version: ["V1.1"],
        rule: {
            "de": "iirds:Package-Elemente, die das umschließende iiRDS-Paket selbst darstellen, DÜRFEN NICHT Gegenstand einer iirds:has-rendition-Beziehung sein.",
            "en": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation."
        },
        info: {
            "de": "iirds:Package-Elemente, die das umschließende iiRDS-Paket selbst darstellen, DÜRFEN NICHT Gegenstand einer iirds:has-rendition-Beziehung sein.",
            "en": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M9_false.rdf"]
        }

    },
    {
        id: "M10",
        path: "Rendition source",
        findInvalidElements: els => els.every(el => !ABSOLUTE_IRI_REGEX.test(el.textContent)),
        prio: "MUST",
        category: "relative IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20URL%20MUST%20be%20relative%20to%20the%20root%20folder%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die URL MUSS relativ zum Stammordner des iiRDS-Pakets sein",
            "en": "The URL MUST be relative to the root folder of the iiRDS package"
        },
        info: {
            "de": "Die URL MUSS relativ zum Stammordner des iiRDS-Pakets sein",
            "en": "The URL MUST be relative to the root folder of the iiRDS package"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M10_false.rdf"]
        }
    },
    {
        id: "M11",
        path: "Rendition",
        findInvalidElements: els => els.filter(el => !el.querySelector("source")),
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#properties-and-relations-overview:~:text=1-,iirds%3ARendition,1,-iirds%3ARendition",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:source haben.",
            "en": "An iirds:Rendition MUST have the property iirds:source."
        },
        info: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:source haben.",
            "en": "An iirds:Rendition MUST have the property iirds:source."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M11_false.rdf"]
        }
    },
    {
        id: "M12",
        path: "Rendition",
        findInvalidElements: els => els.filter(el => el.querySelector("format")),
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3ARendition%20MUST%20also%20have%20the%20property%20iirds%3Aformat.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:format haben.",
            "en": "An iirds:Rendition MUST have the property iirds:format."
        },
        info: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:format haben.",
            "en": "An iirds:Rendition MUST have the property iirds:format."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M12_false.rdf"]
        }
    },
    {
        id: "M13",
        path: "Rendition has-selector",
        findInvalidElements: els => els.filter(el => el.querySelectorAll("Selector")),
        prio: "MUST NOT",
        category: "not intended to be used directly",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#x-conformance:~:text=iirds%3ARendition%20MUST%20NOT,an%20end%20identifier",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Rendition DARF NICHT direkt iirds:Selector verwenden, sondern MUSS eine seiner Unterklassen verwenden, um Teile einer Datei zu referenzieren. Die Klasse iirds:Selector hat die folgenden Unterklassen: iirds:FragmentSelector;  iirds:RangeSelector",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        },
        info: {
            "de": "iirds:Rendition DARF NICHT direkt iirds:Selector verwenden, sondern MUSS eine seiner Unterklassen verwenden, um Teile einer Datei zu referenzieren. Die Klasse iirds:Selector hat die folgenden Unterklassen: iirds:FragmentSelector;  iirds:RangeSelector",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M13_false.rdf"]
        }
    },
    {
        id: "M14.1",
        path: "FragmentSelector, RangeSelector",
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20select%20parts,fragment%2Dselector%5D.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "To select parts of a file, an iirds:Selector MUST have an rdf:value and dcterms:conformsTo. The value MUST conform to the standard specified by the property dcterms:conformsTo. Only a standard from the following list of fragment selectors MUST be used: [https://www.w3.org/TR/annotation-model/#fragment-selector]."
        },
        info: {
            "de": " ",
            "en": "To select parts of a file, an iirds:Selector MUST have an rdf:value and dcterms:conformsTo."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M14.1_false.rdf"]
        }
    },
    {
        id: "M14.2",
        path: "FragmentSelector, RangeSelector",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20select%20parts,fragment%2Dselector%5D.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "To select parts of a file, an iirds:Selector MUST have an rdf:value and dcterms:conformsTo. The value MUST conform to the standard specified by the property dcterms:conformsTo. Only a standard from the following list of fragment selectors MUST be used: [https://www.w3.org/TR/annotation-model/#fragment-selector]."
        },
        info: {
            "de": " ",
            "en": "The value MUST conform to the standard specified by the property dcterms:conformsTo. Only a standard from the following list of fragment selectors MUST be used: [https://www.w3.org/TR/annotation-model/#fragment-selector]."
        },
    },
    {
        id: "M15.1",
        path: "RangeSelector",
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20iirds%3ARangeSelector%20points,end%2Dselector.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der iirds:RangeSelector zeigt durch einen Start- und einen Endselektor auf den Teil einer Datei. Die Bereichsauswahl MUSS verwendet werden, um einen Bereich in einer Datei zu identifizieren, wenn das Dateiformat oder der zugehörige Standard die direkte Auswahl eines Bereichs nicht zulässt. Der Bereichsselektor referenziert den Startselektor und den Endselektor durch die Eigenschaften iirds:has-start-selector und iirds:has-end-selector.",
            "en": "The iirds:RangeSelector points to the part of a file by a start and an end selector. The range selector MUST be used to identify a range in a file if the file format or the associated standard does not permit selecting a range directly. The range selector references the start selector and end selector by the properties iirds:has-start-selector and iirds:has-end-selector."
        },
        info: {
            "de": " ",
            "en": "iirds:RangeSelector must use property iirds:has-start-selector."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M15.1_false.rdf"]
        }
    },
    {
        id: "M15.2",
        path: "RangeSelector",
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20iirds%3ARangeSelector%20points,end%2Dselector.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der iirds:RangeSelector zeigt durch einen Start- und einen Endselektor auf den Teil einer Datei. Die Bereichsauswahl MUSS verwendet werden, um einen Bereich in einer Datei zu identifizieren, wenn das Dateiformat oder der zugehörige Standard die direkte Auswahl eines Bereichs nicht zulässt. Der Bereichsselektor referenziert den Startselektor und den Endselektor durch die Eigenschaften iirds:has-start-selector und iirds:has-end-selector.",
            "en": "The iirds:RangeSelector points to the part of a file by a start and an end selector. The range selector MUST be used to identify a range in a file if the file format or the associated standard does not permit selecting a range directly. The range selector references the start selector and end selector by the properties iirds:has-start-selector and iirds:has-end-selector."
        },
        info: {
            "de": " ",
            "en": "iirds:RangeSelector must use property iirds:has-end-selector."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M15.2_false.rdf"]
        }
    },
    {
        id: "M16",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=If%20a%20media%20file%20is%20not%20self%2Dcontained%2C%20then%20it%20MUST%20be%20modeled%20as%20iirds%3AFragment.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Wenn eine Mediendatei nicht in sich geschlossen ist, MUSS sie als iirds:Fragment modelliert werden.",
            "en": "If a media file is not self-contained, then it MUST be modeled as iirds:Fragment."
        },
        rule: {
            "de": "Wenn eine Mediendatei nicht in sich geschlossen ist, MUSS sie als iirds:Fragment modelliert werden.",
            "en": "If a media file is not self-contained, then it MUST be modeled as iirds:Fragment."
        },
    },
    {
        id: "M17.1",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=For%20each%20nested%20child%20iiRDS%20package%2C%20an%20iirds%3APackage%20MUST,iirds%3APackage%20in%20the%20metadata%20of%20the%20parent%20iiRDS%20package.",
        version: ["V1.1"],
        rule: {
            "de": "Für jedes verschachtelte untergeordnete iiRDS-Paket MUSS ein iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets vorhanden sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS im iiRDS-ZIP-Archiv des übergeordneten iiRDS-Pakets enthalten sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS durch eine iirds:Rendition seines iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets referenziert werden.",
            "en": "For each nested child iiRDS package, an iirds:Package MUST be present in the metadata of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be included in the iiRDS ZIP archive of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be referenced by an iirds:Rendition of its iirds:Package in the metadata of the parent iiRDS package."
        },
        info: {
            "de": " ",
            "en": "For each nested child iiRDS package, an iirds:Package MUST be present in the metadata of the parent iiRDS package."
        },
    },
    {
        id: "M17.2",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=For%20each%20nested%20child%20iiRDS%20package%2C%20an%20iirds%3APackage%20MUST,iirds%3APackage%20in%20the%20metadata%20of%20the%20parent%20iiRDS%20package.",
        version: ["V1.1"],
        rule: {
            "de": "Für jedes verschachtelte untergeordnete iiRDS-Paket MUSS ein iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets vorhanden sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS im iiRDS-ZIP-Archiv des übergeordneten iiRDS-Pakets enthalten sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS durch eine iirds:Rendition seines iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets referenziert werden.",
            "en": "For each nested child iiRDS package, an iirds:Package MUST be present in the metadata of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be included in the iiRDS ZIP archive of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be referenced by an iirds:Rendition of its iirds:Package in the metadata of the parent iiRDS package."
        },
        info: {
            "de": " ",
            "en": "The iiRDS ZIP archive of the nested package MUST be included in the iiRDS ZIP archive of the parent iiRDS package."
        },
    },
    {
        id: "M17.3",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=For%20each%20nested%20child%20iiRDS%20package%2C%20an%20iirds%3APackage%20MUST,iirds%3APackage%20in%20the%20metadata%20of%20the%20parent%20iiRDS%20package.",
        version: ["V1.1"],
        rule: {
            "de": "Für jedes verschachtelte untergeordnete iiRDS-Paket MUSS ein iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets vorhanden sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS im iiRDS-ZIP-Archiv des übergeordneten iiRDS-Pakets enthalten sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS durch eine iirds:Rendition seines iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets referenziert werden.",
            "en": "For each nested child iiRDS package, an iirds:Package MUST be present in the metadata of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be included in the iiRDS ZIP archive of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be referenced by an iirds:Rendition of its iirds:Package in the metadata of the parent iiRDS package."
        },
        info: {
            "de": " ",
            "en": "The iiRDS ZIP archive of the nested package MUST be referenced by an iirds:Rendition of its iirds:Package in the metadata of the parent iiRDS package."
        }
    },
    {
        id: "M18.1",
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20the%20metadata.rdf%20file%20of%20the%20parent%20iiRDS%20package%2C%20the,package%20MUST%20NOT%20have%20any%20outgoing%20iirds%3Ais%2Dpart%2Dof%2Dpackage%20relations.",
        version: ["V1.1"],
        rule: {
            "de": "In der Datei metadata.rdf des übergeordneten iiRDS-Pakets MUSS das iirds:Package des verschachtelten untergeordneten iiRDS-Pakets genau ein iirds:Package von iirds:is-part-of-package referenzieren. In der Datei metadata.rdf des übergeordneten iiRDS-Pakets DARF das referenzierte übergeordnete iiRDS-Paket KEINE ausgehenden iirds:is-part-of-package-Beziehungen haben.",
            "en": "In the metadata.rdf file of the parent iiRDS package, the iirds:Package of the nested child iiRDS package MUST reference exactly one iirds:Package by iirds:is-part-of-package. In the metadata.rdf file of the parent iiRDS package, the referenced parent iiRDS package MUST NOT have any outgoing iirds:is-part-of-package relations."
        },
        info: {
            "de": " ",
            "en": "In the metadata.rdf file of the parent iiRDS package, the iirds:Package of the nested child iiRDS package MUST reference exactly one iirds:Package by iirds:is-part-of-package."
        }
    },
    {
        id: "M18.2",
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20the%20metadata.rdf%20file%20of%20the%20parent%20iiRDS%20package%2C%20the,package%20MUST%20NOT%20have%20any%20outgoing%20iirds%3Ais%2Dpart%2Dof%2Dpackage%20relations.",
        version: ["V1.1"],
        rule: {
            "de": "In der Datei metadata.rdf des übergeordneten iiRDS-Pakets MUSS das iirds:Package des verschachtelten untergeordneten iiRDS-Pakets genau ein iirds:Package von iirds:is-part-of-package referenzieren. In der Datei metadata.rdf des übergeordneten iiRDS-Pakets DARF das referenzierte übergeordnete iiRDS-Paket KEINE ausgehenden iirds:is-part-of-package-Beziehungen haben.",
            "en": "In the metadata.rdf file of the parent iiRDS package, the iirds:Package of the nested child iiRDS package MUST reference exactly one iirds:Package by iirds:is-part-of-package. In the metadata.rdf file of the parent iiRDS package, the referenced parent iiRDS package MUST NOT have any outgoing iirds:is-part-of-package relations."
        },
        info: {
            "de": " ",
            "en": "In the metadata.rdf file of the parent iiRDS package, the referenced parent iiRDS package MUST NOT have any outgoing iirds:is-part-of-package relations."
        }
    },
    {
        id: "M19.1",
        path: "Document has-document-type",
        prio: "MUST",
        category: "cardinality 1..n",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3ADocument%20class%20MUST%20have%20one%20or%20more%20relations%20to%20one%20of%20the%20standardized%20iirds%3ADocumentTypes%20defined%20in%20iirds%3AInformationType%20%3E%20iirds%3ADocumentType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Document MÜSSEN eine oder mehrere Beziehungen zu einem der standardisierten iirds:DocumentTypes haben, die in iirds:InformationType > iirds:DocumentType definiert sind.",
            "en": "Instances of the iirds:Document class MUST have one or more relations to one of the standardized iirds:DocumentTypes defined in iirds:InformationType > iirds:DocumentType."
        },info: {
            "de": " ",
            "en": "Instances of the iirds:Document class MUST have one or more relations to one of the standardized iirds:DocumentTypes."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M19.1_false.rdf"]
        }
    },
    {
        id: "M19.2",
        path: "Document has-document-type",
        prio: "MUST",
        category: "specific values allowed",
        values: ["http://iirds.tekom.de/iirds#RepairInstructions", "http://iirds.tekom.de/iirds#BillOfMaterials", "http://iirds.tekom.de/iirds#AdministratorGuide", "http://iirds.tekom.de/iirds#AssemblyInstructions", "http://iirds.tekom.de/iirds#SafetyInstructions", "http://iirds.tekom.de/iirds#SalesCatalog", "http://iirds.tekom.de/iirds#Specification", "http://iirds.tekom.de/iirds#TechnicalDrawingDiagram", "http://iirds.tekom.de/iirds#QuickGuide", "http://iirds.tekom.de/iirds#Plan", "http://iirds.tekom.de/iirds#PartsCatalog", "http://iirds.tekom.de/iirds#OperatingInstructions", "http://iirds.tekom.de/iirds#MaintenanceInstructions", "http://iirds.tekom.de/iirds#InstallationInstructions", "http://iirds.tekom.de/iirds#IdentificationDocument", "http://iirds.tekom.de/iirds#ElectronicIdentificationPlate", "http://iirds.tekom.de/iirds#ContractualDocument", "http://iirds.tekom.de/iirds#Certificate", "http://iirds.tekom.de/iirds#TransportInstructions", "http://iirds.tekom.de/iirds#CEDeclarationOfConformity"],
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3ADocument%20class%20MUST%20have%20one%20or%20more%20relations%20to%20one%20of%20the%20standardized%20iirds%3ADocumentTypes%20defined%20in%20iirds%3AInformationType%20%3E%20iirds%3ADocumentType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Document MÜSSEN eine oder mehrere Beziehungen zu einem der standardisierten iirds:DocumentTypes haben, die in iirds:InformationType > iirds:DocumentType definiert sind.",
            "en": "Instances of the iirds:Document class MUST have one or more relations to one of the standardized iirds:DocumentTypes defined in iirds:InformationType > iirds:DocumentType."
        },
        info: {
            "de": " ",
            "en": "iirds:has-document-type MUST contain a standardized document type defined in iirds:InformationType > iirds:DocumentType."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M19.2_false.rdf"]
        }
    },
    {
        id: "M20",
        path: "Document",
        prio: "RECOMMENDED",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20is%20RECOMMENDED%20to%20create%20more%20than%20one%20relation%20to%20iirds%3ADocumentType%20for%20documents%20with%20mixed%20content.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es wird EMPFOHLEN, für Dokumente mit gemischtem Inhalt mehr als eine Relation zu iirds:DocumentType zu erstellen.",
            "en": "It is RECOMMENDED to create more than one relation to iirds:DocumentType for documents with mixed content."
        },

    },
    {
        id: "M21.1",
        path: "Event",
        findInvalidElements: els => els.filter(el => !el.querySelectorAll("has-event-code")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3AEvent%20class%20MUST%20have%20the%20following%20properties%3A%20iirds%3AeventCode%20and%20iirds%3AeventType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Event MÜSSEN die folgenden Eigenschaften haben: iirds:eventCode und iirds:eventType.",
            "en": "Instances of the iirds:Event class MUST have the following properties: iirds:eventCode and iirds:eventType. "
        },
        info: {
            "de": " ",
            "en": "Instances of the iirds:Event class MUST have property iirds:eventCode"
        }
    },
    {
        id: "M21.2",
        path: "Event",
        findInvalidElements: els => els.filter(el => !el.querySelectorAll("has-event-code")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3AEvent%20class%20MUST%20have%20the%20following%20properties%3A%20iirds%3AeventCode%20and%20iirds%3AeventType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Event MÜSSEN die folgenden Eigenschaften haben: iirds:eventCode und iirds:eventType.",
            "en": "Instances of the iirds:Event class MUST have the following properties: iirds:eventCode and iirds:eventType. "
        },
        info: {
            "de": " ",
            "en": "Instances of the iirds:Event class MUST have property iirds:eventType"
        }
    },
    {
        id: "M22",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20properties%20iirds%3Arelates%2Dto%2Dcomponent%20and%20iirds%3Arelates%2Dto%2Dproduct%2Dvariant%20relate%20an%20information%20unit%20to%20an%20instance%20of%20iirds%3AComponent%20or%20iirds%3AProductVariant.%20The%20instances%20MUST%20be%20part%20of%20a%20proprietary%20iiRDS%20extension.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Eigenschaften iirds:relates-to-component und iirds:relates-to-product-variant beziehen eine Informationseinheit auf eine Instanz von iirds:Component oder iirds:ProductVariant. Die Instanzen MÜSSEN Teil einer proprietären iiRDS-Erweiterung sein.",
            "en": "The properties iirds:relates-to-component and iirds:relates-to-product-variant relate an information unit to an instance of iirds:Component or iirds:ProductVariant. The instances MUST be part of a proprietary iiRDS extension."
        },
        info: {
            "de": "Die Eigenschaften iirds:relates-to-component und iirds:relates-to-product-variant beziehen eine Informationseinheit auf eine Instanz von iirds:Component oder iirds:ProductVariant. Die Instanzen MÜSSEN Teil einer proprietären iiRDS-Erweiterung sein.",
            "en": "The properties iirds:relates-to-component and iirds:relates-to-product-variant relate an information unit to an instance of iirds:Component or iirds:ProductVariant. The instances MUST be part of a proprietary iiRDS extension."
        }
    },
    {
        id: "M23",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iiRDS%20package%20MAY%20model%20a%20component%20tree.%20The%20property%20iirds%3Ahas%2Dcomponent%20defines%20part%2Dof%20relations%20for%20products%20and%20their%20components.%20The%20component%20tree%20is%20a%20proprietary%20iiRDS%20extension%2C%20it%20MUST%20be%20stored%20in%20the%20metadata.rdf%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS-Paket KANN einen Komponentenbaum modellieren. Die Eigenschaft iirds:has-component definiert Teil-von-Beziehungen für Produkte und ihre Komponenten. Der Komponentenbaum ist eine proprietäre iiRDS-Erweiterung, er MUSS in der metadata.rdf des iiRDS-Pakets gespeichert werden.",
            "en": "An iiRDS package MAY model a component tree. The property iirds:has-component defines part-of relations for products and their components. The component tree is a proprietary iiRDS extension, it MUST be stored in the metadata.rdf of the iiRDS package."
        },
    },
    {
        id: "M24",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20product%20ontology%20MUST%20NOT%20be%20a%20proprietary%20iiRDS%20extension%20and%20MAY%20use%20a%20vocabulary%20other%20than%20RDF%20and%20RDFS.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Produktontologie DARF KEINE proprietäre iiRDS-Erweiterung sein und DARF ein anderes Vokabular als RDF und RDFS verwenden.",
            "en": "The product ontology MUST NOT be a proprietary iiRDS extension and MAY use a vocabulary other than RDF and RDFS."
        },
    },
    {
        id: "M25",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iiRDS%20package%20MUST%20NOT%20use%20an%20external%20product%20ontology%20directly.%20If%20an%20external%20product%20ontology%20is%20available%20and%20used%20in%20the%20iiRDS%20package%2C%20then%20the%20iiRDS%20package%20MUST%20also%20contain%20metadata%20labels%20as%20instances%20of%20iirds%3AComponent.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS-Paket DARF NICHT direkt eine externe Produktontologie verwenden. Wenn eine externe Produktontologie verfügbar ist und im iiRDS-Paket verwendet wird, MUSS das iiRDS-Paket auch Metadaten-Labels als Instanzen von iirds:Component enthalten.",
            "en": "An iiRDS package MUST NOT use an external product ontology directly. If an external product ontology is available and used in the iiRDS package, then the iiRDS package MUST also contain metadata labels as instances of iirds:Component."
        },
    },
    {
        id: "M26",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20map%20the%20component%20tree%20in%20the%20iiRDS%20package%20to%20the%20external%20product%20ontology%2C%20a%20mapping%20ontology%20MUST%20use%20the%20property%20rdfs%3AseeAlso.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um den Komponentenbaum im iiRDS-Paket der externen Produktontologie zuzuordnen, MUSS eine Mapping-Ontologie die Eigenschaft rdfs:seeAlso verwenden.",
            "en": "To map the component tree in the iiRDS package to the external product ontology, a mapping ontology MUST use the property rdfs:seeAlso."
        },
    },
    {
        id: "M27",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iiRDS%20provides%20the%20class%20iirds%3AProductVariant%20for%20extending%20the%20iiRDS%20vocabulary%20and%20adding%20proprietary%20product%20variants.%20As%20product%20variants%20are%20a%20proprietary%20iiRDS%20extension%2C%20they%20MUST%20be%20present%20in%20the%20metadata.rdf%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS stellt die Klasse iirds:ProductVariant bereit, um das iiRDS-Vokabular zu erweitern und proprietäre Produktvarianten hinzuzufügen. Da Produktvarianten eine proprietäre iiRDS-Erweiterung sind, MÜSSEN sie in der metadata.rdf des iiRDS-Pakets vorhanden sein.",
            "en": "iiRDS provides the class iirds:ProductVariant for extending the iiRDS vocabulary and adding proprietary product variants. As product variants are a proprietary iiRDS extension, they MUST be present in the metadata.rdf of the iiRDS package."
        },
    },
    {
        id: "M29",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20property%20rdfs%3AseeAlso%20MUST%20relate%20the%20instance%20of%20the%20product%20variant%20in%20the%20iiRDS%20package%20to%20the%20external%20product%20ontology.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Eigenschaft rdfs:seeAlso MUSS die Instanz der Produktvariante im iiRDS-Paket mit der externen Produktontologie in Beziehung setzen.",
            "en": "The property rdfs:seeAlso MUST relate the instance of the product variant in the iiRDS package to the external product ontology. "
        },
    },
    {
        id: "M30.1",
        path: "InformationObject has-identity Identity",
        prio: "MUST",
        category: "must not be empty",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Identity-Instanz besteht aus zwei Teilen: dem Wert und der Domäne. Der Wert MUSS als nicht leerer String in der Eigenschaft iirds:identifier angegeben werden. Eine Identität MUSS durch die Eigenschaft iirds:has-identity-domain auf genau eine Domäne verweisen. Die Domäne ist eine Instanz der Klasse iirdsIdentityDomain.",
            "en": "An iirds:Identity instance consists of two parts: the value and the domain. The value MUST be provided as a non-empty string in the iirds:identifier property. An identity MUST point to exactly one domain by the iirds:has-identity-domain property. The domain is an instance of the iirdsIdentityDomain class."
        },
        info: {
            "de": " ",
            "en": "Property iirds:identifier MUST NOT be empty."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic-M30.1_false.rdf"]
        }
    },
    {
        id: "M30.2",
        path: "InformationObject has-identity Identity",
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Identity-Instanz besteht aus zwei Teilen: dem Wert und der Domäne. Der Wert MUSS als nicht leerer String in der Eigenschaft iirds:identifier angegeben werden. Eine Identität MUSS durch die Eigenschaft iirds:has-identity-domain auf genau eine Domäne verweisen. Die Domäne ist eine Instanz der Klasse iirdsIdentityDomain.",
            "en": "An iirds:Identity instance consists of two parts: the value and the domain. The value MUST be provided as a non-empty string in the iirds:identifier property. An identity MUST point to exactly one domain by the iirds:has-identity-domain property. The domain is an instance of the iirdsIdentityDomain class."
        },
        info: {
            "de": " ",
            "en": "An identity MUST point to exactly one domain by the iirds:has-identity-domain property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic-M30.2_false.rdf"]
        }
    },
    {
        id: "M30.3",
        path: "InformationObject has-identity Identity",
        prio: "MUST",
        category: "specific values allowed",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Identity-Instanz besteht aus zwei Teilen: dem Wert und der Domäne. Der Wert MUSS als nicht leerer String in der Eigenschaft iirds:identifier angegeben werden. Eine Identität MUSS durch die Eigenschaft iirds:has-identity-domain auf genau eine Domäne verweisen. Die Domäne ist eine Instanz der Klasse iirdsIdentityDomain.",
            "en": "An iirds:Identity instance consists of two parts: the value and the domain. The value MUST be provided as a non-empty string in the iirds:identifier property. An identity MUST point to exactly one domain by the iirds:has-identity-domain property. The domain is an instance of the iirdsIdentityDomain class."
        },
        info: {
            "de": " ",
            "en": "The domain MUST be an instance of the iirdsIdentityDomain class."
        },
    },
    {
        id: "M31.1",
        path: "IdentityDomain",
        findInvalidElements: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => [!iri_with_www, !iri_with_uuid, !iri_with_https].every(regx => regx.test(el.getAttribute("rdf:about")))),
        prio: "MUST",
        category: "absolute IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20class%20iirds%3AIdentityDomain%20MUST%20have%20an%20absolute%20IRI%20and%20MAY%20link%20to%20the%20custodian%20of%20the%20domain%20via%20the%20iirds%3Ahas%2Dparty%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Instances of class iirds:IdentityDomain MUST have an absolute IRI and MAY link to the custodian of the domain via the iirds:has-party property."
        },
        info: {
            "de": " ",
            "en": "Instances of class iirds:IdentityDomain MUST have an absolute IRI."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic-M31.1_false"]
        }
    },
    {
        id: "M32.1",
        path: "ContentLifeCycleStatus",
        findInvalidElements: els => els.mustHaveChild("has-content-lifecycle-status-value"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AContentLifecyleStatus%20MUST%20have%20an%20iirds%3AContentLifecyleStatusValue%20which%20is%20assigned%20by%20the%20iirds%3Ahas%2Dcontent%2Dlifecycle%2Dstatus%2Dvalue%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iirds:ContentLifecyleStatus MUSS einen iirds:ContentLifecyleStatusValue haben, der von der Eigenschaft iirds:has-content-lifecycle-status-value zugewiesen wird.",
            "en": "An iirds:ContentLifecyleStatus MUST have an iirds:ContentLifecyleStatusValue which is assigned by the iirds:has-content-lifecycle-status-value property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.1_false.rdf"]
        }
    },
    {
        id: "M32.2",
        path: "ContentLifeCycleStatus",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("dateOfEffect"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20180418-1.0-release/index.html#:~:text=0..1%C2%A0%20iirds%3AdateOfEffect%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:dateOfEffect property - http://www.w3.org/2001/XMLSchema#dateTimeStamp"
        },
        info: {
            "de": " ",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:dateOfEffect."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.2_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.2_false.rdf"]
        }
    },
    {
        id: "M32.3",
        path: "ContentLifeCycleStatus",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("dateOfExpiry"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#functional-metadata:~:text=0..1%C2%A0%20iirds%3AdateOfExpiry%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:dateOfExpiry property - http://www.w3.org/2001/XMLSchema#dateTimeStamp"
        },
        info: {
            "de": " ",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:dateOfExpiry."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.3_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.3_false.rdf"]
        }
    },
    {
        id: "M32.4",
        path: "ContentLifeCycleStatus",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("dateOfStatus"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#functional-metadata:~:text=0..1%C2%A0%20iirds%3AdateOfStatus%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:dateOfStatus property - http://www.w3.org/2001/XMLSchema#dateTimeStamp"
        },
        info: {
            "de": " ",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:purpose."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.4_false.rdf"]
        }
    },
    {
        id: "M32.5",
        path: "ContentLifeCycleStatus",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("purpose"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#functional-metadata:~:text=0..1%C2%A0%20iirds%3Apurpose%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 0..1  iirds:purpose property - http://www.w3.org/2000/01/rdf-schema#Literal"
        },
        info: {
            "de": " ",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:dateOfStatus."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.5_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.5_false.rdf"]
        }

    },
    {
        id: "M32.6",
        path: "ContentLifeCycleStatus",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("relates-to-party"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20190712-1.0.1-release/index.html#rdfproperties_core_iirdsAttribute:~:text=rdf%2Dschema%23Literal-,0..1%C2%A0%20iirds%3Arelates%2Dto%2Dparty%20property%20%2D%20iirds%3AParty,-iirds%3AContentLifeCycleStatusValue",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": " ",
            "en": "Properties: 	0..1  iirds:relates-to-party property - iirds:Party"
        },
        info: {
            "de": " ",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:relates-to-party."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.6_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.6_false.rdf"]
        }

    },
    {
        id: "M33",
        path: "Party",
        prio: "MUST",
        category: "cardinality 0..1 (Ungenauigkeit in Spec. Text impliziert cardinality 1)",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AParty%20MUST%20have%20a%20related%20iirds%3APartyRole%20that%20is%20assigned%20by%20the%20property%20iirds%3Ahas%2Dparty%2Drole%2C%20such%20as%20author%2C%20supplier%20or%20manufacturer.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Party MUSS eine zugehörige iirds:PartyRole haben, die von der Eigenschaft iirds:has-party-role zugewiesen wird, wie z. B. Autor, Lieferant oder Hersteller.",
            "en": "An iirds:Party MUST have a related iirds:PartyRole that is assigned by the property iirds:has-party-role, such as author, supplier or manufacturer."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 34 - Component with manufacturer.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M34",
        path: "Party",
        prio: "MUST",
        category: "cardinality 0..1 (Ungenauigkeit, siehe M33)",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20addition%20to%20the%20role%2C%20an%20iirds%3AParty%20MUST%20also%20have%20an%20associated%20description%20of%20itself%20as%20compliant%20vcard%3Akind%20object%20which%20is%20assigned%20via%20iirds%3Arelates%2Dto%2Dvcard.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Zusätzlich zur Rolle MUSS eine iirds:Party auch eine zugehörige Beschreibung von sich selbst als konformes vcard:kind-Objekt haben, die über iirds:relates-to-vcard zugewiesen wird.",
            "en": "In addition to the role, an iirds:Party MUST also have an associated description of itself as compliant vcard:kind object which is assigned via iirds:relates-to-vcard."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 34 - Component with manufacturer.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M35.1",
        path: "DirectoryNode",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("has-next-sibling"),
        prio: "MUST NOT",
        category: "cardinality 0..1 (Ungenauigkeit, siehe M33)",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Navigation%20sequences%20and%20hierarchies%20of%20InformationUnits%20MUST%20be%20modeled%20as%20linked%20lists%20of%20instances%20of%20the%20class%20iirds%3ADirectoryNode.%20In%20a%20linked%20list%2C%20an%20iirds%3ADirectoryNode%20references%20the%20following%20node%20by%20the%20property%20iirds%3Ahas%2Dnext%2Dsibling.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Navigationsabläufe und Hierarchien von InformationUnits MÜSSEN als verkettete Listen von Instanzen der Klasse iirds:DirectoryNode modelliert werden. In einer verknüpften Liste verweist ein iirds:DirectoryNode auf den folgenden Knoten durch die Eigenschaft iirds:has-next-sibling.",
            "en": "Navigation sequences and hierarchies of InformationUnits MUST be modeled as linked lists of instances of the class iirds:DirectoryNode. In a linked list, an iirds:DirectoryNode references the following node by the property iirds:has-next-sibling."
        },
        info: {
            "de": " ",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:has-next-sibling."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.1_false.rdf"]
        }

    },
    {
        id: "M35.2",
        path: "DirectoryNode",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("has-directory-structure-type"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=0..1%C2%A0%20iirds%3Ahas%2Ddirectory%2Dstructure%2Dtype%20property%20%2D%20iirds%3ADirectoryNodeType",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "",
            "en": "Properties: 0..1  iirds:has-directory-structure-type property - iirds:DirectoryNodeType"
        },
        info: {
            "de": " ",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:has-directory-structure-type."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.2_false.rdf"]
        }
    },
    {
        id: "M35.3",
        path: "DirectoryNode",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("has-first-child property"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=0..1%C2%A0%20iirds%3Ahas%2Dfirst%2Dchild%20property%20%2D%20iirds%3ADirectoryNode",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "",
            "en": "Properties: 0..1  iirds:has-first-child property - iirds:DirectoryNode"
        },
        info: {
            "de": " ",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:has-first-child property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.3_false.rdf"]
        }

    },
    {
        id: "M35.4",
        path: "DirectoryNode",
        findInvalidElements: els => els.mustNotHaveMoreThanOneChild("relates-to-information-unit"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=0..1%C2%A0%20iirds%3Arelates%2Dto%2Dinformation%2Dunit%20property%20%2D%20iirds%3AInformationUnit",
        version: ["V1.1"],
        rule: {
            "de": " ",
            "en": "0..1  iirds:relates-to-information-unit property - iirds:InformationUnit"
        },
        info: {
            "de": " ",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:relates-to-information-unit."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.4_false.rdf"]
        }

    },
    {
        id: "M35.5",
        path: "DirectoryNode",
        prio: "MUST",
        category: "only root element must have property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Only%20root%20nodes%20of%20a%20directory%20structure%20MUST%20have%20the%20property%20iirds%3Ahas%2Ddirectory%2Dstructure%2Dtype.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der Wurzelknoten einer Verzeichnisstruktur MUSS die Eigenschaft iirds:has-directory-structure-type haben.",
            "en": "The root node of a directory structure MUST have one property iirds:has-directory-structure-type."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.4_false.rdf"]
        }

    },
    {
        id: "M36",
        path: "DirectoryNode",
        findInvalidElements: "",
        prio: "MUST",
        category: "rdf:resource relates to class iirds:nil",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20model%20closed%20lists%2C%20the%20last%20node%20in%20a%20list%20level%20MUST%20have%20the%20property%20iirds%3Ahas%2Dnext%2Dsibling%20relating%20to%20an%20instance%20of%20the%20class%20iirds%3Anil.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um geschlossene Listen zu modellieren, MUSS der letzte Knoten in einer Listenebene die Eigenschaft iirds:has-next-sibling haben, die sich auf eine Instanz der Klasse iirds:nil bezieht.",
            "en": "To model closed lists, the last node in a list level MUST have the property iirds:has-next-sibling relating to an instance of the class iirds:nil."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 38 - Table of contents.rdf","./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds_validation/Example 38 - Table of contents-M36_false.rdf"]
        }

    },
    {
        id: "M37",
        path: "DirectoryNode",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20model%20hierarchy%20levels%20in%20the%20navigation%20structure%2C%20an%20iirds%3ADirectoryNode%20instance%20MUST%20reference%20an%20iirds%3ADirectoryNode%20instance%20on%20the%20next%20lower%20level%20by%20the%20property%20iirds%3Ahas%2Dfirst%2Dchild.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um Hierarchieebenen in der Navigationsstruktur zu modellieren, MUSS eine iirds:DirectoryNode-Instanz eine iirds:DirectoryNode-Instanz auf der nächstniedrigeren Ebene durch die Eigenschaft iirds:has-first-child referenzieren.",
            "en": "To model hierarchy levels in the navigation structure, an iirds:DirectoryNode instance MUST reference an iirds:DirectoryNode instance on the next lower level by the property iirds:has-first-child."
        },
        info: {
            "de": "Um Hierarchieebenen in der Navigationsstruktur zu modellieren, MUSS eine iirds:DirectoryNode-Instanz eine iirds:DirectoryNode-Instanz auf der nächstniedrigeren Ebene durch die Eigenschaft iirds:has-first-child referenzieren.",
            "en": "To model hierarchy levels in the navigation structure, an iirds:DirectoryNode instance MUST reference an iirds:DirectoryNode instance on the next lower level by the property iirds:has-first-child."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }

    },
    {
        id: "M38",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20directory%20node%20on%20the%20next%20lower%20level%20MUST%20be%20the%20first%20item%20of%20another%20linked%20list.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der Verzeichnisknoten auf der nächstniedrigeren Ebene MUSS das erste Element einer anderen verknüpften Liste sein.",
            "en": "The directory node on the next lower level MUST be the first item of another linked list."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }

    },
    {
        id: "M39",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Proprietary%20iiRDS%20extensions%3A%20iiRDS%20supports%20proprietary%20iiRDS%20extensions%20for%20company%2Dspecific%20and%20project%2Dspecific%20instances%20and%20classes.%20A%20proprietary%20iiRDS%20extension%20MUST%20comply%20with%20the%20standard%20in%20order%20to%20be%20processible%20by%20iiRDS%20Consumers.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Proprietäre iiRDS-Erweiterungen: iiRDS unterstützt proprietäre iiRDS-Erweiterungen für unternehmens- und projektspezifische Instanzen und Klassen. Eine proprietäre iiRDS-Erweiterung MUSS dem Standard entsprechen, um von iiRDS-Verbrauchern verarbeitet werden zu können.",
            "en": "Proprietary iiRDS extensions: iiRDS supports proprietary iiRDS extensions for company-specific and project-specific instances and classes. A proprietary iiRDS extension MUST comply with the standard in order to be processible by iiRDS Consumers."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }

    },
    {
        id: "M40",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=All%20proprietary%20extensions%20that%20are%20used%20in%20a%20package%20MUST%20be%20contained%20in%20the%20file%20metadata.rdf%20in%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Alle proprietären Erweiterungen, die in einem Paket verwendet werden, MÜSSEN in der Datei metadata.rdf im iiRDS-Paket enthalten sein.",
            "en": "All proprietary extensions that are used in a package MUST be contained in the file metadata.rdf in the iiRDS package."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }

    },
    {
        id: "M41",
        path: "",
        findInvalidElements: "",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20file%20metadata.rdf%20MUST%20NOT%20contain%20the%20iiRDS%20schema%20or%20iiRDS%20domain%20extensions.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Datei metadata.rdf DARF NICHT das iiRDS-Schema oder die iiRDS-Domänenerweiterungen enthalten.",
            "en": "The file metadata.rdf MUST NOT contain the iiRDS schema or iiRDS domain extensions."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }

    },
    {
        id: "M42",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine proprietäre iiRDS-Erweiterung MUSS die folgenden Bedingungen erfüllen:",
            "en": "A proprietary iiRDS extension MUST fulfill the following conditions:"
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }

        /*
        Proprietary classes, instances, and properties are registered to the namespace of the defining party.
        The defining party provides the proprietary iiRDS extension to other parties if said other parties are expected to process the proprietary classes and instances.
        Proprietary classes are subclasses or equivalent classes of existing iiRDS classes.
        Proprietary instances are instances of existing iiRDS classes or subclasses. Proprietary instances MAY also be instances of a proprietary class.
        Proprietary properties are sub-properties of existing properties.
        */
    },
    {
        id: "M43",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Proprietary%20iiRDS%20extensions%20MUST%20only%20use%20RDF%20and%20RDFS%20vocabulary%20in%20their%20extension%20ontology.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Proprietäre iiRDS-Erweiterungen DÜRFEN nur RDF- und RDFS-Vokabular in ihrer Erweiterungs-Ontologie verwenden.",
            "en": "Proprietary iiRDS extensions MUST only use RDF and RDFS vocabulary in their extension ontology."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
    },
    {
        id: "M44",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Proprietary%20iiRDS%20extensions%20MAY%20add%20proprietary%20properties%20as%20a%20subproperty%20of%20an%20iiRDS%20property.%20Proprietary%20properties%20MUST%20comply%20with%20domain%20and%20range%20of%20the%20iiRDS%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Proprietäre iiRDS-Erweiterungen KÖNNEN proprietäre Eigenschaften als Untereigenschaft einer iiRDS-Eigenschaft hinzufügen. Proprietäre Eigenschaften MÜSSEN der Domäne und dem Bereich der iiRDS-Eigenschaft entsprechen.",
            "en": "Proprietary iiRDS extensions MAY add proprietary properties as a subproperty of an iiRDS property. Proprietary properties MUST comply with domain and range of the iiRDS property."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }

    },


    //===================iirds:Identity
    {
        id: "M45",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Complex%20identifier%20of%20an%20iiRDS%20domain%20entity.%20Each%20identifier%20MUST%20be%20related%20to%20the%20identity%20domain%20within%20which%20it%20is%20unambiguous.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Definition: Komplexer Bezeichner einer iiRDS-Domainentität. Jede Kennung MUSS sich auf die Identitätsdomäne beziehen, innerhalb derer sie eindeutig ist.",
            "en": "Definition:	Complex identifier of an iiRDS domain entity. Each identifier MUST be related to the identity domain within which it is unambiguous."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
    },
    {
        id: "M46",
        path: "Identity",
        findInvalidElements: els => els.mustHaveChild("identifier"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=1%C2%A0%20iirds%3Aidentifier%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:identifier haben",
            "en": "iirds:Identity MUST have property iirds:identifier"
        },
        info: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:identifier haben",
            "en": "iirds:Identity MUST have property iirds:identifier"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant-M46_false.rdf"]
        }
    },
    {
        id: "M47",
        path: "Identity",
        findInvalidElements: els => els.mustHaveChild("has-identity-domain"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-identity-domain:~:text=1%C2%A0%20iirds%3Ahas%2Didentity%2Ddomain%20property%20%2D%20iirds%3AIdentityDomain",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:IdentityDomain haben",
            "en": "iirds:Identity MUST have property iirds:IdentityDomain"
        },
        info: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:IdentityDomain haben",
            "en": "iirds:Identity MUST have property iirds:has-identity-domain"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant-M47_false.rdf"]
        }

    },
    {
        //out of scope / false positive?
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        rule: {
            "de": "Beschreibung: Aufgaben geben Anweisungen und KÖNNEN Informationen zu anderen Aspekten enthalten, wie z. B. Anforderungen, die erfüllt werden MÜSSEN, oder Sicherheitshinweise.",
            "en": "Description:	Tasks provide instructions and MAY contain information on other aspects, such as requirements that MUST be fulfilled or safety instructions."
        },
    },

    {
        //out of scope / false positive?
        path: "",
        findInvalidElements: "",
        prio: "RECOMMENDED",
        rule: {
            "de": "Beschreibung: EMPFOHLEN bewährtes Verfahren besteht darin, die Ressource anhand einer Zeichenfolge zu identifizieren, die einem formalen Identifizierungssystem entspricht.",
            "en": "Description:	RECOMMENDED best practice is to identify the resource by means of a string conforming to a formal identification system."
        },
    },

    {
        //out of scope / signal words false positive?
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        rule: {
            "de": "Beschreibung: Aufgaben geben Anweisungen und KÖNNEN Informationen zu anderen Aspekten enthalten, wie z. B. Anforderungen, die erfüllt werden MÜSSEN, oder Sicherheitshinweise.",
            "en": "Description:	Tasks provide instructions and MAY contain information on other aspects, such as requirements that MUST be fulfilled or safety instructions."
        },
    },
    {
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        rule: {
            "de": "Definition: Enthält allgemeine sicherheitsbezogene Informationen des Herstellers, die bei Montage, Betrieb, Wartung, Reparatur und Demontage des Produkts berücksichtigt werden MÜSSEN. In den Aufgaben werden Sicherheitshinweise zu einzelnen Aufgaben gegeben.",
            "en": "Definition:	Contains general safety-related information provided by the manufacturer that MUST be considered during assembly, operation, maintenance, repair, and disassembly of the product. Safety information related to individual tasks is provided in the tasks."
        },
    },
    {
        id: "M49",
        path: "Document, Component, Concept, ContentLifeCycleStatusValue, DirectoryNodeType, DocumentType, Event, Form, Formality, Fragment, Functionality, IdentityDomain, IdentityType, InformationObject, Learning, Package, Party, PartyRole, Process, ProductFunction, ProductProperty, ProductVariant, Reference, Role, Safety, SkillLevel, Supply, Task, TechnicalData, TechnicalOverview, Topic, TopicType, Troubleshooting, Use, WarningMessage, ConsumableSupply, HardwareTool, Lubricant, OperatingSupply, ProtectiveEquipment, SparePart",
        findInvalidElements: (els => !els.length) && (els => els.every(el => el.hasAttribute(
            "rdf:about"))) && (els => els.every(el => el.getAttribute("rdf:about") != "")),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M50",
        path: "AfterUse",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=use%20of%20the%20product.-,Description%3A,-Not%20intended%20to%20be",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M51",
        path: "Collection",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Not%20intented%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.%20For%20collection%20subjects%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Sammlungsthemen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intented to be used directly. Use the subclasses instead. For collection subjects not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M52",
        path: "Conformity",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.%20For%20information%20subjects%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Informationsthemen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For information subjects not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M53",
        path: "DesignAndRealization",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=of%20a%20product.-,Description%3A,phases%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M54",
        path: "DocumentationMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3ADocumentType",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M55",
        path: "FunctionalMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3AIdentity",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M56",
        path: "iirdsDomainEntity",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M57",
        path: "AdministrativeMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3AAfterUse",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M58",
        path: "InformationSubject",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intented%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intented to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M59",
        path: "InformationType",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intented%20to%20be%20used%20directly.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.",
            "en": "Not intented to be used directly."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M60",
        path: "PlanningTime",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=specific%20working%20tasks.-,Description%3A,-Not%20intended%20to",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M61",
        path: "ProductFeature",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=functions%20of%20a%20product%20or%20component.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M62",
        path: "ProductLifeCyclePhase",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=MAY%20refer%20to.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M63",
        path: "ProductMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=product%2Drelated%20metadata.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M64",
        path: "PuttingToUse",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=system%20to%20use.-,Description%3A,phases%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M65",
        path: "Qualification",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=roles%20REQUIRED%20for%20working%20tasks%20described%20in%20technical%20documentation.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M66",
        path: "relates-to-administrative-metadata",
        findInvalidElements: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_relates-to-administrative-metadata:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3Arelates%2Dto%2Dcomponent",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
    {
        id: "M67",
        path: "Component",
        findInvalidElements: "",
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_ProductMetadata:~:text=identity%20properties%20%2D%20iirds%3AIdentity-,0..1%C2%A0%20iirds%3Arelates%2Dto%2Dparty%20property%20%2D%20iirds%3AParty,-iirds%3AConcept",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Component DARF NICHT mehr als 1 Eigenschaft iirds:relates-to-party haben",
            "en": "iirds:Component MUST NOT have more than 1 property iirds:relates-to-party"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }

    },
];
