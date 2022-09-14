export default [

    //9. iiRDS/A Media Formats
    {
        id: "",
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

    },

    //Structured textual content MUST be encoded as iiRDS XHTML5. The file extension MUST be .xhtml.
    {
        id: "",
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

    },

    //9.2.1 Raster Formats -> Streichen alles was iirds/a ist
    {
        id: "",
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

    },
    //9.2.2 Vector Formats
    //Only static language features of SVG that correspond to the feature string http://www.w3.org/TR/SVG11/feature#SVG-static MUST be used.
    {
        id: "",
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

    },
    {
        id: "",
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

    },
    {
        id: "",
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

    },
    {
        id: "",
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

    },


];