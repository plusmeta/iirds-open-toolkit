
// {
//     id: "M5",
//     path: "Package",
//     prio: "MUST NOT",
//     category: "must not use property",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20corresponding%20iirds%3APackage%20instance%20of%20an%20iiRDS%20package%20MUST%20NOT%20be%20a%20member%20of%20another%20iiRDS%20package%20expressed%20by%20the%20property%20iirds%3Ais%2Dpart%2Dof%2Dpackage.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Die entsprechende iirds:Package-Instanz eines iiRDS-Pakets DARF NICHT Mitglied eines anderen iiRDS-Pakets sein, das durch die Eigenschaft iirds:is-part-of-package ausgedrückt wird.",
//         "en": "The corresponding iirds:Package instance of an iiRDS package MUST NOT be a member of another iiRDS package expressed by the property iirds:is-part-of-package."
//     },
//     testfiles: {
//         "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
//         "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M5_false.rdf"]
//     }
// },
// {
//     id: "M8.2",
//     path: "InformationObject",
//     prio: "MAY",
//     category: "may use property",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20information%20object%20MUST%20have%20an%20absolute%20IRI%20and%20MAY%20be%20related%20to%20additional%20identifications%20via%20the%20iirds%3Ahas%2Didentity%20property.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Ein Informationsobjekt KANN über die Eigenschaft iirds:has-identity mit zusätzlichen Identifikationen in Beziehung gesetzt werden.",
//         "en": "An information object MAY be related to additional identifications via the iirds:has-identity property."
//     },
// },
// {
//     id: "M16",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=If%20a%20media%20file%20is%20not%20self%2Dcontained%2C%20then%20it%20MUST%20be%20modeled%20as%20iirds%3AFragment.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Wenn eine Mediendatei nicht in sich geschlossen ist, MUSS sie als iirds:Fragment modelliert werden.",
//         "en": "If a media file is not self-contained, then it MUST be modeled as iirds:Fragment."
//     },
// },
// {
//     id: "M17.1",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=For%20each%20nested%20child%20iiRDS%20package%2C%20an%20iirds%3APackage%20MUST,iirds%3APackage%20in%20the%20metadata%20of%20the%20parent%20iiRDS%20package.",
//     version: ["V1.1"],
//     rule: {
//         "de": "Für jedes verschachtelte untergeordnete iiRDS-Paket MUSS ein iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets vorhanden sein.",
//         "en": "For each nested child iiRDS package, an iirds:Package MUST be present in the metadata of the parent iiRDS package."
//     },
// },
// {
//     id: "M17.2",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=For%20each%20nested%20child%20iiRDS%20package%2C%20an%20iirds%3APackage%20MUST,iirds%3APackage%20in%20the%20metadata%20of%20the%20parent%20iiRDS%20package.",
//     version: ["V1.1"],
//     rule: {
//         "de": "Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS im iiRDS-ZIP-Archiv des übergeordneten iiRDS-Pakets enthalten sein.",
//         "en": "The iiRDS ZIP archive of the nested package MUST be included in the iiRDS ZIP archive of the parent iiRDS package."
//     },
// },
// {
//     id: "M17.3",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=For%20each%20nested%20child%20iiRDS%20package%2C%20an%20iirds%3APackage%20MUST,iirds%3APackage%20in%20the%20metadata%20of%20the%20parent%20iiRDS%20package.",
//     version: ["V1.1"],
//     rule: {
//         "de": "Das iiRDS-ZIP-Archiv des verschachtelten Pakets MUSS durch eine iirds:Rendition seines iirds:Package in den Metadaten des übergeordneten iiRDS-Pakets referenziert werden.",
//         "en": "The iiRDS ZIP archive of the nested package MUST be referenced by an iirds:Rendition of its iirds:Package in the metadata of the parent iiRDS package."
//     }
// },
// {
//     id: "M18.1",
//     prio: "MUST",
//     category: "cardinality 1",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20the%20metadata.rdf%20file%20of%20the%20parent%20iiRDS%20package%2C%20the,package%20MUST%20NOT%20have%20any%20outgoing%20iirds%3Ais%2Dpart%2Dof%2Dpackage%20relations.",
//     version: ["V1.1"],
//     rule: {
//         "de": "In der Datei metadata.rdf des übergeordneten iiRDS-Pakets MUSS das iirds:Package des verschachtelten untergeordneten iiRDS-Pakets genau ein iirds:Package von iirds:is-part-of-package referenzieren.",
//         "en": "In the metadata.rdf file of the parent iiRDS package, the iirds:Package of the nested child iiRDS package MUST reference exactly one iirds:Package by iirds:is-part-of-package."
//     }
// },
// {
//     id: "M18.2",
//     prio: "MUST",
//     category: "cardinality 1",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20the%20metadata.rdf%20file%20of%20the%20parent%20iiRDS%20package%2C%20the,package%20MUST%20NOT%20have%20any%20outgoing%20iirds%3Ais%2Dpart%2Dof%2Dpackage%20relations.",
//     version: ["V1.1"],
//     rule: {
//         "de": "In der Datei metadata.rdf des übergeordneten iiRDS-Pakets DARF das referenzierte übergeordnete iiRDS-Paket KEINE ausgehenden iirds:is-part-of-package-Beziehungen haben.",
//         "en": "In the metadata.rdf file of the parent iiRDS package, the referenced parent iiRDS package MUST NOT have any outgoing iirds:is-part-of-package relations."
//     }
// },
// {
//     id: "M19.2",
//     path: "Document has-document-type",
//     prio: "MUST",
//     category: "specific values allowed",
//     values: ["http://iirds.tekom.de/iirds#RepairInstructions", "http://iirds.tekom.de/iirds#BillOfMaterials", "http://iirds.tekom.de/iirds#AdministratorGuide", "http://iirds.tekom.de/iirds#AssemblyInstructions", "http://iirds.tekom.de/iirds#SafetyInstructions", "http://iirds.tekom.de/iirds#SalesCatalog", "http://iirds.tekom.de/iirds#Specification", "http://iirds.tekom.de/iirds#TechnicalDrawingDiagram", "http://iirds.tekom.de/iirds#QuickGuide", "http://iirds.tekom.de/iirds#Plan", "http://iirds.tekom.de/iirds#PartsCatalog", "http://iirds.tekom.de/iirds#OperatingInstructions", "http://iirds.tekom.de/iirds#MaintenanceInstructions", "http://iirds.tekom.de/iirds#InstallationInstructions", "http://iirds.tekom.de/iirds#IdentificationDocument", "http://iirds.tekom.de/iirds#ElectronicIdentificationPlate", "http://iirds.tekom.de/iirds#ContractualDocument", "http://iirds.tekom.de/iirds#Certificate", "http://iirds.tekom.de/iirds#TransportInstructions", "http://iirds.tekom.de/iirds#CEDeclarationOfConformity"],
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3ADocument%20class%20MUST%20have%20one%20or%20more%20relations%20to%20one%20of%20the%20standardized%20iirds%3ADocumentTypes%20defined%20in%20iirds%3AInformationType%20%3E%20iirds%3ADocumentType.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Instanzen der Klasse iirds:Document MÜSSEN eine oder mehrere Beziehungen zu einem der standardisierten iirds:DocumentTypes haben, die in iirds:InformationType > iirds:DocumentType definiert sind.",
//         "en": "Instances of the iirds:Document class MUST have one or more relations to one of the standardized iirds:DocumentTypes defined in iirds:InformationType > iirds:DocumentType."
//     },
//     testfiles: {
//         "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
//         "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M19.2_false.rdf"]
//     }
// },
// {
//     id: "M20",
//     path: "Document",
//     prio: "RECOMMENDED",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20is%20RECOMMENDED%20to%20create%20more%20than%20one%20relation%20to%20iirds%3ADocumentType%20for%20documents%20with%20mixed%20content.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Es wird EMPFOHLEN, für Dokumente mit gemischtem Inhalt mehr als eine Relation zu iirds:DocumentType zu erstellen.",
//         "en": "It is RECOMMENDED to create more than one relation to iirds:DocumentType for documents with mixed content."
//     },

