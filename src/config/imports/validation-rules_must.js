const ABSOLUTE_IRI_REGEX = /(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/;
const iri_absolute_regex = /'^(?:[a-z]+:)?\/\/'/;
const iri_with_https = /^http[s]?\:\/\//;
const iri_with_www = /www\..*?\..*?\//;
const iri_with_uuid = /urn\:uuid\:[a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}/;
const mustNotBeABlankNode = el => el.childElementCount === 0;
const mustNotHaveChild = child => el => el.querySelectorAll(child).length === 0;
const mustHaveChild = child => el => el.querySelectorAll(child).length === 1;
const includesAll = (small, big) => small.every(n => big.indexOf(n) !== -1);

/*
        {
            id: "M1",
            path: "",
            findInvalidElements: "",
            prio: "",
            spec: "",
            version: ["V1.0","V1.0.1","V1.1"],
            rule: { "de": "XX", "en": "XX" },
            testfiles: {"true": [""], "false": [""]}
            //COMMENTS
        },

    */


export default [
    //6.2 Information Units
    {
        id: "M1",

        path: "InformationUnit",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-package-and-container:~:text=iiRDS%20Generators%20MUST%20NOT%20use%20the%20iirds%3AInformationUnit%20class%20directly%20but%20MUST%20use%20one%20of%20the%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS-Generatoren DÜRFEN die Klasse iirds:InformationUnit NICHT direkt verwenden, sondern MÜSSEN eine der Unterklassen verwendeniiRDS-Generatoren DÜRFEN die Klasse iirds:InformationUnit NICHT direkt verwenden, sondern MÜSSEN eine der Unterklassen verwenden",
            "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclassesiiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [
                "./tests/files/util/iirds-validation/metadata_iirds_sample_fail_informationUnit.rdf"
            ]
        }
        /*COMMENTS

        */
    },
    {
        id: "M2",
        path: "Document, Topic, Fragment, Package",
        //findInvalidElements: els => els.every(el => (el.childElementCount !== 0 && el.hasAttribute("rdf:about"))),
        findInvalidElements: els => els.filter(el => el.childElementCount === 0 || !el.hasAttribute(
            "rdf:about")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=An%20instance%20of%20an%20iirds%3AInformationUnit%20subclass%20MUST%20have%20an%20IRI%20and%20MUST%20NOT%20be%20a%20blank%20node.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse MUSS einen IRI haben und darf KEIN leerer Knoten sein.",
            "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI and MUST NOT be a blank node."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
    },
    {
        id: "M3",
        path: "Package",
        findInvalidElements: els => els.slice(1),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=Each%20iiRDS%20package%20MUST%20have%20exactly%20one%20corresponding%20iirds%3APackage%20instance%20in%20the%20metadata.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Jedes iiRDS-Paket MUSS genau eine entsprechende iirds:Package-Instanz in den Metadaten haben.",
            "en": "Each iiRDS package MUST have exactly one corresponding iirds:Package instance in the metadata."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
        // TODO: False-Fall: MUSS genau eine
    },
    {
        id: "M4",
        path: "Package",
        //findInvalidElements: els => els.every(el => el.querySelector("iiRDSVersion")),
        findInvalidElements: els => els.filter(el => !el.querySelector("iiRDSVersion")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=0..1-,iirds%3APackage,1,-iirds%3AParty",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS:Package MUSS die Eigenschaft iirds:iiRDSVersion verwenden",
            "en": "iiRDS:Package MUST use property iirds:iiRDSVersion"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
    },
    {
        id: "M5",
        path: "Package",
        findInvalidElements: els => els.every(el => el.querySelectorAll("is-part-of-package").length === 0),
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20corresponding%20iirds%3APackage%20instance%20of%20an%20iiRDS%20package%20MUST%20NOT%20be%20a%20member%20of%20another%20iiRDS%20package%20expressed%20by%20the%20property%20iirds%3Ais%2Dpart%2Dof%2Dpackage.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die entsprechende iirds:Package-Instanz eines iiRDS-Pakets DARF NICHT Mitglied eines anderen iiRDS-Pakets sein, das durch die Eigenschaft iirds:is-part-of-package ausgedrückt wird.",
            "en": "The corresponding iirds:Package instance of an iiRDS package MUST NOT be a member of another iiRDS package expressed by the property iirds:is-part-of-package."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
        //TODO: Formulierung anpassen: every vs filter
    },

    //6.2.1 InformationUnit Identifier

    //It is RECOMMENDED to use absolute IRIs in rdf:about. Additionally, it is RECOMMENDED to generate IRIs as follows: Keep the IRI of rdf:about globally unique;Keep the IRI of rdf:about stable over packages and time if the IRI identifies the same subject;If the source system has a meaningful identifier such as a unique ID from the CMS, use it to generate an IRI for rdf:about
    {
        id: "M6",
        path: "*",
        //findInvalidElements: els => els.filter(el => el.hasAttribute("rdf:about")).every(el => !/(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/.test(el.textContent)),
        findInvalidElements: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => [!iri_with_www, !iri_with_uuid, !iri_with_https].every(regx => regx.test(el.getAttribute("rdf:about")))),
        prio: "RECOMMENDED",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20is%20RECOMMENDED%20to%20use%20absolute%20IRIs%20in%20rdf%3Aabout.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es wird EMPFOHLEN absolute IRIs in rdf:about zu verwenden.",
            "en": "It is RECOMMENDED to use absolute IRIs in rdf:about."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
        //^(urn\:uuid\:)|^(https\:\/\/.+\.)|^(www\.)
        //Test in Console: Array.from(document.querySelectorAll("*")).filter(el => el.hasAttribute("rdf:about")).filter(el => /www\..*?\..*?\//.test(el.getAttribute("rdf:about"))).map(el => el.getAttribute("rdf:about"))
        //TODO: Testing
    },

    //6.2.2 Information Objects
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
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
    },

    {
        id: "M8",
        path: "InformationObject",
        /*findInvalidElements: () => {

            (Array.from(document.querySelectorAll("InformationObject")).map(el => el.getAttribute("rdf:about"))).every(el => /'^(?:[a-z]+:)?\/\/'/);
        },*/
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20information%20object%20MUST%20have%20an%20absolute%20IRI%20and%20MAY%20be%20related%20to%20additional%20identifications%20via%20the%20iirds%3Ahas%2Didentity%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein Informationsobjekt MUSS einen absoluten IRI haben und DARF über die Eigenschaft iirds:has-identity mit zusätzlichen Identifikationen verbunden sein.",
            "en": "An information object MUST have an absolute IRI and MAY be related to additional identifications via the iirds:has-identity property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
        //Possible overlap with rule M6
    },

    //6.3 Content References of Information Units
    {
        id: "M9",
        path: "Package",
        findInvalidElements: "",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iirds%3APackage%20elements%20representing%20the%20enclosing%20iiRDS%20package%20itself%20MUST%20NOT%20be%20subjects%20of%20any%20iirds%3Ahas%2Drendition%20relation.",
        version: ["V1.1"],
        rule: {
            "de": "iirds:Package-Elemente, die das umschließende iiRDS-Paket selbst darstellen, DÜRFEN NICHT Gegenstand einer iirds:has-rendition-Beziehung sein.",
            "en": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M10",
        path: "Rendition source",
        findInvalidElements: els => els.every(el => !ABSOLUTE_IRI_REGEX.test(el.textContent)),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20URL%20MUST%20be%20relative%20to%20the%20root%20folder%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die URL MUSS relativ zum Stammordner des iiRDS-Pakets sein",
            "en": "The URL MUST be relative to the root folder of the iiRDS package"
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
        //TODO
        /*
        Umformulieren (every vs filter)
        Testing
        Prüfung auf  "el.textContent richtig? vgl. M6)
        */
    },
    {
        id: "M11",
        path: "Rendition",
        findInvalidElements: els => els.every(el => el.querySelector("source")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#properties-and-relations-overview:~:text=1-,iirds%3ARendition,1,-iirds%3ARendition",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:source haben.",
            "en": "An iirds:Rendition MUST have the property iirds:source."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
        /*
        See Also:
            Chapter 6.3 https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20identify%20the%20physical%20file%2C%20the%20property%20iirds%3Asource%20MUST%20relate%20the%20rendition%20to%20the%20URL%20of%20the%20physical%20file.
            RDF Schema Ref: https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=1%C2%A0%20iirds%3Asource%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal
            https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#class-definitions:~:text=1-,iirds%3ARendition,1,-iirds%3ARendition
        */
        //Umformulieren every vs filter
    },
    {
        id: "M12",
        path: "Rendition",
        findInvalidElements: els => els.every(el => el.querySelector("format")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3ARendition%20MUST%20also%20have%20the%20property%20iirds%3Aformat.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:format haben.",
            "en": "An iirds:Rendition MUST have the property iirds:format."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_multi.rdf"]
        }
        //COMMENTS
        //Umformulieren every vs filter
    },

    //6.3.1 Reference Part of File by Selector
    /*Regel 6.3.1: iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        Regel aufgeteilt in 2 Prüfungen:
            1. iirds:Rendition MUST NOT directly use iirds:Selector.
            2. iirds:Rendition MUST use one a subclasses of iirds:Selector to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
    */
    {
        id: "M13",
        path: "Rendition Selector",
        findInvalidElements: els => els,
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#x-conformance:~:text=iirds%3ARendition%20MUST%20NOT,an%20end%20identifier",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Rendition DARF NICHT direkt iirds:Selector verwenden, sondern MUSS eine seiner Unterklassen verwenden, um Teile einer Datei zu referenzieren. Die Klasse iirds:Selector hat die folgenden Unterklassen: iirds:FragmentSelector;  iirds:RangeSelector",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/fail_must use selector subclass.rdf"]
        }
        //COMMENTS
        /*SEE ALSO
         */
    },
    {
        id: "M14",
        path: "Rendition Selector",
        findInvalidElements: els => els.length === 0,
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iirds%3ARendition%20MUST%20NOT,an%20end%20identifier.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Rendition DARF NICHT direkt iirds:Selector verwenden, sondern MUSS eine seiner Unterklassen verwenden, um Teile einer Datei zu referenzieren. Die Klasse iirds:Selector hat die folgenden Unterklassen: iirds:FragmentSelector;  iirds:RangeSelector",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/fail_must use selector subclass.rdf"]
        }
        //COMMENTS
    },

    //6.3.1.1 Reference Part with Single Identifier

    //6.3.1.2 Reference Part with Start and End Identifier
    {
        id: "M15",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20iirds%3ARangeSelector%20points,end%2Dselector.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der iirds:RangeSelector zeigt durch einen Start- und einen Endselektor auf den Teil einer Datei. Die Bereichsauswahl MUSS verwendet werden, um einen Bereich in einer Datei zu identifizieren, wenn das Dateiformat oder der zugehörige Standard die direkte Auswahl eines Bereichs nicht zulässt. Der Bereichsselektor referenziert den Startselektor und den Endselektor durch die Eigenschaften iirds:has-start-selector und iirds:has-end-selector.",
            "en": "The iirds:RangeSelector points to the part of a file by a start and an end selector. The range selector MUST be used to identify a range in a file if the file format or the associated standard does not permit selecting a range directly. The range selector references the start selector and end selector by the properties iirds:has-start-selector and iirds:has-end-selector."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
        //vgl. M79
        /*SEE ALSO

        */
    },

    //6.3.2 Media Files
    {
        id: "M16",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=If%20a%20media%20file%20is%20not%20self%2Dcontained%2C%20then%20it%20MUST%20be%20modeled%20as%20iirds%3AFragment.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Wenn eine Mediendatei nicht in sich geschlossen ist, MUSS sie als iirds:Fragment modelliert werden.",
            "en": "If a media file is not self-contained, then it MUST be modeled as iirds:Fragment."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.3.3 Metadata of Nested iiRDS Packages
    {
        id: "M17",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=For%20each%20nested%20child%20iiRDS%20package%2C%20an%20iirds%3APackage%20MUST,iirds%3APackage%20in%20the%20metadata%20of%20the%20parent%20iiRDS%20package.",
        version: ["V1.1"],
        rule: {
            "de": "Für jedes verschachtelte untergeordnete iiRDS-Paket MUSS ein iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets vorhanden sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS im iiRDS-ZIP-Archiv des übergeordneten iiRDS-Pakets enthalten sein. Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS durch eine iirds:Rendition seines iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets referenziert werden.",
            "en": "For each nested child iiRDS package, an iirds:Package MUST be present in the metadata of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be included in the iiRDS ZIP archive of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be referenced by an iirds:Rendition of its iirds:Package in the metadata of the parent iiRDS package."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M18",
        path: "",
        findInvalidElements: "",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20the%20metadata.rdf%20file%20of%20the%20parent%20iiRDS%20package%2C%20the,package%20MUST%20NOT%20have%20any%20outgoing%20iirds%3Ais%2Dpart%2Dof%2Dpackage%20relations.",
        version: ["V1.1"],
        rule: {
            "de": "In der Datei metadata.rdf des übergeordneten iiRDS-Pakets MUSS das iirds:Package des verschachtelten untergeordneten iiRDS-Pakets genau ein iirds:Package von iirds:is-part-of-package referenzieren. In der Datei metadata.rdf des übergeordneten iiRDS-Pakets DARF das referenzierte übergeordnete iiRDS-Paket KEINE ausgehenden iirds:is-part-of-package-Beziehungen haben.",
            "en": "In the metadata.rdf file of the parent iiRDS package, the iirds:Package of the nested child iiRDS package MUST reference exactly one iirds:Package by iirds:is-part-of-package. In the metadata.rdf file of the parent iiRDS package, the referenced parent iiRDS package MUST NOT have any outgoing iirds:is-part-of-package relations."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.4 Relations of InformationUnits

    //6.5.1 Types of Documents and Topics
    {
        id: "M19",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3ADocument%20class%20MUST%20have%20one%20or%20more%20relations%20to%20one%20of%20the%20standardized%20iirds%3ADocumentTypes%20defined%20in%20iirds%3AInformationType%20%3E%20iirds%3ADocumentType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Document MÜSSEN eine oder mehrere Beziehungen zu einem der standardisierten iirds:DocumentTypes haben, die in iirds:InformationType > iirds:DocumentType definiert sind.",
            "en": "Instances of the iirds:Document class MUST have one or more relations to one of the standardized iirds:DocumentTypes defined in iirds:InformationType > iirds:DocumentType."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M20",
        path: "",
        findInvalidElements: "",
        prio: "RECOMMENDED",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20is%20RECOMMENDED%20to%20create%20more%20than%20one%20relation%20to%20iirds%3ADocumentType%20for%20documents%20with%20mixed%20content.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es wird EMPFOHLEN, für Dokumente mit gemischtem Inhalt mehr als eine Relation zu iirds:DocumentType zu erstellen.",
            "en": "It is RECOMMENDED to create more than one relation to iirds:DocumentType for documents with mixed content."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.5.2 Information Subjects

    //6.6 Documentation Metadata

    //6.6.1 Functional Metadata

    {
        id: "M21",
        path: "Event",
        findInvalidElements: els => els.every(el => el.querySelectorAll("has-event-code").length ===
            1) && (els => els.every(el => el.querySelectorAll("has-event-type").length === 1)),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3AEvent%20class%20MUST%20have%20the%20following%20properties%3A%20iirds%3AeventCode%20and%20iirds%3AeventType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Event MÜSSEN die folgenden Eigenschaften haben: iirds:eventCode und iirds:eventType.",
            "en": "Instances of the iirds:Event class MUST have the following properties: iirds:eventCode and iirds:eventType. "
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
        //The iirds:Event class is a docking point for iiRDS Generators to link documentation content with event information code according to a standard like OPC-UA or a custom convention. The property iirds:relates-to-event links iirds:InformationUnit to iirds:Event.
        /*SEE ALSO
            iirds:EVENT: https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=0..1%C2%A0%20iirds%3Ahas%2Devent,%C2%A0%20iirds%3Ahas%2Devent%2Dtype%20property
            RDF Overview: https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=1..%E2%83%B0-,iirds%3AEvent,0..1,-iirds%3AIdentity
        */
    },

    //6.6.2 Product Metadata

    //6.7 Products and Components in iiRDS
    // Das Attribut "rdf:resource" bei den Elementen "iirdf:relates-to-component" und "relates-to-product-variant" DÜRFEN NICHT den iirds-Namespace verwenden (!http://iirds.tekom.de)
    {
        id: "M22",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20properties%20iirds%3Arelates%2Dto%2Dcomponent%20and%20iirds%3Arelates%2Dto%2Dproduct%2Dvariant%20relate%20an%20information%20unit%20to%20an%20instance%20of%20iirds%3AComponent%20or%20iirds%3AProductVariant.%20The%20instances%20MUST%20be%20part%20of%20a%20proprietary%20iiRDS%20extension.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Eigenschaften iirds:relates-to-component und iirds:relates-to-product-variant beziehen eine Informationseinheit auf eine Instanz von iirds:Component oder iirds:ProductVariant. Die Instanzen MÜSSEN Teil einer proprietären iiRDS-Erweiterung sein.",
            "en": "The properties iirds:relates-to-component and iirds:relates-to-product-variant relate an information unit to an instance of iirds:Component or iirds:ProductVariant. The instances MUST be part of a proprietary iiRDS extension."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.7.1 Component Trees in the Package
    {
        id: "M23",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iiRDS%20package%20MAY%20model%20a%20component%20tree.%20The%20property%20iirds%3Ahas%2Dcomponent%20defines%20part%2Dof%20relations%20for%20products%20and%20their%20components.%20The%20component%20tree%20is%20a%20proprietary%20iiRDS%20extension%2C%20it%20MUST%20be%20stored%20in%20the%20metadata.rdf%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS-Paket KANN einen Komponentenbaum modellieren. Die Eigenschaft iirds:has-component definiert Teil-von-Beziehungen für Produkte und ihre Komponenten. Der Komponentenbaum ist eine proprietäre iiRDS-Erweiterung, er MUSS in der metadata.rdf des iiRDS-Pakets gespeichert werden.",
            "en": "An iiRDS package MAY model a component tree. The property iirds:has-component defines part-of relations for products and their components. The component tree is a proprietary iiRDS extension, it MUST be stored in the metadata.rdf of the iiRDS package."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.7.2 External Product Ontology
    {
        id: "M24",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20product%20ontology%20MUST%20NOT%20be%20a%20proprietary%20iiRDS%20extension%20and%20MAY%20use%20a%20vocabulary%20other%20than%20RDF%20and%20RDFS.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Produktontologie DARF KEINE proprietäre iiRDS-Erweiterung sein und DARF ein anderes Vokabular als RDF und RDFS verwenden.",
            "en": "The product ontology MUST NOT be a proprietary iiRDS extension and MAY use a vocabulary other than RDF and RDFS."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M25",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iiRDS%20package%20MUST%20NOT%20use%20an%20external%20product%20ontology%20directly.%20If%20an%20external%20product%20ontology%20is%20available%20and%20used%20in%20the%20iiRDS%20package%2C%20then%20the%20iiRDS%20package%20MUST%20also%20contain%20metadata%20labels%20as%20instances%20of%20iirds%3AComponent.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS-Paket DARF NICHT direkt eine externe Produktontologie verwenden. Wenn eine externe Produktontologie verfügbar ist und im iiRDS-Paket verwendet wird, MUSS das iiRDS-Paket auch Metadaten-Labels als Instanzen von iirds:Component enthalten.",
            "en": "An iiRDS package MUST NOT use an external product ontology directly. If an external product ontology is available and used in the iiRDS package, then the iiRDS package MUST also contain metadata labels as instances of iirds:Component."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M26",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20map%20the%20component%20tree%20in%20the%20iiRDS%20package%20to%20the%20external%20product%20ontology%2C%20a%20mapping%20ontology%20MUST%20use%20the%20property%20rdfs%3AseeAlso.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um den Komponentenbaum im iiRDS-Paket der externen Produktontologie zuzuordnen, MUSS eine Mapping-Ontologie die Eigenschaft rdfs:seeAlso verwenden.",
            "en": "To map the component tree in the iiRDS package to the external product ontology, a mapping ontology MUST use the property rdfs:seeAlso."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.7.3 Product Variants
    {
        id: "M27",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iiRDS%20provides%20the%20class%20iirds%3AProductVariant%20for%20extending%20the%20iiRDS%20vocabulary%20and%20adding%20proprietary%20product%20variants.%20As%20product%20variants%20are%20a%20proprietary%20iiRDS%20extension%2C%20they%20MUST%20be%20present%20in%20the%20metadata.rdf%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS stellt die Klasse iirds:ProductVariant bereit, um das iiRDS-Vokabular zu erweitern und proprietäre Produktvarianten hinzuzufügen. Da Produktvarianten eine proprietäre iiRDS-Erweiterung sind, MÜSSEN sie in der metadata.rdf des iiRDS-Pakets vorhanden sein.",
            "en": "iiRDS provides the class iirds:ProductVariant for extending the iiRDS vocabulary and adding proprietary product variants. As product variants are a proprietary iiRDS extension, they MUST be present in the metadata.rdf of the iiRDS package."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS - wie Produktvariante feststellen, wenn nicht das Element "iirds:ProductVariant" verwendet wird? -> Schwer zu testen?
    },
    {
        id: "M28",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20map%20product%20variants%20in%20the%20iiRDS%20package%20to%20an%20external%20product%20ontology%2C%20a%20mapping%20ontology%20MUST%20use%20the%20property%20rdfs%3AseeAlso.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um Produktvarianten im iiRDS-Paket einer externen Produktontologie zuzuordnen, MUSS eine Mapping-Ontologie die Eigenschaft rdfs:seeAlso verwenden.",
            "en": "To map product variants in the iiRDS package to an external product ontology, a mapping ontology MUST use the property rdfs:seeAlso."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS - schwer zu testen?
    },
    {
        id: "M29",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20property%20rdfs%3AseeAlso%20MUST%20relate%20the%20instance%20of%20the%20product%20variant%20in%20the%20iiRDS%20package%20to%20the%20external%20product%20ontology.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Eigenschaft rdfs:seeAlso MUSS die Instanz der Produktvariante im iiRDS-Paket mit der externen Produktontologie in Beziehung setzen.",
            "en": "The property rdfs:seeAlso MUST relate the instance of the product variant in the iiRDS package to the external product ontology. "
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS -> wie testen?
    },

    //6.8 Administrative Metadata

    //6.8.1 Complex Identity
    {
        id: "M30",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Identity-Instanz besteht aus zwei Teilen: dem Wert und der Domäne. Der Wert MUSS als nicht leerer String in der Eigenschaft iirds:identifier angegeben werden. Eine Identität MUSS durch die Eigenschaft iirds:has-identity-domain auf genau eine Domäne verweisen. Die Domäne ist eine Instanz der Klasse iirdsIdentityDomain.",
            "en": "An iirds:Identity instance consists of two parts: the value and the domain. The value MUST be provided as a non-empty string in the iirds:identifier property. An identity MUST point to exactly one domain by the iirds:has-identity-domain property. The domain is an instance of the iirdsIdentityDomain class."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M31",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20class%20iirds%3AIdentityDomain%20MUST%20have%20an%20absolute%20IRI",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:IdentityDomain MÜSSEN einen absoluten IRI haben.",
            "en": "Instances of class iirds:IdentityDomain MUST have an absolute IRI."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },


    //6.8.2 Content Lifecycle Status
    {
        id: "M32",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AContentLifecyleStatus%20MUST%20have%20an%20iirds%3AContentLifecyleStatusValue%20which%20is%20assigned%20by%20the%20iirds%3Ahas%2Dcontent%2Dlifecycle%2Dstatus%2Dvalue%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iirds:ContentLifecyleStatus MUSS einen iirds:ContentLifecyleStatusValue haben, der von der Eigenschaft iirds:has-content-lifecycle-status-value zugewiesen wird.",
            "en": "An iirds:ContentLifecyleStatus MUST have an iirds:ContentLifecyleStatusValue which is assigned by the iirds:has-content-lifecycle-status-value property."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },


    //6.8.3 Parties and Roles
    {
        id: "M33",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AParty%20MUST%20have%20a%20related%20iirds%3APartyRole%20that%20is%20assigned%20by%20the%20property%20iirds%3Ahas%2Dparty%2Drole%2C%20such%20as%20author%2C%20supplier%20or%20manufacturer.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Party MUSS eine zugehörige iirds:PartyRole haben, die von der Eigenschaft iirds:has-party-role zugewiesen wird, wie z. B. Autor, Lieferant oder Hersteller.",
            "en": "An iirds:Party MUST have a related iirds:PartyRole that is assigned by the property iirds:has-party-role, such as author, supplier or manufacturer."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M34",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20addition%20to%20the%20role%2C%20an%20iirds%3AParty%20MUST%20also%20have%20an%20associated%20description%20of%20itself%20as%20compliant%20vcard%3Akind%20object%20which%20is%20assigned%20via%20iirds%3Arelates%2Dto%2Dvcard.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Zusätzlich zur Rolle MUSS eine iirds:Party auch eine zugehörige Beschreibung von sich selbst als konformes vcard:kind-Objekt haben, die über iirds:relates-to-vcard zugewiesen wird.",
            "en": "In addition to the role, an iirds:Party MUST also have an associated description of itself as compliant vcard:kind object which is assigned via iirds:relates-to-vcard."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.9.1 Directory Nodes
    {
        id: "M35",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Navigation%20sequences%20and%20hierarchies%20of%20InformationUnits%20MUST%20be%20modeled%20as%20linked%20lists%20of%20instances%20of%20the%20class%20iirds%3ADirectoryNode.%20In%20a%20linked%20list%2C%20an%20iirds%3ADirectoryNode%20references%20the%20following%20node%20by%20the%20property%20iirds%3Ahas%2Dnext%2Dsibling.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Navigationsabläufe und Hierarchien von InformationUnits MÜSSEN als verkettete Listen von Instanzen der Klasse iirds:DirectoryNode modelliert werden. In einer verknüpften Liste verweist ein iirds:DirectoryNode auf den folgenden Knoten durch die Eigenschaft iirds:has-next-sibling.",
            "en": "Navigation sequences and hierarchies of InformationUnits MUST be modeled as linked lists of instances of the class iirds:DirectoryNode. In a linked list, an iirds:DirectoryNode references the following node by the property iirds:has-next-sibling."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M36",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20model%20closed%20lists%2C%20the%20last%20node%20in%20a%20list%20level%20MUST%20have%20the%20property%20iirds%3Ahas%2Dnext%2Dsibling%20relating%20to%20an%20instance%20of%20the%20class%20iirds%3Anil.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um geschlossene Listen zu modellieren, MUSS der letzte Knoten in einer Listenebene die Eigenschaft iirds:has-next-sibling haben, die sich auf eine Instanz der Klasse iirds:nil bezieht.",
            "en": "To model closed lists, the last node in a list level MUST have the property iirds:has-next-sibling relating to an instance of the class iirds:nil."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M37",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20property%20iirds%3Ahas%2Ddirectory%2Dstructure%2Dtype%20determines%20the%20type%20of%20the%20directory%20structure.%20The%20root%20node%20of%20a%20directory%20structure%20MUST%20have%20one%20property%20iirds%3Ahas%2Ddirectory%2Dstructure%2Dtype.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Eigenschaft iirds:has-directory-structure-type bestimmt den Typ der Verzeichnisstruktur. Der Wurzelknoten einer Verzeichnisstruktur MUSS eine Eigenschaft haben: iirds:has-directory-structure-type.",
            "en": "The property iirds:has-directory-structure-type determines the type of the directory structure. The root node of a directory structure MUST have one property iirds:has-directory-structure-type."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M38",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Only%20root%20nodes%20of%20a%20directory%20structure%20MUST%20have%20the%20property%20iirds%3Ahas%2Ddirectory%2Dstructure%2Dtype.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nur Wurzelknoten einer Verzeichnisstruktur MÜSSEN die Eigenschaft iirds:has-directory-structure-type haben.",
            "en": "Only root nodes of a directory structure MUST have the property iirds:has-directory-structure-type."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //6.9.2 Hierarchical Navigation
    {
        id: "M39",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20model%20hierarchy%20levels%20in%20the%20navigation%20structure%2C%20an%20iirds%3ADirectoryNode%20instance%20MUST%20reference%20an%20iirds%3ADirectoryNode%20instance%20on%20the%20next%20lower%20level%20by%20the%20property%20iirds%3Ahas%2Dfirst%2Dchild.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um Hierarchieebenen in der Navigationsstruktur zu modellieren, MUSS eine iirds:DirectoryNode-Instanz eine iirds:DirectoryNode-Instanz auf der nächstniedrigeren Ebene durch die Eigenschaft iirds:has-first-child referenzieren.",
            "en": "To model hierarchy levels in the navigation structure, an iirds:DirectoryNode instance MUST reference an iirds:DirectoryNode instance on the next lower level by the property iirds:has-first-child."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M40",
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
        //COMMENTS
    },

    //7.1 iiRDS Extension Scenarios
    {
        id: "M41",
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
        //COMMENTS
    },
    {
        id: "M42",
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
        //COMMENTS
    },
    {
        id: "M43",
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
        //COMMENTS
    },

    //7.3 Proprietary iiRDS Extensions
    {
        id: "M44",
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
        //COMMENTS
        /*
        Proprietary classes, instances, and properties are registered to the namespace of the defining party.
        The defining party provides the proprietary iiRDS extension to other parties if said other parties are expected to process the proprietary classes and instances.
        Proprietary classes are subclasses or equivalent classes of existing iiRDS classes.
        Proprietary instances are instances of existing iiRDS classes or subclasses. Proprietary instances MAY also be instances of a proprietary class.
        Proprietary properties are sub-properties of existing properties.
        */
    },
    {
        id: "M45",
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
        //COMMENTS
    },

    //7.3.1 Adding a Proprietary Instance

    //7.3.2 Adding a Proprietary Class

    //7.3.3 Adding a Proprietary Property
    {
        id: "M46",
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
        //COMMENTS
    },

    //8.1 Unrestricted iiRDS vs. iiRDS/A
    {
        id: "M47",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20unrestricted%20iiRDS%20package%20MAY%20include%20any%20kind%20of%20content%20files.%20An%20iiRDS/A%20package%20MUST%20only%20include%20content%20files%20with%20a%20restricted%20set%20of%20formats.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein uneingeschränktes iiRDS-Paket KANN jede Art von Inhaltsdateien enthalten. Ein iiRDS/A-Paket DARF nur Inhaltsdateien mit einem eingeschränkten Satz von Formaten enthalten.",
            "en": "An unrestricted iiRDS package MAY include any kind of content files. An iiRDS/A package MUST only include content files with a restricted set of formats."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    //==============================================================
    /*An iiRDS/A package MUST fulfill all of the following criteria:
    The package only contains content files in formats that comply with iiRDS/A.
    The property iirds:formatRestriction of the iiRDS package is set to A.
    The package is self-contained.
    */
    {
        id: "M48",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20package%20only%20contains%20content%20files%20in%20formats%20that%20comply%20with%20iiRDS/A.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS/A-Paket MUSS die folgenden Kriterien erfüllen: Das Paket enthält nur Inhaltsdateien in Formaten, die iiRDS/A entsprechen.",
            "en": "An iiRDS/A package MUST fulfill the following criteria: The package only contains content files in formats that comply with iiRDS/A."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS

    },
    {
        id: "M49",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20property%20iirds%3AformatRestriction%20of%20the%20iiRDS%20package%20is%20set%20to%20A.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS/A-Paket MUSS die folgenden Kriterien erfüllen: Die Eigenschaft iirds:formatRestriction des iiRDS-Pakets ist auf A gesetzt.",
            "en": "An iiRDS/A package MUST fulfill the following criteria: The property iirds:formatRestriction of the iiRDS package is set to A."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS

    },
    {
        id: "M50",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20package%20is%20self%2Dcontained.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS/A-Paket MUSS die folgenden Kriterien erfüllen: Das Paket ist in sich abgeschlossen.",
            "en": "An iiRDS/A package MUST fulfill the following criteria: The package is self-contained."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS

    },
    //==============================================================
    {
        id: "M51",
        path: "",
        findInvalidElements: "",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iiRDS/A%20packages%20MUST%20NOT%20nest%20unrestricted%20iiRDS%20packages.",
        version: ["V1.1"],
        rule: {
            "de": "iiRDS/A-Pakete DÜRFEN NICHT uneingeschränkte iiRDS-Pakete verschachteln.",
            "en": "iiRDS/A packages MUST NOT nest unrestricted iiRDS packages."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //8.2 Self-contained iiRDS/A Packages

    /*
    An iiRDS package is self-contained if all URIs used in the iiRDS XHTML5 files point to local resources contained in the package except for the following cross-reference mechanisms:
    attribute href
    references attribute id on element a
    references attribute id on element area
    references attribute id on element link
    attribute cite
    references attribute id on element q
    iiRDS Consumers MAY omit these cross-references, e.g. if there is no internet access, and the content MUST be still consumable.
    */
    {
        id: "M52",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iiRDS%20Consumers%20MAY%20omit%20these%20cross%2Dreferences%2C%20e.g.%20if%20there%20is%20no%20internet%20access%2C%20and%20the%20content%20MUST%20be%20still%20consumable.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS-Verbraucher KÖNNEN diese Querverweise weglassen, z. wenn kein Internetzugang besteht und die Inhalte dennoch konsumierbar sein MÜSSEN.",
            "en": "iiRDS Consumers MAY omit these cross-references, e.g. if there is no internet access, and the content MUST be still consumable."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //9. iiRDS/A Media Formats
    {
        id: "M53",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Media%20in%20iiRDS/A%20packages%20MUST%20use%20the%20formats%20listed%20in%20this%20section.%20An%20unrestricted%20iiRDS%20package%20uses%20any%20media%20format.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Medien in iiRDS/A-Paketen MÜSSEN die in diesem Abschnitt aufgeführten Formate verwenden. Ein uneingeschränktes iiRDS-Paket verwendet ein beliebiges Medienformat.",
            "en": "Media in iiRDS/A packages MUST use the formats listed in this section. An unrestricted iiRDS package uses any media format."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //Structured textual content MUST be encoded as iiRDS XHTML5. The file extension MUST be .xhtml.
    {
        id: "M54",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Structured%20textual%20content%20MAY%20be%20encoded%20as%20PDF/A%2D3%20(ISO%2019005%2D3%3A2012).%20Non%2Dstructured%20textual%20content%20MUST%20be%20encoded%20this%20way.%20The%20file%20extension%20MUST%20be%20.pdf.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Strukturierte Textinhalte KÖNNEN als PDF/A-3 (ISO 19005-3:2012) kodiert werden. Nicht strukturierte Textinhalte MÜSSEN auf diese Weise codiert werden. Die Dateierweiterung MUSS .pdf sein.",
            "en": "Structured textual content MAY be encoded as PDF/A-3 (ISO 19005-3:2012). Non-structured textual content MUST be encoded this way. The file extension MUST be .pdf."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //9.2.1 Raster Formats
    {
        id: "M55",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Raster%20graphics%20MUST,.jpg.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Rastergrafiken MÜSSEN als .jpg oder .png kodiert sein.",
            "en": "Raster graphics MUST be encoded as .jpg or .png."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    //9.2.2 Vector Formats
    //Only static language features of SVG that correspond to the feature string http://www.w3.org/TR/SVG11/feature#SVG-static MUST be used.
    {
        id: "M56",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Only%20static%20language%20features%20of%20SVG%20that%20correspond%20to%20the%20feature%20string%20http%3A//www.w3.org/TR/SVG11/feature%23SVG%2Dstatic%20MUST%20be%20used.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nur statische Sprachfeatures von SVG, die dem Feature-String http://www.w3.org/TR/SVG11/feature entsprechen",
            "en": "Only static language features of SVG that correspond to the feature string http://www.w3.org/TR/SVG11/feature#SVG-static MUST be used."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M57",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=All%20linked%20resources%20(e.g.%20CSS%2C%20graphics%2C%20fonts)%20MUST%20be%20included%20in%20the%20iiRDS/A%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Alle verlinkten Ressourcen (z. B. CSS, Grafiken, Schriftarten) MÜSSEN im iiRDS/A-Paket enthalten sein.",
            "en": "All linked resources (e.g. CSS, graphics, fonts) MUST be included in the iiRDS/A package."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M58",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Only%20JPG%20and%20PNG%20graphics%20according%20to%20this%20section%20MUST%20be%20used.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es dürfen nur JPG- und PNG-Grafiken gemäß diesem Abschnitt verwendet werden.",
            "en": "Only JPG and PNG graphics according to this section MUST be used."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M59",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Reference%20to%20SVG%20media%20in%20iiRDS%20XHTML5%20MUST%20use%20%3Cimg%20src%3D%22%5Bfilename%5D%22/%3E.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Verweise auf SVG-Medien in iiRDS XHTML5 MÜSSEN <img src='[filename]'/> verwenden.",
            "en": "Reference to SVG media in iiRDS XHTML5 MUST use <img src='[filename]'/>."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //10.1 Overview
    {
        id: "M60",
        path: "",
        findInvalidElements: "",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iiRDS%20XHTML5%20MUST%20NOT%20contain%20any%20additional%20elements%20or%20attributes%20that%20do%20not%20comply%20with%20the%20XHTML5%20specification.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS XHTML5 DARF KEINE zusätzlichen Elemente oder Attribute enthalten, die nicht der XHTML5-Spezifikation entsprechen.",
            "en": "iiRDS XHTML5 MUST NOT contain any additional elements or attributes that do not comply with the XHTML5 specification."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
        //schwer zu testen?
    },
    {
        id: "M61",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iiRDS%20XHTML5%20stylesheets%20MUST%20be%20in%20CSS%20format.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS XHTML5-Stylesheets MÜSSEN im CSS-Format vorliegen.",
            "en": "iiRDS XHTML5 stylesheets MUST be in CSS format."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
        //schwer zu testen? Wie stylesheet erkennen?
    },

    //10.2 iiRDS XHTML5
    {
        id: "M62",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Wenn kein Inhaltsmodell oder Attribute explizit angegeben sind, MUSS iiRDS XHTML5 der [HTML5]-Spezifikation entsprechen.",
            "en": "If no content model or attributes are explicitly specified, then iiRDS XHTML5 MUST comply with the [HTML5] specification."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //10.3 Conformance Criteria

    //================================================================
    /*iiRDS XHTML5 content MUST fulfill all of the following criteria:
    Document properties
    It MUST be a well-formed XML document. See https://www.w3.org/TR/REC-xml/#sec-well-formed for details.
    It MUST be an HTML5 document that conforms to the XHTML syntax. See https://www.w3.org/TR/2014/REC-html5-20141028/the-xhtml-syntax.html#the-xhtml-syntax for details.
    It MUST use only iiRDS-compliant HTML elements listed in this specification.
    File properties
    The iiRDS XHTML5 content filename MUST use the file extension .xhtml.
    */
    {
        id: "M63",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20MUST%20be%20a%20well%2Dformed%20XML%20document.%20See%20https%3A//www.w3.org/TR/REC%2Dxml/%23sec%2Dwell%2Dformed%20for%20details.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS XHTML5-Inhalt MUSS alle folgenden Kriterien erfüllen: Es MUSS ein wohlgeformtes XML-Dokument sein. Siehe https://www.w3.org/TR/REC-xml/",
            "en": "iiRDS XHTML5 content MUST fulfill all of the following criteria: It MUST be a well-formed XML document. See https://www.w3.org/TR/REC-xml/#sec-well-formed for details."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M64",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20MUST%20be%20an%20HTML5%20document%20that%20conforms%20to%20the%20XHTML%20syntax.%20See%20https%3A//www.w3.org/TR/2014/REC%2Dhtml5%2D20141028/the%2Dxhtml%2Dsyntax.html%23the%2Dxhtml%2Dsyntax%20for%20details.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS XHTML5-Inhalt MUSS alle folgenden Kriterien erfüllen: Es MUSS ein HTML5-Dokument sein, das der XHTML-Syntax entspricht. Siehe https://www.w3.org/TR/2014/REC-html5-20141028/the-xhtml-syntax.html",
            "en": "iiRDS XHTML5 content MUST fulfill all of the following criteria: It MUST be an HTML5 document that conforms to the XHTML syntax. See https://www.w3.org/TR/2014/REC-html5-20141028/the-xhtml-syntax.html#the-xhtml-syntax for details."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M65",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20MUST%20use%20only%20iiRDS%2Dcompliant%20HTML%20elements%20listed%20in%20this%20specification.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es MUSS nur iiRDS-kompatible HTML-Elemente verwenden, die in dieser Spezifikation aufgeführt sind.",
            "en": "It MUST use only iiRDS-compliant HTML elements listed in this specification."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M66",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20iiRDS%20XHTML5%20content%20filename%20MUST%20use%20the%20file%20extension%20.xhtml.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der Dateiname des iiRDS-XHTML5-Inhalts MUSS die Dateierweiterung .xhtml verwenden.",
            "en": "The iiRDS XHTML5 content filename MUST use the file extension .xhtml."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    //================================================================

    //10.4 Global Attributes

    //Only the following subset of 'Global attributes' from the HTML5 specification (https://www.w3.org/TR/html5/dom.html#global-attributes) MUST be used in iiRDS XHTML5 elements:
    {
        id: "M67",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die HTML5-Spezifikation für das Attribut „Klasse“ weist darauf hin, dass „Autoren ermutigt werden, Werte zu verwenden, die die Art des Inhalts beschreiben, und nicht Werte, die die gewünschte Präsentation des Inhalts beschreiben“. Im Gegensatz dazu DARF die Klasse in iiRDS XHTML5 nur für das Styling verwendet werden. Ein iiRDS-XHTML5-Consumer MUSS in der Lage sein, Klassenwerte ohne Bedeutungsverlust zu ignorieren oder zu ändern.",
            "en": "The HTML5 specification for the attribute 'class' points out that 'authors are encouraged to use values that describe the nature of the content, rather than values that describe the desired presentation of the content.' In contrast, class in iiRDS XHTML5 MUST only be used for styling. An iiRDS XHTML5 consumer MUST be able to ignore or modify class values without loss of meaning."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
        //schwer zu testen
    },

    //10.5 Elements
    {
        id: "M68",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Attributes%3A%20Only%20global%20attributes%20and%20element%2Dspecific%20attributes%20specified%20in%20the%20iiRDS%20XHTML5%20specification%20MUST%20be%20used.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Attribute: Es MÜSSEN nur globale Attribute und elementspezifische Attribute verwendet werden, die in der iiRDS XHTML5-Spezifikation angegeben sind.",
            "en": "Attributes: Only global attributes and element-specific attributes specified in the iiRDS XHTML5 specification MUST be used."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
        //schwer zu testen?
    },

    //10.5.2 Document Metadata
    {
        id: "M69",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20element%20%3Clink%3E%20MUST%20be%20used%20only%20with%20the%20content%20attribute%20rel%3D%22stylesheet%22.%20Link%20types%20are%20always%20ASCII%20case%2Dinsensitive%20and%20MUST%20be%20compared%20as%20such.%20Relations%20usually%20represented%20by%20the%20element%20%3Clink%3E%20in%20HTML%20MUST%20be%20expressed%20by%20means%20of%20RDF%20in%20iiRDS.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Das Element <link> DARF nur mit dem Inhaltsattribut rel='stylesheet' verwendet werden. Link-Typen sind immer ASCII case-insensitive und MÜSSEN als solche verglichen werden. Beziehungen, die normalerweise durch das Element <link> in HTML dargestellt werden, MÜSSEN mittels RDF in iiRDS ausgedrückt werden.",
            "en": "The element <link> MUST be used only with the content attribute rel='stylesheet'. Link types are always ASCII case-insensitive and MUST be compared as such. Relations usually represented by the element <link> in HTML MUST be expressed by means of RDF in iiRDS."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //10.5.11 SVG, MathML and IFrames
    {
        id: "M70",
        path: "",
        findInvalidElements: "",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20elements%20%3Csvg%3E%2C%20%3Cmath%3E%20and%20%3Ciframe%3E%20MUST%20NOT%20be%20used%20in%20iiRDS%20XHTML5%20content.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Elemente <svg>, <math> und <iframe> DÜRFEN NICHT in iiRDS XHTML5-Inhalten verwendet werden.",
            "en": "The elements <svg>, <math> and <iframe> MUST NOT be used in iiRDS XHTML5 content."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //10.6 Additional Semantic Tagging of Content
    {
        id: "M71",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20attribute%20data%2Drole%20on%20HTML5%20elements%20MAY%20express%20semantics%20of%20elements.%20Tagging%20with%20data%2Drole%20MUST%20only%20be%20used%20with%20hazard%20statements.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Das Attribut data-role auf HTML5-Elementen KANN die Semantik von Elementen ausdrücken. Kennzeichnung mit Datenrolle DARF nur mit Gefahrenhinweisen verwendet werden.",
            "en": "The attribute data-role on HTML5 elements MAY express semantics of elements. Tagging with data-role MUST only be used with hazard statements."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M72",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=If%20an%20iiRDS%20package%20contains%20content%20with%20hazard%20statements%2C%20then%20the%20iiRDS%20package%20MUST%20always%20provide%20the%20applicable%20safety%20alert%20symbols%20and%20signal%20words.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Wenn ein iiRDS-Paket Inhalte mit Gefahrenhinweisen enthält, MUSS das iiRDS-Paket immer die zutreffenden Sicherheitswarnsymbole und Signalwörter enthalten.",
            "en": "If an iiRDS package contains content with hazard statements, then the iiRDS package MUST always provide the applicable safety alert symbols and signal words."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M73",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20data%2Drole%20attribute%20MUST%20be%20used%20only%20in%20the%20situations%20described%20here.%20The%20attribute%20values%20given%20in%20the%20following%20table%20MUST%20be%20used.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Das Datenrollenattribut DARF nur in den hier beschriebenen Situationen verwendet werden. Die in der folgenden Tabelle angegebenen Attributwerte MÜSSEN verwendet werden.",
            "en": "The data-role attribute MUST be used only in the situations described here. The attribute values given in the following table MUST be used."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M74",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20img%20element%20MUST%20be%20a%20child%20of%20the%20signal%20word%20panel.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Das img-Element MUSS ein untergeordnetes Element des Signalwort-Panels sein.",
            "en": "The img element MUST be a child of the signal word panel."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    {
        id: "M75",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Only%20one%20safety%20alert%20symbol%20MUST%20be%20included.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es darf nur ein Sicherheitswarnsymbol enthalten sein.",
            "en": "Only one safety alert symbol MUST be included."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //10.7 Styling

    {
        //out of scope
        path: "",
        findInvalidElements: "",
        prio: "RECOMMENDED",
        rule: {
            "de": "iiRDS XHTML5 ist als Austauschformat für strukturierte Inhalte konzipiert. iiRDS-Verbrauchern wird EMPFOHLEN, iiRDS-XHTML5-Inhalte vorzuverarbeiten, bevor sie angezeigt werden.",
            "en": "iiRDS XHTML5 is designed as an exchange format for structured content. It is RECOMMENDED for iiRDS Consumers to pre-process iiRDS XHTML5 content before displaying it."
        },
    },
    {
        //out of scope
        path: "",
        findInvalidElements: "",
        prio: "MUST NOT",
        rule: {
            "de": "Ein zusätzliches CSS-Stylesheet DARF enthalten sein, aber die Inhaltsverarbeitung DARF NICHT auf dem Stylesheet beruhen. Es ist nicht spezifiziert, wie begleitende CSS-Stylesheets und Zielsystem-CSS-Stylesheets vernetzt werden.",
            "en": "An additional CSS stylesheet MAY be included, but content processing MUST NOT rely on the stylesheet. It is not specified how to mesh up accompanying CSS stylesheets and target-system CSS stylesheets."
        },
    },

    //0..1  iirds:relates-to-party property - iirds:Party

    //===================iirds:Identity
    {
        id: "M76",
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
        //COMMENTS
        //Signalwort MUST hier false positive?
    },
    {
        //iirds:Identity -> Properties:	1  iirds:identifier
        id: "M77",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=1%C2%A0%20iirds%3Aidentifier%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:identifier haben",
            "en": "iirds:Identity MUST have property iirds:identifier"
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },
    {
        //iirds:Identity -> Properties:	1  iirds:has-identity-domain
        id: "M78",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-identity-domain:~:text=1%C2%A0%20iirds%3Ahas%2Didentity%2Ddomain%20property%20%2D%20iirds%3AIdentityDomain",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:IdentityDomain haben",
            "en": "iirds:Identity MUST have property iirds:IdentityDomain"
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
    },

    //===================

    //0..⃰  iirds:relates-to-supply properties - iirds:Supply

    //0..1  iirds:relates-to-vcard property - http://www.w3.org/2006/vcard/ns#Kind

    //0..1  iirds:relates-to-party property - iirds:Party


    //0..1  iirds:has-selector property - iirds:Selector

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
        id: "M79",
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_Identity:~:text=Description%3A-,A%20range%20selector%20MUST%20reference%20one%20start%20and%20one%20end%20selector.,-iirds%3Ahas%2Devent%2Dcode",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Beschreibung: Ein Bereichsselektor MUSS auf einen Start- und einen Endselektor verweisen.",
            "en": "Description:	A range selector MUST reference one start and one end selector."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
        //COMMENTS
        //vgl. 15
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
        //out of scope / signal words false positive?
        path: "",
        findInvalidElements: "",
        prio: "MUST",
        rule: {
            "de": "Definition: Enthält allgemeine sicherheitsbezogene Informationen des Herstellers, die bei Montage, Betrieb, Wartung, Reparatur und Demontage des Produkts berücksichtigt werden MÜSSEN. In den Aufgaben werden Sicherheitshinweise zu einzelnen Aufgaben gegeben.",
            "en": "Definition:	Contains general safety-related information provided by the manufacturer that MUST be considered during assembly, operation, maintenance, repair, and disassembly of the product. Safety information related to individual tasks is provided in the tasks."
        },
    },
    {
        id: "M80",
        path: "Document, Component, Concept, ContentLifeCycleStatusValue, DirectoryNodeType, DocumentType, Event, Form, Formality, Fragment, Functionality, IdentityDomain, IdentityType, InformationObject, Learning, Package, Party, PartyRole, Process, ProductFunction, ProductProperty, ProductVariant, Reference, Role, Safety, SkillLevel, Supply, Task, TechnicalData, TechnicalOverview, Topic, TopicType, Troubleshooting, Use, WarningMessage, ConsumableSupply, HardwareTool, Lubricant, OperatingSupply, ProtectiveEquipment, SparePart",
        findInvalidElements: (els => !els.length) && (els => els.every(el => el.hasAttribute(
            "rdf:about"))) && (els => els.every(el => el.getAttribute("rdf:about") != "")),
        prio: "REQUIRED",
        spec: "",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_fail_IRI required.rdf"]
        }
        //COMMENTS
        //1. Sprint Review -> REQUIRED = false positive?
        /* Alle Elemente mit IRI=REQUIRED / Alle Elemente, die Attribute rdf:about haben müssen

        Liste der Elemente:
        Document, #AfterUse, #Collection, Component, Concept, #Conformity, ContentLifeCycleStatusValue, #DesignAndRealization, DirectoryNodeType, DocumentType, Event, Form, Formality, Fragment, Functionality, IdentityDomain, IdentityType, InformationObject, #InformationSubject, #InformationType, Learning, Package, Party, PartyRole, Process, #ProductFeature, ProductFunction, #ProductLifeCyclePhase, #ProductMetadata, ProductProperty, ProductVariant, #PuttingToUse, #Qualification, Reference, Role, Safety, SkillLevel, Supply, Task, TechnicalData, TechnicalOverview, Topic, TopicType, Troubleshooting, Use, WarningMessage, ConsumableSupply, HardwareTool, Lubricant, OperatingSupply, ProtectiveEquipment, SparePart

        iiRDS RDF Schema Reference
        Only use subclass:

        (InformationUnit, Not intended to be used directly. Use the subclasses Package, Document, Topic, and Fragment instead.) vgl. M1

        */
    },
    /*{
        //IRI: Optional
        id: "",
        path: "ContentLifeCycleStatus, DirectoryNode, DownTime, FragmentSelector, Identity, MaintenanceInterval, RangeSelector, Rendition, Selector, WorkingTime, SetupTime",
        findInvalidElements: (els => els.length != 0) && (els => els.some(el => el.hasAttribute("rdf:about"))),
        prio: "OPTIONAL",
        spec: "",
        version: ["V1.0","V1.0.1","V1.1"],
        rule: {
            "de": "...,",
            "en": "IRI: OPTIONAL"
        },
        testfiles: {"true": [""], "false": [""]}
        //COMMENTS
    },*/
    //iiRDS RDF Schema Reference
    {
        id: "M81",
        path: "AfterUse",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=use%20of%20the%20product.-,Description%3A,-Not%20intended%20to%20be",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M82",
        path: "Collection",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Not%20intented%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.%20For%20collection%20subjects%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Sammlungsthemen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intented to be used directly. Use the subclasses instead. For collection subjects not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M83",
        path: "Conformity",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.%20For%20information%20subjects%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Informationsthemen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For information subjects not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M84",
        path: "DesignAndRealization",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=of%20a%20product.-,Description%3A,phases%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M85",
        path: "DocumentationMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3ADocumentType",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M86",
        path: "FunctionalMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3AIdentity",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M87",
        path: "iirdsDomainEntity",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M88",
        path: "AdministrativeMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3AAfterUse",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M89",
        path: "InformationSubject",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intented%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intented to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M90",
        path: "InformationType",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intented%20to%20be%20used%20directly.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.",
            "en": "Not intented to be used directly."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M91",
        path: "PlanningTime",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=specific%20working%20tasks.-,Description%3A,-Not%20intended%20to",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M92",
        path: "ProductFeature",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=functions%20of%20a%20product%20or%20component.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M93",
        path: "ProductLifeCyclePhase",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=MAY%20refer%20to.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M94",
        path: "ProductMetadata",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=product%2Drelated%20metadata.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M95",
        path: "PuttingToUse",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=system%20to%20use.-,Description%3A,phases%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen. Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M96",
        path: "Qualification",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=roles%20REQUIRED%20for%20working%20tasks%20described%20in%20technical%20documentation.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },
    {
        id: "M97",
        path: "relates-to-administrative-metadata",
        findInvalidElements: els => els,
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_relates-to-administrative-metadata:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3Arelates%2Dto%2Dcomponent",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt. Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },


    //Classes -> properties with cardinality

    //iirds:Component (see example 34)
    {
        id: "M98",
        path: "Component",
        findInvalidElements: "",
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_ProductMetadata:~:text=identity%20properties%20%2D%20iirds%3AIdentity-,0..1%C2%A0%20iirds%3Arelates%2Dto%2Dparty%20property%20%2D%20iirds%3AParty,-iirds%3AConcept",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Component DARF NICHT mehr als 1 Eigenschaft iirds:relates-to-party haben",
            "en": "iirds:Component MUST NOT have more than 1 property iirds:relates-to-party"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf"],
            "false": [""]
        }
        //COMMENTS
    },






    //iiRDS RDF Schema Reference -> A.4 Properties and Relations Overview
];