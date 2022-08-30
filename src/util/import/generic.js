export default {
    async analyze(projectUuid, objectUuid, objectData, objectFilename, store) {

        await store.dispatch("storage/saveObjectLocal", {
            uuid: objectUuid,
            type: "plus:GenericObject",
            name: objectFilename,
            source: {
                name: objectFilename,
                size: objectData?.size,
                data: objectData
            }
        });

        await this.addGenericMetadata(objectUuid, objectData, objectFilename, store);
    },
    async addGenericMetadata(objectUuid, objectData, objectFilename, store) {
        await store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                value: Date.now(),
                provenance: "System",
                generator: "GEN"
            }
        });

        // original filename
        await store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                uri: "plus:OriginalFileName",
                value: objectFilename,
                provenance: "File",
                generator: "GEN",
                confidence: 1
            }
        });

        await store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                uri: "plus:CleanFileName",
                value: this.getCleanFileName(objectFilename),
                provenance: "File",
                generator: "GEN",
                confidence: 1
            }
        });
    },
    getCleanFileName(fileName) {
        if (!fileName) return "";
        let fileNameParts = fileName.split(/[-_\/\s,.]/g);
        fileNameParts.pop();
        let cleanFileName = fileNameParts.join(" ");
        return cleanFileName.trim();
    }
};
