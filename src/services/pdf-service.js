import blobStream from "blob-stream";

const singleton = Symbol();
const singletonPdfService = Symbol();

export class PdfService {

    static PDFA_SRGB_IEC61966_ICC_PROFILE_B64 = "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";

    static PDFA_XMP = "<?xpacket begin=\"\ufeff\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n"+
        "            <x:xmpmeta xmlns:x=\"adobe:ns:meta/\">\n"+
        "                <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n"+
        "                    <rdf:Description xmlns:pdfaid=\"http://www.aiim.org/pdfa/ns/id/\" rdf:about=\"\">\n"+
        "                        <pdfaid:part>2</pdfaid:part>\n"+
        "                        <pdfaid:conformance>A</pdfaid:conformance>\n"+
        "                    </rdf:Description>\n"+
        "                </rdf:RDF>\n"+
        "            </x:xmpmeta>\n"+
        "            <?xpacket end=\"w\"?>";

    static PDFA_SRGB_IEC61966_NAME = new String("sRGB IEC61966-2.1");

    static BASE_URL = "https://pdf.plusmeta.ai";

    constructor(pdfService, { $store }) {
        if (pdfService !== singletonPdfService) {
            throw new Error("Cannot construct singleton");
        }

        this.$store = $store;
        this.virtualFilesPromise = import(/* webpackChunkName: "pdf-service-virtual-fs.restricted" */ "@/util/pdf-fonts");
        this.PDFDocumentWithTablesPromise = import(/* webpackChunkName: "pdf-table.restricted" */"@/util/pdf-document-with-table.js");
    }

    static instance({ $store }) {
        if (!this[singleton]) {
            this[singleton] = new PdfService(singletonPdfService, { $store });
        }

        return this[singleton];
    }

    /**
     * PDF/A ISO 19005-2:2011 6.2.11.7 The Unicode values specified
     * in the ToUnicode CMap shall all be greater than zero (0),
     * but not equal to either U+FEFF or U+FFFE.
     * @param str
     */
    _normalize(str) {
        return String(str).normalize("NFKC").replace(/[\uFFFE\uFFFE]+/g, " ");
    }

    get isChinese() {
        return this.$store.getters["settings/getCurrentLocale"] === "zh";
    }

    async generateVdiMain(info, orgaLabel, mainDocumentLabel, head, body) {
        this.virtualFiles = await this.virtualFilesPromise;
        this.PDFDocumentWithTables = await this.PDFDocumentWithTablesPromise;

        return await new Promise((resolve, reject) => {
            const PDF = new this.PDFDocumentWithTables.default({
                size: "A4",
                layout: "landscape",
                pdfVersion: "1.7",
                tagged: true,
                displayTitle: true,
                font: this.isChinese ? "PingFang" : "Ubuntu",
                fontName: this.isChinese ? "PingFang" : "Ubuntu"
            });

            PDF.info["Title"] = info;
            PDF.info["Author"] = orgaLabel;
            PDF.info["Subject"] = mainDocumentLabel;
            PDF.info["Producer"] = `plusmeta Platform (v${process.env.VUE_APP_VERSION})`;
            PDF.info["Creator"] = `plusmeta Platform (v${process.env.VUE_APP_VERSION})`;

            const stream = PDF.pipe(blobStream());

            const options = {
                width: 750,
                columnsSize: (head[0].length === 1) ? [725] : [50, 200, 75, 50, 50, 300],
                columnSpacing: 7.5
            };

            const table = {
                title: mainDocumentLabel,
                subtitle: info,
                footer: orgaLabel,
                headers: head[0].map(s => this._normalize(s)),
                rows: body.map(r => r.map(s => this._normalize(s)))
            };

            PDF.table(table, options);

            // PDF/A standard requires embedded color profile.
            const colorProfile = Buffer.from(PdfService.PDFA_SRGB_IEC61966_ICC_PROFILE_B64, "base64");
            const refColorProfile = PDF.ref({
                Length: colorProfile.length,
                N: 3,
            });
            refColorProfile.write(colorProfile);
            refColorProfile.end();

            const refOutputIntent = PDF.ref({
                Type: "OutputIntent",
                S: "GTS_PDFA1",
                Info: PdfService.PDFA_SRGB_IEC61966_NAME,
                OutputConditionIdentifier: PdfService.PDFA_SRGB_IEC61966_NAME,
                DestOutputProfile: refColorProfile,
            });
            refOutputIntent.end();

            // Metadata defines document type.
            const metadata = PdfService.PDFA_XMP.trim();
            const refMetadata = PDF.ref({
                Length: metadata.length,
                Type: "Metadata",
                Subtype: "XML",
            });
            refMetadata.compress = false;
            refMetadata.write(Buffer.from(metadata, "utf-8"));
            refMetadata.end();

            // Add manually created objects to catalog.
            PDF._root.data.OutputIntents = [refOutputIntent];
            PDF._root.data.Metadata = refMetadata;

            PDF.end();
            stream.on("finish", function () {
                const pdfFile = stream.toBlob("application/pdf");
                resolve(pdfFile);
            });
        });
    }

    async generateLicenseTable(header, head, body) {
        this.virtualFiles = await this.virtualFilesPromise;
        this.PDFDocumentWithTables = await this.PDFDocumentWithTablesPromise;

        return new Promise((resolve, reject) => {
            const PDF = new this.PDFDocumentWithTables.default({
                size: "A4",
                layout : "landscape",
                pdfVersion: "1.7",
                tagged: true,
                margin: 40,
                font: ""
            });

            PDF.info["Title"] = header;
            PDF.info["Author"] = "plusmeta GmbH";
            PDF.info["Producer"] = `plusmeta Platform (v${process.env.VUE_APP_VERSION})`;
            PDF.info["Creator"] = `plusmeta Platform (v${process.env.VUE_APP_VERSION})`;

            const stream = PDF.pipe(blobStream());

            const options = {
                width: 750,
                columnsSize: [120,250,80,300],
                columnSpacing: 7.5
            };
            const table = {
                title: "plusmeta - " + header,
                headers: head[0],
                rows: body
            };

            PDF.table(table, options);
            PDF.end();

            stream.on("finish", function() {
                const pdfFile = stream.toBlob("application/pdf");
                resolve(pdfFile);
            });
        });
    }
}
