
export default [

    //8.1 Unrestricted iiRDS vs. iiRDS/A
    {
        id: "",
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

    },
    {
        id: "",
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


    },
    {
        id: "",
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


    },
    {
        id: "",
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


    },
    //==============================================================
    {
        id: "",
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
        id: "",
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

    },

];