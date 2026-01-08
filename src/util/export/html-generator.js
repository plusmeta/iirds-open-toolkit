/**
 * Klasse zur Generierung von HTML-Dateien mit Überschrift und Tabelle
 */
class HtmlGenerator {
    /**
     * Erstellt eine HTML-Datei mit Überschrift und Tabelle
     * @param {string} title - Die Überschrift für die HTML-Seite
     * @param {string} subtitle - Die Unterüberschrift für die HTML-Seite
     * @param {Array<Object>} data - Array von Objekten für die Tabellenwerte
     * @returns {string} Der generierte HTML-String
     */
    generate(title, subtitle, data) {
        if (!data || data.length === 0) {
            throw new Error("Daten-Array darf nicht leer sein");
        }

        const headers = Object.keys(data[0]);

        const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(title)}</title>
    <style>
        body {
            font-family: 'Ubuntu', Arial, sans-serif;
            margin: 20px;
            padding: 20px;
        }
        h1 {
            color: #444;
            margin-bottom: 20px;
        }
        h2 {
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }
        th {
            background-color: #5cc5f2;
            color: white;
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }
        td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #ddd;
        }
    </style>
</head>
<body>
    <h1>${this.escapeHtml(title)}</h1>
    <h2>${this.escapeHtml(subtitle)}</h2>
    <table>
        <thead>
            <tr>
${headers.map(header => `                <th>${this.escapeHtml(header)}</th>`).join("\n")}
            </tr>
        </thead>
        <tbody>
${data.map(row => `            <tr>
${headers.map(header => `                <td>${this.escapeHtml(String(row[header] ?? ""))}</td>`).join("\n")}
            </tr>`).join("\n")}
        </tbody>
    </table>
</body>
</html>`;

        return html;
    }

    /**
     * Escaped HTML-Sonderzeichen zur Vermeidung von XSS
     * @param {string} text - Der zu escapende Text
     * @returns {string} Der escapte Text
     */
    escapeHtml(text) {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#039;"
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Erstellt eine HTML-Datei und gibt sie als Blob zurück
     * @param {string} title - Die Überschrift für die HTML-Seite
     * @param {string} subtitle - Die Unterüberschrift für die HTML-Seite
     * @param {Array<Object>} data - Array von Objekten für die Tabellenwerte
     * @returns {Blob} Ein Blob-Objekt mit dem HTML-Inhalt
     */
    generateBlob(title, subtitle, data) {
        const html = this.generate(title, subtitle, data);
        return new Blob([html], {type: "text/html;charset=utf-8"});
    }
}

export default HtmlGenerator;

