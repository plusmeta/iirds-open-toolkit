export default [{
    id: "M1",
    path: "Document, Topic, Fragment, Package",
    assert: els => els.filter(el => !el.hasAttribute("rdf:about")),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#navigation:~:text=An%20instance%20of%20an%20iirds%3AInformationUnit%20subclass%20MUST%20have%20an%20IRI%20and%20MUST%20NOT%20be%20a%20blank%20node.",
    rule: {
        "de": "Eine Instanz einer iirds:InformationUnit Subklasse MUSS eine IRI haben und DARF NICHT eine Blank Node sein",
        "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI and MUST NOT be a blank node"
    }
}, {
    id: "M2",
    path: "Rendition source",
    assert: els => els.filter(el => /(^(?:\/|[a-z]+:\/\/))|(www\..*?\..*?\/)/.test(el.textContent)),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#navigation:~:text=The%20URL%20MUST%20be%20relative%20to%20the%20root%20folder%20of%20the%20iiRDS%20package.",
    rule: {
        "de": "Die URL MUSS relativ zum Stammverzeichnis des iiRDS-Pakets sein",
        "en": "The URL MUST be relative to the root folder of the iiRDS package"
    }
}, {
    id: "M3",
    version: "1.1",
    path: "Rendition",
    assert: els => els.filter(el => el.querySelector("format")?.textContent === "application/iirds+zip" ||  el.querySelector("source")?.textContent.endsWith(".iirds")),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#navigation:~:text=iirds%3APackage%20elements%20representing%20the%20enclosing%20iiRDS%20package%20itself%20MUST%20NOT%20be%20subjects%20of%20any%20iirds%3Ahas%2Drendition%20relation",
    rule: {
        "de": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation",
        "en": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation"
    }
}];
