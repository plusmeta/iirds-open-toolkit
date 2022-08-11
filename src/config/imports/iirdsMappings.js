const IIRDS = {
    directory: "DirectoryNode",
    objects: {
        "Package": "iirds:Container",
        "Document": "plus:Document",
        "Topic": "plus:Component",
        "Fragment": "plus:Fragment",
        "InformationObject": "plus:GenericObject"
    },
    metadata: {
        "dateOfCreation": null,
        "dateOfStatus": null,
        "duration": null,
        "formatRestriction": null,
        "has-content-lifecycle-status-value": "ContentLifeCycleStatusValue",
        "has-content-lifecycle-status": "ContentLifeCycleStatus",
        "has-document-type": "DocumentType",
        "has-event-code": null,
        "has-event-type": null,
        "has-planning-time": "PlanningTime",
        "has-subject": "InformationSubject",
        "has-topic-type": "TopicType",
        "iiRDSVersion": null,
        "is-applicable-for-document-type": "DocumentType",
        "is-part-of-package": "Package",
        "is-version-of": "InformationObject",
        "language": null,
        "relates-to-component": "Component",
        "relates-to-event": "Event",
        "relates-to-product-feature": ["ProductProperty", "ProductFunction"],
        "relates-to-product-lifecycle-phase": ["DesignAndRealisation", "PuttingToUse", "Use", "AfterUse"],
        "relates-to-product-variant": "ProductVariant",
        "relates-to-qualification": ["Role", "SkillLevel"],
        "relates-to-component-location": ["HardwareComponentLocalizations"],
        "relates-to-supply": "Supply",
        "revision": null,
        "rights": null,
        "statusComment": null
    },
    properties: {
        "AfterUse": "iirds:AfterUse",
        "Component": "iirds:Component",
        "ContentLifeCycleStatusValue": "iirds:ContentLifeCycleStatusValue",
        "DesignAndRealisation": "iirds:DesignAndRealisation",
        "Event": "iirds:Event",
        "InformationSubject": "iirds:InformationSubject",
        "Organization": "plus:Organization",
        "PlanningTime": "iirds:PlanningTime",
        "ProductFunction": "iirds:ProductFunction",
        "ProductProperty": "iirds:ProductProperty",
        "ProductVariant": "iirds:ProductVariant",
        "PuttingToUse": "iirds:PuttingToUse",
        "Role": "iirds:Role",
        "SkillLevel": "iirds:SkillLevel",
        "Supply": "iirds:Supply",
        "TopicType": "iirds:TopicType",
        "Use": "iirds:Use"
    },
    $(type) {
        return Object.keys(this[type]).join(", ");
    }
};

export default IIRDS;