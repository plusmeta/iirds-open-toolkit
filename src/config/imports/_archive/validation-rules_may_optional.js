const ABSOLUTE_IRI_REGEX = /(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/;
const iri_absolute_regex = /'^(?:[a-z]+:)?\/\/'/;
const mustNotBeABlankNode = el => el.childElementCount === 0;
const mustNotHaveChild = child => el => el.querySelectorAll(child).length === 0;
const mustHaveChild = child => el => el.querySelectorAll(child).length === 1;
const includesAll = (small, big) => small.every(n => big.indexOf(n) !== -1);

export default [
    //6.2 Information Units
    {
        path: "Document, Topic, Fragment, Package",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Information units MAY point to the package that they belong to with the property iirds:is-part-of-package. "
        }
    },
    {
        path: "Document, Topic, Fragment",
        assert: "",
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "iirds:Document, iirds:Topic, and iirds:Fragment MAY refer to a physical file or a part of a file in the iiRDS package. But iirds:Document, iirds:Topic, and iirds:Fragment MAY also model abstract entities without a physical file in the iiRDS package."
        }
    },
    //6.2.1 InformationUnit Identifier

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

    //6.3.2 Media Files

    //6.3.3 Metadata of Nested iiRDS Packages

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

    //6.7.1 Component Trees in the Package

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
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "An iiRDS package with iirds:Component MAY use iirds:has-component relations to model a component tree."
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
    //----------
    {
        id: "M32.2",
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
    //6.9.2 Hierarchical Navigation

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
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "A party that generates or processes an iiRDS package MAY combine iiRDS domains and proprietary iiRDS extensions."
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

    //8.1 Unrestricted iiRDS vs. iiRDS/A

    //8.2 Self-contained iiRDS/A Packages

    //9. iiRDS/A Media Formats

    //Structured textual content MUST be encoded as iiRDS XHTML5. The file extension MUST be .xhtml.

    //9.2.1 Raster Formats

    //Only static language features of SVG that correspond to the feature string http://www.w3.org/TR/SVG11/feature#SVG-static MUST be used.

    //10.1 Overview

    //10.2 iiRDS XHTML5

    //10.3 Conformance Criteria

    //It MUST be an HTML5 document that conforms to the XHTML syntax. See https://www.w3.org/TR/2014/REC-html5-20141028/the-xhtml-syntax.html#the-xhtml-syntax for details.

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

    //10.5 Elements

    //10.5.2 Document Metadata

    //10.5.11 SVG, MathML and IFrames

    //10.6 Additional Semantic Tagging of Content

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
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Possible types include task, learning, and concept. Information units that represent topics MAY have one or more has-topic-type properties that define the topic's information type. Topics without a has-topic-type property are generic topics, with no specific type."
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
        prio: "MAY",
        rule: {
            "de": "...",
            "en": "Description:	Troubleshooting information MAY comprise a description of the symptoms, the cause of the error, and a remedy for the error."
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
        path: "ContentLifeCycleStatus, DirectoryNode, DownTime, FragmentSelector, Identity, MaintenanceInterval, PlanningTime, RangeSelector, Rendition, Selector, WorkingTime, SetupTime",
        assert: (els => els.length != 0) && (els => els.some(el => el.hasAttribute("rdf:about"))),
        prio: "OPTIONAL",
        rule: {
            "de": "...,",
            "en": "IRI: OPTIONAL"
        }
    }
];