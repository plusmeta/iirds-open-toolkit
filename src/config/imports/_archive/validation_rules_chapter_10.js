export default [

    //10.1 Overview
    {
        id: "",
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

        //schwer zu testen?
    },
    {
        id: "",
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

        //schwer zu testen? Wie stylesheet erkennen?
    },

    //10.2 iiRDS XHTML5
    {
        id: "",
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
        id: "",
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

    },
    {
        id: "",
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

    },
    {
        id: "",
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

    },
    {
        id: "",
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

    },
    //================================================================

    //10.4 Global Attributes

    //Only the following subset of 'Global attributes' from the HTML5 specification (https://www.w3.org/TR/html5/dom.html#global-attributes) MUST be used in iiRDS XHTML5 elements:
    {
        id: "",
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

        //schwer zu testen
    },

    //10.5 Elements
    {
        id: "",
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

        //schwer zu testen?
    },

    //10.5.2 Document Metadata
    {
        id: "",
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

    },

    //10.5.11 SVG, MathML and IFrames
    {
        id: "",
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

    },

    //10.6 Additional Semantic Tagging of Content
    {
        id: "",
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

    },
    {
        id: "",
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

    },
    {
        id: "",
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

    },
    {
        id: "",
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

    },

    {
        id: "",
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
];