export default [{
    path: "InformationUnit",
    assert: els => els.length === 0,
    prio: "MUST",
    rule: {
        "de": "Dokument muss ein referenziertes Objekt haben",
        "en": "Document must have a referenced object"
    }
}, {
    path: "Document, Topic, Fragment, Package",
    assert: els => els.every(el => el.hasAttribute("rdf:about")),
    prio: "MUST",
    rule: {
        "de": "iiRDS-Ersteller DÜRFEN NICHT die Klasse iirds:InformationUnit direkt verwenden, sondern MÜSSEN eine der Unterklassen benutzen",
        "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
    }
}, {
    path: "Package",
    assert: els => els.length === 1,
    prio: "MUST",
    rule: {
        "de": "Jedes iiRDS-Paket MUSS genau eine entsprechende iirds:Paket-Instanz in den Metadaten haben.",
        "en": "Each iiRDS package MUST have exactly one corresponding iirds:Package instance in the metadata."
    }
}, {
    path: "Document, Topic, Fragment, Package",
    assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about").length),
    prio: "MUST",
    rule: {
        "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse MUSS einen IRI haben und DARF KEIN leerer Knoten sein.",
        "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI and MUST NOT be a blank node."
    }
},
//The URL MUST be relative to the root folder of the iiRDS package -> Zwei Versionen. Version 2: Regex ereitert -> Version 1 obsolet
//Test in metadata.xml -> https://www.plusmeta.de/ einfügen in Rendition>source
{
    path: "Rendition source",
    //
    assert: els => els.every(el => !/^(?:\/|[a-z]+:\/\/)/.test(el.textContent)),
    prio: "MUST",
    rule: {
        "de": "Die URL MUSS relativ zum Stammverzeichnis des iiRDS-Pakets sein",
        "en": "The URL MUST be relative to the root folder of the iiRDS package"
    }
}, {
    path: "Rendition source",
    //Regel prüft, dass Muster "https://" oder "www.*.*/" nicht in URI enthalten sind.
    assert: els => els.every(el => !/(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/.test(el.textContent)),
    prio: "MUST",
    rule: {
        "de": "Die URL MUSS relativ zum Stammverzeichnis des iiRDS-Pakets sein",
        "en": "The URL MUST be relative to the root folder of the iiRDS package"
    }
},
//==================================================================
{
    path: "Rendition format",
    //
    assert: els => els.length === 1,
    prio: "MUST",
    rule: {
        "de": "",
        "en": "An iirds:Rendition MUST also have the property iirds:format."
    }
}, {
    path: "",
    //assert: els =>
    prio: "MUST",
    rule: {
        "de": "Der Verzeichnisknoten auf der nächstniedrigeren Ebene MUSS das erste Element einer anderen verknüpften Liste sein.",
        "en": "The directory node on the next lower level MUST be the first item of another linked list."
    }
}, {
    path: "",
    //assert: els =>
    prio: "MUST",
    rule: {
        "de": "Um Hierarchieebenen in der Navigationsstruktur zu modellieren, MUSS eine iirds:DirectoryNode-Instanz eine iirds:DirectoryNode-Instanz auf der nächst niedrigeren Ebene über die Eigenschaft iirds:has-first-child referenzieren",
        "en": "To model hierarchy levels in the navigation structure, an iirds:DirectoryNode instance MUST reference an iirds:DirectoryNode instance on the next lower level by the property iirds:has-first-child"
    }
}, {
    path: "",
    //Knoten != Wurzelknoten & hat Eigenschaft iirds:has-directory-structure-type
    //assert: els =>
    prio: "MUST",
    rule: {
        "de": "Nur Wurzelknoten einer Verzeichnisstruktur DÜRFEN die Eigenschaft iirds:has-directory-structure-type haben.",
        "en": "Only root nodes of a directory structure MUST have the property iirds:has-directory-structure-type."
    }
}, {
    path: "",
    //assert: els =>
    prio: "MUST",
    rule: {
        "de": "Der Wurzelknoten einer Verzeichnisstruktur MUSS die Eigenschaft iirds:has-directory-structure-type haben",
        "en": "The root node of a directory structure MUST have one property iirds:has-directory-structure-type"
    }
}, {
    path: "Package",
    //assert: els => els.length === 1,
    prio: "MAY",
    rule: {
        "de": "Informationseinheiten KÖNNEN mit der Eigenschaft iirds:is-part-of-package auf das Paket verweisen, zu dem sie gehören",
        "en": "Information units MAY point to the package that they belong to with the property iirds:is-part-of-package"
    }
}, {
    path: "Package",
    //assert: els =>
    prio: "MAY",
    rule: {
        "de": "Eine Informationseinheit KANN eine oder mehrere physische Wiedergaben in einem iiRDS-Paket haben",
        "en": "An information unit MAY have one or more physical renditions in an iiRDS package"
    }
}];
