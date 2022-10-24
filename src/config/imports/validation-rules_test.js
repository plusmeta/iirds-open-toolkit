const isBuiltIn = uri => uri.startsWith("http://iirds.tekom.de/iirds");

const getAbsoluteIRIRegExp = () => new RegExp(/^(\w+:|www\.)[\S]+/);

const includesAll = (small, big) => small.every(n => big.indexOf(n) !== -1);
const oneOrMore = (els, selector) => (els && els.length) ? els.every(el => el.querySelectorAll(`:scope > ${selector}`).length >= 1) : true;
const isZeroOrOne = (els, selector) => (els && els.length) ? els.every(el => el.querySelectorAll(`:scope > ${selector}`).length <= 1) : true;
const isExactlyOneChild = (el, selector) => el.querySelectorAll(`:scope > ${selector}`).length === 1;

const isExactlyOne = (els, doc, selector) => (els && els.length) ? els.every((el) => {
    if (el.hasAttribute("rdf:about")) {
        const resource = el.getAttribute("rdf:about");
        return Array.from(doc.querySelectorAll(`[*|about='${resource}']`)).some(res => isExactlyOneChild(res, selector));
    } else {
        return isExactlyOneChild(el, selector);
    }
}) : true;

const isDefinedAsClass = (els, doc, className) => els.every((el) => {
    if (el.hasAttribute("rdf:resource")) {
        const resource = el.getAttribute("rdf:resource");
        return isBuiltIn(resource) || doc.querySelector(`[*|about='${resource}']`)?.localName === className;
    } else {
        return doc.querySelector(className);
    }
});

const getMoreThanOne = (els, doc, selector) => els.filter((el) => {
    if (el.hasAttribute("rdf:about")) {
        const resource = el.getAttribute("rdf:about");
        return !Array.from(doc.querySelectorAll(`[*|about='${resource}']`)).some(res => isExactlyOneChild(res, selector));
    } else {
        return !isExactlyOneChild(el, selector);
    }
}).filter(Boolean);

const getMissing = (els, selector) => els.filter(el => !el.querySelectorAll(`:scope > ${selector}`).length);

const getWrongClassInPackage = (els, doc, className) => els.filter((el) => {
    if (el.hasAttribute("rdf:resource")) {
        const resource = el.getAttribute("rdf:resource");
        return !isBuiltIn(resource) && doc.querySelector(`[*|about='${el.getAttribute("rdf:resource")}']`)?.localName !== className;
    } else {
        return !doc.querySelector(`:scope > ${className}`);
    }
});

export default [
    {
        id: "M2.2",
        path: "Document, Topic, Fragment, Package",
        assert: els => els.every(el => el.childElementCount > 0),
        getInvalid: els => els.filter(el => el.childElementCount === 0),
        prio: "MUST",
        category: "must not be a blank node",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=An%20instance%20of%20an%20iirds%3AInformationUnit%20subclass%20MUST%20have%20an%20IRI%20and%20MUST%20NOT%20be%20a%20blank%20node.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse DARF KEIN leerer Knoten sein.",
            "en": "An instance of an iirds:InformationUnit subclass MUST NOT be a blank node."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.2_false.rdf"]
        }
    }
];