// },
// {
//     id: "M22",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20properties%20iirds%3Arelates%2Dto%2Dcomponent%20and%20iirds%3Arelates%2Dto%2Dproduct%2Dvariant%20relate%20an%20information%20unit%20to%20an%20instance%20of%20iirds%3AComponent%20or%20iirds%3AProductVariant.%20The%20instances%20MUST%20be%20part%20of%20a%20proprietary%20iiRDS%20extension.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Die Eigenschaften iirds:relates-to-component und iirds:relates-to-product-variant beziehen eine Informationseinheit auf eine Instanz von iirds:Component oder iirds:ProductVariant.  Die Instanzen MÜSSEN Teil einer proprietären iiRDS-Erweiterung sein.",
//         "en": "The properties iirds:relates-to-component and iirds:relates-to-product-variant relate an information unit to an instance of iirds:Component or iirds:ProductVariant. The instances MUST be part of a proprietary iiRDS extension."
//     },
// },
// {
//     id: "M23",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iiRDS%20package%20MAY%20model%20a%20component%20tree.%20The%20property%20iirds%3Ahas%2Dcomponent%20defines%20part%2Dof%20relations%20for%20products%20and%20their%20components.%20The%20component%20tree%20is%20a%20proprietary%20iiRDS%20extension%2C%20it%20MUST%20be%20stored%20in%20the%20metadata.rdf%20of%20the%20iiRDS%20package.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Ein iiRDS-Paket KANN einen Komponentenbaum modellieren.  Die Eigenschaft iirds:has-component definiert Teil-von-Beziehungen für Produkte und ihre Komponenten.  Der Komponentenbaum ist eine proprietäre iiRDS-Erweiterung, er MUSS in der metadata.rdf des iiRDS-Pakets gespeichert werden.",
//         "en": "An iiRDS package MAY model a component tree. The property iirds:has-component defines part-of relations for products and their components. The component tree is a proprietary iiRDS extension, it MUST be stored in the metadata.rdf of the iiRDS package."
//     },
// },
// {
//     id: "M24",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20product%20ontology%20MUST%20NOT%20be%20a%20proprietary%20iiRDS%20extension%20and%20MAY%20use%20a%20vocabulary%20other%20than%20RDF%20and%20RDFS.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Die Produktontologie DARF KEINE proprietäre iiRDS-Erweiterung sein und DARF ein anderes Vokabular als RDF und RDFS verwenden.",
//         "en": "The product ontology MUST NOT be a proprietary iiRDS extension and MAY use a vocabulary other than RDF and RDFS."
//     },
// },
// {
//     id: "M26",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20map%20the%20component%20tree%20in%20the%20iiRDS%20package%20to%20the%20external%20product%20ontology%2C%20a%20mapping%20ontology%20MUST%20use%20the%20property%20rdfs%3AseeAlso.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Um den Komponentenbaum im iiRDS-Paket der externen Produktontologie zuzuordnen, MUSS eine Mapping-Ontologie die Eigenschaft rdfs:seeAlso verwenden.",
//         "en": "To map the component tree in the iiRDS package to the external product ontology, a mapping ontology MUST use the property rdfs:seeAlso."
//     },
// },
// {
//     id: "M29",
//     prio: "MUST",
//     spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20property%20rdfs%3AseeAlso%20MUST%20relate%20the%20instance%20of%20the%20product%20variant%20in%20the%20iiRDS%20package%20to%20the%20external%20product%20ontology.",
//     version: ["V1.0", "V1.0.1", "V1.1"],
//     rule: {
//         "de": "Die Eigenschaft rdfs:seeAlso MUSS die Instanz der Produktvariante im iiRDS-Paket mit der externen Produktontologie in Beziehung setzen.",
//         "en": "The property rdfs:seeAlso MUST relate the instance of the product variant in the iiRDS package to the external product ontology. "
//     },
// },