export default {
    getSupportedFormats() {
        return ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
    },
    getImageData(image) {
        let url = undefined;
        if (image instanceof Blob) {
            url = URL.createObjectURL(image);
        } else if (typeof image === "string") {
            url = image;
        }

        return new Promise((resolve, reject) => {
            if (!url) reject("No valid image datatype");

            const img = new Image();
            img.src = url;

            img.onload = () => {
                resolve(img);
            };
        });
    },
    getImageFileFromCanvas(canvas, format = "image/png", fileName) {
        return new Promise((resolve, reject) => {
            if (!canvas || !canvas.toBlob) reject();

            canvas.toBlob((blob) => {
                const file = new File([blob], fileName, {type: format});
                resolve(file);
            }, format);
        });
    },
    async getImageDimensions(image) {
        const imageData = await this.getImageData(image);
        if (imageData) {
            return [imageData.width, imageData.height];
        } else return null;
    },
    async resizeImage(imageFile, targetSize = 400) {
        const fileName = imageFile.name;
        const img = await this.getImageData(imageFile);
        const canvas = document.createElement("canvas");
        const resizeCanvas = document.createElement("canvas");
        const canvasContext = canvas.getContext("2d");
        const resizeCanvasContext = resizeCanvas.getContext("2d");

        let curWidth = Math.floor(img.width * 0.5);
        let curHeight = Math.floor(img.height * 0.5);

        resizeCanvas.width = curWidth;
        resizeCanvas.height = curHeight;

        const aspectRatio = img.height / img.width;
        const isLandscape = aspectRatio <  1 ;

        if (isLandscape) {
            canvas.width = Math.floor(targetSize / aspectRatio);
            canvas.height = targetSize;
        } else {
            canvas.width = targetSize;
            canvas.height = Math.floor(targetSize * aspectRatio);
        }

        try {
            resizeCanvasContext.drawImage(img, 0, 0, curWidth, curHeight);
        } catch (error) {
            return null;
        }

        while (Math.min(curWidth, curHeight) * 0.5 > targetSize) {
            curWidth = Math.floor(curWidth * 0.5);
            curHeight = Math.floor(curHeight * 0.5);
            resizeCanvasContext.drawImage(resizeCanvas, 0, 0, curWidth * 2, curHeight * 2, 0, 0, curWidth, curHeight);
        }

        canvasContext.drawImage(resizeCanvas, 0, 0, curWidth, curHeight, 0, 0, canvas.width, canvas.height);

        return this.getImageFileFromCanvas(canvas, "image/png", fileName);
    },
    async generateImageFromPDF(pdfDoc, targetSize = 400, pageNr = 1) {
        const page = await pdfDoc.getPage(pageNr);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const resizeCanvas = document.createElement("canvas");
        const canvasContext = canvas.getContext("2d");
        const resizeCanvasContext = resizeCanvas.getContext("2d");

        resizeCanvas.width = viewport.width;
        resizeCanvas.height = viewport.height;

        const aspectRatio = viewport.height / viewport.width;
        const isLandscape = aspectRatio <  1 ;

        if (isLandscape) {
            canvas.width = Math.floor(targetSize / aspectRatio);
            canvas.height = targetSize;
        } else {
            canvas.width = targetSize;
            canvas.height = Math.floor(targetSize * aspectRatio);
        }

        await page.render({ canvasContext: resizeCanvasContext, viewport }).promise;
        canvasContext.drawImage(resizeCanvas, 0, 0, viewport.width, viewport.height, 0, 0, canvas.width, canvas.height);

        return this.getImageFileFromCanvas(canvas, "image/png", "thumbnail.png");
    }
};
