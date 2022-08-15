const ABSOLUTE_IRI_REGEX = /(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/;
const iri_absolute_regex = /'^(?:[a-z]+:)?\/\/'/;

// const meineEveryFunc = el => !ABSOLUTE_IRI_REGEX.test(el.textContent);

// const meineGenFunc = (el, attr) => el.getAttribute(attr)?.length === ?;
const mustNotBeABlankNode = el => el.childElementCount === 0;
const mustNotHaveChild = child => el => el.querySelectorAll(child).length === 0;
const mustHaveChild = child => el => el.querySelectorAll(child).length === 1;
const includesAll = (small, big) => small.every(n => big.indexOf(n) !== -1);

export default [
    //1. Conformance

    //5. iiRDS Package and Container

    //5.1 iiRDS Container

    //5.1.1 Metadata Location

    //5.1.2 Content Location

    //5.1.3 Names of Files and Directories

    //5.2 iiRDS ZIP Archive

    //5.2.2 Content Encoding

    //5.3 Nested iiRDS Packages

    //6.2 Information Units

    {path: "InformationUnit",
        assert: els => els.length === 0,
        prio: "MUST",
        rule: {
            "de": "Dokument muss ein referenziertes Objekt haben",
            "en": "Document must have a referenced object"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/01_iirds_version_not_x.xml"],
            "false": ["./tests/files/util/iirds-validation/01_io.xml"]
        }
    },
    {
        path: "Document, Topic, Fragment, Package",
        assert: els => els.every(el => el.hasAttribute("rdf:about")),
        prio: "MUST",
        rule: {
            "de": "iiRDS-Ersteller DÜRFEN NICHT die Klasse iirds:InformationUnit direkt verwenden, sondern MÜSSEN eine der Unterklassen benutzen",
            "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
        }
    },
    {
        path: "Document, Topic, Fragment, Package",
        //assert: els => els.every(mustNotBeABlankNode), // el => meineGenFunc(el, "rdf:about")), //el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about").length),
        //not a blank node -> Array.from(document.querySelectorAll("Document, Topic, Fragment, Package")).every(el => el.childElementCount !== 0)
        //subclass of IU must have IRI -> Array.from(document.querySelectorAll("Document, Topic, Fragment, Package")).every(el => el.hasAttribute("rdf:about"))
        assert: els => els.every((el => el.childElementCount !== 0 && el.hasAttribute("rdf:about"))),
        prio: "MUST",
        rule: {
            "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse MUSS einen IRI haben und DARF KEIN leerer Knoten sein.",
            "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI and MUST NOT be a blank node."
        }
    },
    {
        path: "Package",
        assert: els => els.length === 1,
        prio: "MUST",
        rule: {
            "de": "Jedes iiRDS-Paket MUSS genau eine entsprechende iirds:Paket-Instanz in den Metadaten haben.",
            "en": "Each iiRDS package MUST have exactly one corresponding iirds:Package instance in the metadata."
        }
    },
    {
        path: "Document, Topic, Fragment, Package",
        //tbd - 001 - Regelverletzung schwer zu prüfen /
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Information units MAY point to the package that they belong to with the property iirds:is-part-of-package. "
        }
    },
    {
        status: "working",
        path: "Package",
        //Die Paket-Instanz / Element "Package" DARF KEIN Kindelement "is-part-of-package" besitzen
        //Array.from(document.querySelectorAll("Package")).every(el => el.querySelectorAll("is-part-of-package").length === 0)
        //getestet mit Funktion "validate"
        assert: els => els.every(el => el.querySelectorAll("is-part-of-package").length === 0),
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "The corresponding iirds:Package instance of an iiRDS package MUST NOT be a member of another iiRDS package expressed by the property iirds:is-part-of-package."
        }
    },
    {
        path: "Document, Topic, Fragment",
        //tbd - 003 -
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "iirds:Document, iirds:Topic, and iirds:Fragment MAY refer to a physical file or a part of a file in the iiRDS package. But iirds:Document, iirds:Topic, and iirds:Fragment MAY also model abstract entities without a physical file in the iiRDS package."
        }
    },
    //6.2.1 InformationUnit Identifier
    {
        status: "not working correctly - ",
        path: "*",
        //tbd - 004 - Problem: wie filtert man nach Attributen, anstatt Elementen?
        //Array.from(document.querySelectorAll("*")).filter(e => e.hasAttribute("rdf:about")),
        //assert: el => el.,
        //Array.from(document.querySelectorAll("*")).filter(e => e.hasAttribute("rdf:about")).every(el => !/(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/.test(el.textContent))
        //document.querySelector("Package").getAttribute("rdf:about")
        //Array.from(document.querySelectorAll("*")).filter(e => e.hasAttribute("rdf:about"))
        //document.querySelector("Package").getAttribute("rdf:about") === ""

        //Prüfung auf konkreten Wert scheint zu funktionieren: (Array.from(document.querySelectorAll("*")).filter(el => el.hasAttribute("rdf:about"))).some(el => el.getAttribute("rdf:about") === "urn:uuid:307ff804-62b0-4b82-ad2a-26da8e8a4e9a/package")
        //andererseits scheitert Längenprüfung (undefined): (Array.from(document.querySelectorAll("*")).filter(el => el.hasAttribute("rdf:about"))).some(el => el.getAttribute("rdf:about") === "urn:uuid:307ff804-62b0-4b82-ad2a-26da8e8a4e9a/package").length

        assert: els => els.filter(el => el.hasAttribute("rdf:about")).every(el => !/(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/.test(el.textContent)),
        prio: "RECOMMENDED",
        rule: {
            "de": "...",
            "en": "It is RECOMMENDED to use absolute IRIs in rdf:about. Additionally, it is RECOMMENDED to generate IRIs as follows: Keep the IRI of rdf:about globally unique;Keep the IRI of rdf:about stable over packages and time if the IRI identifies the same subject;If the source system has a meaningful identifier such as a unique ID from the CMS, use it to generate an IRI for rdf:about"
        }
    },
    //6.2.2 Information Objects
    {
        path: "Document, Topic, Fragment, Package",
        //tbd - 005 - negativer Fall hat keine Auswirkung
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Information units MAY be related to information objects."
        }
    },
    {
        status: "",
        path: "RDF", // "Document, Topic, Fragment, Package",
        //tbd - 006 -
        //FALSCHE ANNAHME -> Wenn das Element "InformationObject" vorhanden ist, düfren InformationUnits (Document, Topic, Fragment, Package) nur maximal einmal das Kindelement "is-version-of besitzen"
        //BESSER -> Wenn "InformationObject" verwendet wird, dann muss bei jeder "InformationUnit" der Wert des Attributs "rdf:about" identisch sein mit dem Wert des Attributs "rdf:about" im Element "InformationObject"
        //Array.from(document.querySelectorAll("Topic, Document, Fragment, Package")).every(el => el.querySelectorAll("is-version-of").length <= 1)
        //assert: els => els.every(el => el.querySelectorAll("is-version-of").length >= 1),
        //Array.from(document.querySelectorAll("Document, Topic, Fragment, Package")).map(el => el.querySelector("is-version-of").getAttribute("rdf:resource"))Array.from(document.querySelectorAll("Document, Topic, Fragment, Package")).map(el => el.querySelector("is-version-of").getAttribute("rdf:resource"))
        assert: ()  => {
            // TODO: Regel hat Lauftzeitkomplexität
            const versions = Array.from(document.querySelectorAll("Document, Topic, Fragment, Package")).map(el => el.querySelector("is-version-of").getAttribute("rdf:resource"));
            const ios = Array.from(document.querySelectorAll("InformationObject")).map(el => el.getAttribute("rdf:about"));
            return includesAll(versions, ios);
        },
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "If information objects are used, each information unit MUST only be related to exactly one information object via iirds:is-version-of."
        }
    },
    {
        path: "InformationObject",
        //tbd - 007 - Informationsobjekt muss eine absolute IRI im Attribut rdf:about haben |
        //    /'^(?:[a-z]+:)?\/\/'/
        assert: () => {

            (Array.from(document.querySelectorAll("InformationObject")).map(el => el.getAttribute("rdf:about"))).every(el => /'^(?:[a-z]+:)?\/\/'/);
        },
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An information object MUST have an absolute IRI and MAY be related to additional identifications via the iirds:has-identity property."
        }

    },
    //test
    /*
    Array.from(document.querySelectorAll("InformationObject")).every(io => /(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/.test(io.hasAttribute("rdf:about")))
    */
    //test
    //6.3 Content References of Information Units
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "An iirds:InformationUnit MAY reference files in an iiRDS package by the property iirds:has-rendition."
        }
    },
    {
        path: "Package",
        //iirds:Package darf kein Kindelement vom Typ iirds:has-rendition besitzen
        assert: "",
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation."
        }
    },
    {
        path: "Rendition source",
        //Regel prüft, dass das Muster "https://" oder "www.*.*/" nicht in URI enthalten sind.
        assert: els => els.every(el => !ABSOLUTE_IRI_REGEX.test(el.textContent)),
        prio: "MUST",
        rule: {
            "de": "Die URL MUSS relativ zum Stammverzeichnis des iiRDS-Pakets sein",
            "en": "The URL MUST be relative to the root folder of the iiRDS package"
        }
    },
    {
        path: "Rendition format",
        //tbd -
        //assert: els => els.length === 1,
        //Array.from(document.querySelectorAll("Rendition format")).every(el => el.length !== 0)
        assert: Array.from(document.querySelectorAll("Rendition format")).every(el => el.length !== 0),
        prio: "MUST",
        rule: {
            "de": "",
            "en": "An iirds:Rendition MUST have the property iirds:format."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "An information unit MAY have one or more physical renditions in an iiRDS package. To reference multiple renditions, an information unit has multiple iirds:has-rendition properties. For each rendition, an information unit MAY reference the whole file or select a part or range."
        }
    },
    //6.3.1 Reference Part of File by Selector
    /*Regel 6.3.1: iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        Regel aufgeteilt in 2 Prüfungen:
            1. iirds:Rendition MUST NOT directly use iirds:Selector.
            2. iirds:Rendition MUST use one a subclasses of iirds:Selector to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
    */

    {
        //Array.from(document.querySelectorAll("Rendition")).every(el => el.querySelectorAll("Selector").length === 0)
        //Array.from(document.querySelectorAll("has-rendition Selector")).length === 0
        //TEST (expect: false): Array.from(document.querySelectorAll("has-rendition value")).length === 0
        path: "Rendition Selector",
        assert: els => els.length === 0,
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        }
    },
    //6.3.1.1 Reference Part with Single Identifier
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Depending on the file format and on the associated standard, a single identifier of a fragment selector MAY select a range in a file."
        }
    },
    //6.3.1.2 Reference Part with Start and End Identifier
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The iirds:RangeSelector points to the part of a file by a start and an end selector. The range selector MUST be used to identify a range in a file if the file format or the associated standard does not permit selecting a range directly. The range selector references the start selector and end selector by the properties iirds:has-start-selector and iirds:has-end-selector."
        }
    },
    //6.3.2 Media Files
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "If a media file is not self-contained, then it MUST be modeled as iirds:Fragment."
        },
        //version: ["1.0", "1.1"] Überlegung für Diffing
    },
    //6.3.3 Metadata of Nested iiRDS Packages
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "For each nested child iiRDS package, an iirds:Package MUST be present in the metadata of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be included in the iiRDS ZIP archive of the parent iiRDS package. The iiRDS ZIP archive of the nested package MUST be referenced by an iirds:Rendition of its iirds:Package in the metadata of the parent iiRDS package."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "In the metadata.rdf file of the parent iiRDS package, the iirds:Package of the nested child iiRDS package MUST reference exactly one iirds:Package by iirds:is-part-of-package. In the metadata.rdf file of the parent iiRDS package, the referenced parent iiRDS package MUST NOT have any outgoing iirds:is-part-of-package relations."
        }
    },
    //6.4 Relations of InformationUnits
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "iiRDS relation properties link information units with information types, documentation metadata, and administrative metadata. iirds:InformationUnit MAY use relation properties."
        }
    },
    //6.5.1 Types of Documents and Topics
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Instances of the iirds:Document class MUST have one or more relations to one of the standardized iirds:DocumentTypes defined in iirds:InformationType > iirds:DocumentType."
        }
    },
    {
        path: "",
        assert: "",
        prio: "RECOMMENDED",
        rule: {
            "de": "...",
            "en": "It is RECOMMENDED to create more than one relation to iirds:DocumentType for documents with mixed content."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "All instances of the iirds:InformationUnit subclasses MAY have one or more relations to one of the standardized topic types defined in iirds:InformationType > iirds:TopicType. iirds:TopicType MAY also be used for fragments."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Instances of the iirds:Topic and iirds:Fragment classes MAY have a relation of type iirds:applicable-for-document-type to one of the standardized document types defined in iirds:InformationType > iirds:DocumentType."
        }
    },
    //6.5.2 Information Subjects
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "The property iirds:has-subject relates an iirds:InformationUnit to an information subject. An iirds:InformationUnit MAY have multiple iirds:has-subject relations to multiple information subjects."
        }
    },
    //6.6 Documentation Metadata
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "iirds:DocumentationMetadata subclasses without further subclasses are docking points. A docking point MAY be extended by proprietary subclasses and instances to model company- or industry-specific resources."
        }
    },
    //6.6.1 Functional Metadata
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "iirds:FunctionalMetadata enables iiRDS Consumers to implement advanced content delivery scenarios. An iiRDS package MAY contain iirds:FunctionalMetadata."
        }
    },
    {
        //Wenn ein "Event" vorhanden ist, dann MUSS es die Kindelemente "eventCode" und "eventType" haben
        //TEST: Was passiert, wenn kein "Event" enthalten ist?
        //Noch nicht an konkretem Beispiel getestet
        path: "Event",
        assert: els => els.every(el => el.querySelectorAll("eventCode").length !== 0) && (els => els.every(el => el.querySelectorAll("eventType").length !== 0)),
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Instances of the iirds:Event class MUST have the following properties: iirds:eventCode and iirds:eventType. "
            //The iirds:Event class is a docking point for iiRDS Generators to link documentation content with event information code according to a standard like OPC-UA or a custom convention. The property iirds:relates-to-event links iirds:InformationUnit to iirds:Event.
        }
    },
    //6.6.2 Product Metadata
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "The subclasses iirds:ProductVariant and iirds:Component are docking points. The class iirds:ProductFeature contains the subclasses iirds:ProductProperty and iirds:ProductFunction as additional docking points. A docking point MAY be extended by proprietary subclasses and instances to model company- or industry-specific resources."
        }
    },
    //6.7 Products and Components in iiRDS
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "iiRDS models products and components as metadata for technical documentation. The metadata iirds:Component or iirds:ProductVariant MAY have a relation to the physical product or component."
        }
    },
    {
        // Das Attribut "rdf:resource" bei den Elementen "iirdf:relates-to-component" und "relates-to-product-variant" DÜRFEN NICHT den iirds-Namespace verwenden (!http://iirds.tekom.de)
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The properties iirds:relates-to-component and iirds:relates-to-product-variant relate an information unit to an instance of iirds:Component or iirds:ProductVariant. The instances MUST be part of a proprietary iiRDS extension."
        }
    },
    //6.7.1 Component Trees in the Package
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An iiRDS package MAY model a component tree. The property iirds:has-component defines part-of relations for products and their components. The component tree is a proprietary iiRDS extension, it MUST be stored in the metadata.rdf of the iiRDS package."
        }
    },
    //6.7.2 External Product Ontology
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "In addition to a component tree within a package, some parties MAY have a full-fledged external product ontology. A proprietary iiRDS extension MAY map the metadata labels in the package to the external product ontology. The product ontology MUST NOT be a proprietary iiRDS extension and MAY use a vocabulary other than RDF and RDFS."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An iiRDS package MUST NOT use an external product ontology directly. If an external product ontology is available and used in the iiRDS package, then the iiRDS package MUST also contain metadata labels as instances of iirds:Component."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "An iiRDS package with iirds:Component MAY use iirds:has-component relations to model a component tree."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "To map the component tree in the iiRDS package to the external product ontology, a mapping ontology MUST use the property rdfs:seeAlso."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "The property rdfs:seeAlso MUST relate the instance of the component in the iiRDS package to the external product ontology. The property rdfs:seeAlso MAY be part of the file metadata.rdf in the iiRDS package or part of the external product ontology."
        }
    },
    //6.7.3 Product Variants
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "iiRDS provides the class iirds:ProductVariant for extending the iiRDS vocabulary and adding proprietary product variants. As product variants are a proprietary iiRDS extension, they MUST be present in the metadata.rdf of the iiRDS package."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "To map product variants in the iiRDS package to an external product ontology, a mapping ontology MUST use the property rdfs:seeAlso."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "The property rdfs:seeAlso MUST relate the instance of the product variant in the iiRDS package to the external product ontology. The property rdfs:seeAlso MAY be part of the file metadata.rdf in the iiRDS package or part of the external product ontology. Product variants MAY have a relation iirds:has-identity to an iirds:Identity instance. The iirds:IdentityDomain of the identity instance MAY have a relation has-identity-type that indicates the type of the identifier of the product variant."
        }
    },
    //6.8 Administrative Metadata
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Administrative information is often used and stored in document management systems (DMS) or component content management systems (CCMS) for administrative purposes and MAY be added to an iiRDS entity."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Administrative metadata in iiRDS MAY be used in compliance with [IEC82045-2] and [VDI2770]. For further information, see the corresponding standard documents."
        }
    },
    //6.8.1 Complex Identity
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Instances of the iirds:Identity class are unambiguous identifications of entities in the scope of a given domain. Instances of the classes iirds:ProductVariant, iirds:Component, iirds:InformationObject, and iirds:InformationUnit MAY have iirds:has-identity relations to iirds:Identity instances."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An iirds:Identity instance consists of two parts: the value and the domain. The value MUST be provided as a non-empty string in the iirds:identifier property. An identity MUST point to exactly one domain by the iirds:has-identity-domain property. The domain is an instance of the iirdsIdentityDomain class."
        }
    },
    //----------
    {
        //Conetent split up into 3 rule sets.
        //Original text in spec V1.1: "Instances of class iirds:IdentityDomain MUST have an absolute IRI and MAY link to the custodian of the domain via the iirds:has-party property. Custodians are contained in instances of the iirds:Party class. Instances of class iirds:IdentityDomain MAY have an iirds:has-identity-type relation that specifies the type of the identities in the domain."
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Instances of class iirds:IdentityDomain MUST have an absolute IRI."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Instances of class iirds:IdentityDomain MAY link to the custodian of the domain via the iirds:has-party property. Custodians are contained in instances of the iirds:Party class."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Instances of class iirds:IdentityDomain MAY have an iirds:has-identity-type relation that specifies the type of the identities in the domain."
        }
    },
    //----------

    //6.8.2 Content Lifecycle Status
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "An iirds:InformationUnit MAY have iirds:has-content-lifecycle-status relations to one or multiple iirds:ContentLifecyleStatus instances to describe different status or status transitions in the administrative content lifecycle."
        }
    },
    //----------
    {
        //Content from spec split ut into 2 rule sets
        //Original Text: An iirds:ContentLifecyleStatus MUST have an iirds:ContentLifecyleStatusValue which is assigned by the iirds:has-content-lifecycle-status-value property. It MAY have additional associated dates or annotations.
        path: "ContentLifecyleStatus",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An iirds:ContentLifecyleStatus MUST have an iirds:ContentLifecyleStatusValue which is assigned by the iirds:has-content-lifecycle-status-value property."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "iirds:ContentLifecyleStatus MAY have additional associated dates or annotations."
        }
    },
    //----------
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "An iirds:ContentLifecyleStatus MAY also be related to an iirds:Party with a specific iirds:PartyRole. The iirds:Party indicates the performer of the status transition."
        }
    },
    //6.8.3 Parties and Roles
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "An iirds:Party MAY be assigned to any iirds:InformationUnit, iirds:ContentLifecycleStatus, iirds:Component, iirds:ProductVariant or iirds:IdentityDomain to express the relation to an associated actor with a specific role in this context."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An iirds:Party MUST have a related iirds:PartyRole that is assigned by the property iirds:has-party-role, such as author, supplier or manufacturer."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "In addition to the role, an iirds:Party MUST also have an associated description of itself as compliant vcard:kind object which is assigned via iirds:relates-to-vcard."
        }
    },
    //6.9.1 Directory Nodes
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Navigation sequences and hierarchies of InformationUnits MUST be modeled as linked lists of instances of the class iirds:DirectoryNode. In a linked list, an iirds:DirectoryNode references the following node by the property iirds:has-next-sibling. Each node of an iiRDS linked list MAY reference an iirds:InformationUnit by the property iirds:relates-to-information-unit."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "To model closed lists, the last node in a list level MUST have the property iirds:has-next-sibling relating to an instance of the class iirds:nil."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The property iirds:has-directory-structure-type determines the type of the directory structure. The root node of a directory structure MUST have one property iirds:has-directory-structure-type. Only root nodes of a directory structure MUST have the property iirds:has-directory-structure-type."
        }
    },
    //6.9.2 Hierarchical Navigation
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "To model hierarchy levels in the navigation structure, an iirds:DirectoryNode instance MUST reference an iirds:DirectoryNode instance on the next lower level by the property iirds:has-first-child. The directory node on the next lower level MUST be the first item of another linked list."
        }
    },
    //7.1 iiRDS Extension Scenarios
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Additional classes and instances MAY extend the iiRDS core vocabulary. iiRDS supports the following extension scenarios:"
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Proprietary iiRDS extensions: iiRDS supports proprietary iiRDS extensions for company-specific and project-specific instances and classes. A proprietary iiRDS extension MUST comply with the standard in order to be processible by iiRDS Consumers."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "A party that generates or processes an iiRDS package MAY combine iiRDS domains and proprietary iiRDS extensions."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "All proprietary extensions that are used in a package MUST be contained in the file metadata.rdf in the iiRDS package. The file metadata.rdf MUST NOT contain the iiRDS schema or iiRDS domain extensions."
        }
    },
    //7.3 Proprietary iiRDS Extensions
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "By using proprietary iiRDS extensions, iiRDS vocabulary MAY be extended. Proprietary iiRDS extensions contain project-specific instances, classes, and properties."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "A proprietary iiRDS extension MUST fulfill the following conditions:"
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Proprietary instances are instances of existing iiRDS classes or subclasses. Proprietary instances MAY also be instances of a proprietary class."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Proprietary iiRDS extensions MUST only use RDF and RDFS vocabulary in their extension ontology. If OWL DL is used in an additional ontology, then the ontology is not iiRDS-compliant but MAY be mapped to the iiRDS vocabulary by means of the seeAlso property. For details read section External Product Ontology."
        }
    },
    //7.3.1 Adding a Proprietary Instance
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Proprietary iiRDS extensions MAY add instances directly as an instance of an iiRDS class."
        }
    },
    //7.3.2 Adding a Proprietary Class
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Proprietary iiRDS extensions MAY add classes directly as subclasses to an iiRDS class."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Proprietary iiRDS extensions MAY add proprietary classes as equivalent classes. The property rdfs:subClassOf expresses equivalence of classes."
        }
    },
    //7.3.3 Adding a Proprietary Property
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Proprietary iiRDS extensions MAY add proprietary properties as a subproperty of an iiRDS property. Proprietary properties MUST comply with domain and range of the iiRDS property."
        }
    },
    //8.1 Unrestricted iiRDS vs. iiRDS/A
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An unrestricted iiRDS package MAY include any kind of content files. An iiRDS/A package MUST only include content files with a restricted set of formats."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "An iiRDS/A package MUST fulfill all of the following criteria::"
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "iiRDS/A packages MUST NOT nest unrestricted iiRDS packages."
        }
    },
    //8.2 Self-contained iiRDS/A Packages
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "iiRDS Consumers MAY omit these cross-references, e.g. if there is no internet access, and the content MUST be still consumable."
        }
    },
    //9. iiRDS/A Media Formats
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Media in iiRDS/A packages MUST use the formats listed in this section. An unrestricted iiRDS package uses any media format."
        }
    },
    //Structured textual content MUST be encoded as iiRDS XHTML5. The file extension MUST be .xhtml.
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Structured textual content MAY be encoded as PDF/A-3 (ISO 19005-3:2012). Non-structured textual content MUST be encoded this way. The file extension MUST be .pdf."
        }
    },
    //9.2.1 Raster Formats
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Raster graphics MUST be encoded as"
        }
    },
    //Only static language features of SVG that correspond to the feature string http://www.w3.org/TR/SVG11/feature#SVG-static MUST be used.
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "All linked resources (e.g. CSS, graphics, fonts) MUST be included in the iiRDS/A package."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Only JPG and PNG graphics according to this section MUST be used."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Reference to SVG media in iiRDS XHTML5 MUST use <img src='[filename]'/>."
        }
    },
    //10.1 Overview
    {
        path: "",
        assert: "",
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "iiRDS XHTML5 MUST NOT contain any additional elements or attributes that do not comply with the XHTML5 specification."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "iiRDS XHTML5 stylesheets MUST be in CSS format."
        }
    },
    //10.2 iiRDS XHTML5
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "If no content model or attributes are explicitly specified, then iiRDS XHTML5 MUST comply with the [HTML5] specification."
        }
    },
    //10.3 Conformance Criteria
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "iiRDS XHTML5 content MUST fulfill all of the following criteria:"
        }
    },
    //It MUST be an HTML5 document that conforms to the XHTML syntax. See https://www.w3.org/TR/2014/REC-html5-20141028/the-xhtml-syntax.html#the-xhtml-syntax for details.
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "It MUST use only iiRDS-compliant HTML elements listed in this specification."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The iiRDS XHTML5 content filename MUST use the file extension .xhtml."
        }
    },
    //10.4 Global Attributes
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Global attributes are attributes common to all HTML elements. They MAY be applied to all elements."
        }
    },
    //Only the following subset of 'Global attributes' from the HTML5 specification (https://www.w3.org/TR/html5/dom.html#global-attributes) MUST be used in iiRDS XHTML5 elements:
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The HTML5 specification for the attribute 'class' points out that 'authors are encouraged to use values that describe the nature of the content, rather than values that describe the desired presentation of the content.' In contrast, class in iiRDS XHTML5 MUST only be used for styling. An iiRDS XHTML5 consumer MUST be able to ignore or modify class values without loss of meaning."
        }
    },
    //10.5 Elements
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Attributes: Only global attributes and element-specific attributes specified in the iiRDS XHTML5 specification MUST be used."
        }
    },
    //10.5.2 Document Metadata
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The element <link> MUST be used only with the content attribute rel='stylesheet'. Link types are always ASCII case-insensitive and MUST be compared as such. Relations usually represented by the element <link> in HTML MUST be expressed by means of RDF in iiRDS."
        }
    },
    //10.5.11 SVG, MathML and IFrames
    {
        path: "",
        assert: "",
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "The elements <svg>, <math> and <iframe> MUST NOT be used in iiRDS XHTML5 content."
        }
    },
    //10.6 Additional Semantic Tagging of Content
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The attribute data-role on HTML5 elements MAY express semantics of elements. Tagging with data-role MUST only be used with hazard statements."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "If an iiRDS package contains content with hazard statements, then the iiRDS package MUST always provide the applicable safety alert symbols and signal words."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "The data-role attribute MUST be used only in the situations described here. The attribute values given in the following table MUST be used."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "safety-alert-symbol	img	Tags a safety alert symbol of a hazard statement. The img element MUST be a child of the signal word panel. Only one safety alert symbol MUST be included."
        }
    },
    //10.7 Styling
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "CSS stylesheet files MAY be referenced from the XHTML5 files for additional markup."
        }
    },
    {
        path: "",
        assert: "",
        prio: "RECOMMENDED",
        rule: {
            "de": "...",
            "en": "iiRDS XHTML5 is designed as an exchange format for structured content. It is RECOMMENDED for iiRDS Consumers to pre-process iiRDS XHTML5 content before displaying it."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST NOT",
        rule: {
            "de": "...",
            "en": "An additional CSS stylesheet MAY be included, but content processing MUST NOT rely on the stylesheet. It is not specified how to mesh up accompanying CSS stylesheets and target-system CSS stylesheets."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Components MAY have relations to other components so that iiRDS Generators can build up a simple component hierarchy with iiRDS structures. The iirds#Component MAY also be used as a docking point for external component definitions."
        }
    },
    //0..1  iirds:relates-to-party property - iirds:Party

    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Definition:	Complex identifier of an iiRDS domain entity. Each identifier MUST be related to the identity domain within which it is unambiguous."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Complex identifiers MAY be assigned to information objects, information units, product variants, and components. Typically, identities are used to provide IDs from other systems. Examples: serial numbers for components and module IDs from content management systems for topics."
        }
    },
    //0..⃰  iirds:relates-to-supply properties - iirds:Supply
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Definition:	Class of topic types for learning. Learning content MAY comprise learning plans, learning objectives, learning content details, summaries, and assessments."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Learning content MAY comprise learning plans, learning objectives, learning content details, summaries, and assessments."
        }
    },
    {
        path: "",
        assert: "",
        prio: "OPTIONAL",
        rule: {
            "de": "...",
            "en": "Description:	Instances have a maintenance frequency and an OPTIONAL maintenance duration."
        }
    },
    {
        path: "",
        assert: "",
        prio: "OPTIONAL",
        rule: {
            "de": "...",
            "en": "IRI:	OPTIONAL"
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Detailed information about a party MAY be specified in a vCard."
        }
    },
    //0..1  iirds:relates-to-vcard property - http://www.w3.org/2006/vcard/ns#Kind
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Definition:	Parent class for different types of planning time that MAY be referenced in technical documentation. Planning times describe periods of time REQUIRED for or resulting from specific working tasks."
        }
    },
    {
        path: "",
        assert: "",
        prio: "OPTIONAL",
        rule: {
            "de": "...",
            "en": "IRI:	OPTIONAL"
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Definition:	Parent class for standardized product lifecycle phases that technical documentation MAY refer to."
        }
    },
    //0..1  iirds:relates-to-party property - iirds:Party


    //0..1  iirds:has-selector property - iirds:Selector

    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Description:	Tasks provide instructions and MAY contain information on other aspects, such as requirements that MUST be fulfilled or safety instructions."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Possible types include task, learning, and concept. Information units that represent topics MAY have one or more has-topic-type properties that define the topic's information type. Topics without a has-topic-type property are generic topics, with no specific type."
        }
    },
    {
        path: "",
        assert: "",
        prio: "RECOMMENDED",
        rule: {
            "de": "...",
            "en": "Description:	RECOMMENDED best practice is to identify the resource by means of a string conforming to a formal identification system."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Description:	A range selector MUST reference one start and one end selector."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Learning content MAY comprise learning plans, learning objectives, learning content details, summaries, and assessments."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	The PlanningTime class describes different types of planning times that MAY be referenced in technical documentation, for example time REQUIRED for or resulting from specific working tasks."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Description:	Tasks provide instructions and MAY contain information on other aspects, such as requirements that MUST be fulfilled or safety instructions."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Troubleshooting information MAY comprise a description of the symptoms, the cause of the error, and a remedy for the error."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MUST",
        rule: {
            "de": "...",
            "en": "Definition:	Contains general safety-related information provided by the manufacturer that MUST be considered during assembly, operation, maintenance, repair, and disassembly of the product. Safety information related to individual tasks is provided in the tasks."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	The SparePart class describes spare parts, meaning interchangeable parts that are kept in an inventory and are used for the repair or replacement of failed units of a technical system. Spare parts MAY be referenced in the description of working tasks in technical documentation."
        }
    },
    {
        path: "",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	MAY be assembled from different information units."
        }
    },
    {
        /* Alle Elemente mit IRI=REQUIRED / Alle Elemente, die Attribute rdf:about haben müssen
        Liste der Elemente:
        Document, AfterUse, Collection, Component, Concept, Conformity, ContentLifeCycleStatusValue, DesignAndRealization, DirectoryNodeType, DocumentType, Event, Form, Formality, Fragment, Functionality, IdentityDomain, IdentityType, InformationObject, InformationSubject, InformationType, Learning, Package, Party, PartyRole, Process, ProductFeature, ProductFunction, ProductLifeCyclePhase, ProductMetadata, ProductProperty, ProductVariant, PuttingToUse, Qualification, Reference, Role, Safety, SkillLevel, Supply, Task, TechnicalData, TechnicalOverview, Topic, TopicType, Troubleshooting, Use, WarningMessage, ConsumableSupply, HardwareTool, Lubricant, OperatingSupply, ProtectiveEquipment, SparePart
        */
        path: "Document, AfterUse, Collection, Component, Concept, Conformity, ContentLifeCycleStatusValue, DesignAndRealization, DirectoryNodeType, DocumentType, Event, Form, Formality, Fragment, Functionality, IdentityDomain, IdentityType, InformationObject, InformationSubject, InformationType, Learning, Package, Party, PartyRole, Process, ProductFeature, ProductFunction, ProductLifeCyclePhase, ProductMetadata, ProductProperty, ProductVariant, PuttingToUse, Qualification, Reference, Role, Safety, SkillLevel, Supply, Task, TechnicalData, TechnicalOverview, Topic, TopicType, Troubleshooting, Use, WarningMessage, ConsumableSupply, HardwareTool, Lubricant, OperatingSupply, ProtectiveEquipment, SparePart",
        //Array darf nicht leer sein (sonst false positive) UND Element muss Attribut rdf:about besitzen
        //Was ist, wenn kein Wert in rdf:about eingetragen ist? Zusätzliche Prüfung? -> ... UND rdf:about DARF NICHT leer sein
        assert: (els => !els.length) && (els => els.every(el => el.hasAttribute("rdf:about"))) && (els => els.every(el => el.getAttribute("rdf:about") != "")),
        prio: "REQUIRED",
        rule: {
            "de": "...,",
            "en": "IRI: REQUIRED"
        }
    },
    {
        /* Alle Elemente mit IRI=OPTIONAL / Alle Elemente, die Attribute rdf:about haben KÖNNEN
        Liste der Elemente:
        ContentLifeCycleStatus, DirectoryNode, DownTime, FragmentSelector, Identity, MaintenanceInterval, PlanningTime, RangeSelector, Rendition, Selector, WorkingTime, SetupTime
        */
        path: "ContentLifeCycleStatus, DirectoryNode, DownTime, FragmentSelector, Identity, MaintenanceInterval, PlanningTime, RangeSelector, Rendition, Selector, WorkingTime, SetupTime",
        //Array darf nicht leer sein (sonst false positive) UND wenn Element KEIN rdf:about hat, dann Notice ausgeben
        assert: (els => els.length != 0) && (els => els.some(el => el.hasAttribute("rdf:about"))),
        prio: "OPTIONAL",
        rule: {
            "de": "...,",
            "en": "IRI: OPTIONAL"
        }
    }
];