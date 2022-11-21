/*
    pdfkit-table - Generate pdf tables with javascript (PDFKIT plugin)
    (c) Natan Cabral <natancabral@hotmail.com>
    https://github.com/natancabral/pdfkit-table
    modified by plusmeta GmbH
*/

import PDFDocument from "pdfkit";

export default class PDFDocumentWithTables extends PDFDocument {

    constructor(option) {
        super(option);
        this.fontName = option.fontName;
    }

    /**
     * _addBackground
     * @param {Object} rect
     * @param {Array} fillColor
     * @param {Number} fillOpacity
     */
    _addBackground({ x, y, width, height }, fillColor, fillOpacity) {

        // validate
        fillColor || (fillColor = [87, 85, 217]);
        fillOpacity || (fillOpacity = 1);

        // draw bg
        this
            .fill(fillColor)
            //.stroke(fillColor)
            .fillOpacity(fillOpacity)
            .rect(x, y, width, height)
            //.stroke()
            .fill();

        // restore
        this
            .fillColor("black")
            .fillOpacity(1)
            .fill();

    }

    /**
     * table
     * @param {Object} table
     * @param {Object} options
     * @returns
     */
    table(table, options) {

        typeof table === "string" && (table = JSON.parse(table));

        table || (table = {});
        options || (options = {});

        table.headers || (table.headers = []);
        table.datas || (table.datas = []);
        table.rows || (table.rows = []);
        table.options && (options = table.options);

        options.columnsSize || (options.columnsSize = []);
        options.addPage || (options.addPage = false);

        const title = table.title ?? options.title ?? "";
        const subtitle = table.subtitle ?? options.subtitle ?? "";
        const footer = table.footer;

        const columnSpacing = options.columnSpacing || 3; // 15
        let columnSizes = [];
        let columnPositions = []; // 0, 10, 20, 30, 100
        let columnWidth = 0;

        const rowDistance = 0.5;

        const prepareHeader = options.prepareHeader || (() => this.font(this.fontName + "-Bold").fontSize(8));
        const prepareRow = options.prepareRow || (() => this.font(this.fontName).fontSize(8));

        const maxY = this.page.height - (this.page.margins.top + this.page.margins.bottom);

        let startX = options.x || this.x || this.page.margins.left;
        let startY = options.y || this.y;
        let rowBottomY = 0;
        let tableWidth = 0;

        let lastPositionX, rowHeight;

        const now = new Date();

        // reset position to margins.left
        if (options.x === null || options.x === -1) {
            startX = this.page.margins.left;
        }

        const createTitle = (data, size, opacity) => {
            if (!data) return;

            if (typeof data === "string") {
                this.font(this.fontName + "-Bold").fontSize(size).opacity(opacity);
                this.text(data, startX, startY).opacity(1);
                startY = this.y + columnSpacing + 2;
            } else if (typeof data === "object") {
                data.label && this.font(this.fontName + "-Bold").fontSize(data.fontSize || size).text(data.label, startX, startY);
            }
        };

        const addFooter = () => {
            this.font(this.fontName).fontSize(7).opacity(0.6);
            this.text(footer || title, startX, this.page.height - 50, {
                lineBreak: false,
                align: "left"
            });
            this.image("data/logo.png", this.page.width - 130, this.page.height - 49.5, {
                width: 9.482,
                height: 7.557
            });
            this.fontSize(7).text(now.toLocaleString(), this.page.width - 115, this.page.height - 50, {
                lineBreak: false,
                align: "right"
            }).opacity(1);
        };


        // add a new page before crate table
        options.addPage === true && this.addPage();

        // create title and subtitle
        createTitle(title, 14, 0.8);
        createTitle(subtitle, 9, 0.6);
        addFooter();


        // add space after title
        if (title || subtitle) {
            startY += 3;
        }

        const onFirePageAdded = () => {
            startY = this.page.margins.top;
            rowBottomY = 0;
            addHeader();
            addFooter();
        };

        // add fire
        this.on("pageAdded", onFirePageAdded);

        const separationsRow = (x, y, strokeWidth, strokeOpacity) => {

            // validate
            strokeOpacity || (strokeOpacity = 0.5);
            strokeWidth || (strokeWidth = 0.5);

            // distance
            const d = rowDistance * 1.5;
            // margin
            const m = options.x || this.page.margins.left;

            // draw
            this
                .moveTo(x, y - d)
                .lineTo(x + tableWidth - m, y - d)
                .lineWidth(strokeWidth)
                .opacity(strokeOpacity)
                .stroke()
                // Reset opacity after drawing the line
                .opacity(1);

        };

        const prepareRowOptions = (row) => {

            // validate
            if (typeof row !== "object" || !row.hasOwnProperty("options")) return;

            const { fontFamily, fontSize, color } = row.options;

            fontFamily && this.font(fontFamily);
            fontSize && this.fontSize(fontSize);
            color && this.fillColor(color);
        };

        const prepareRowBackground = (row, rect) => {

            if (typeof row !== "object") return;

            row.options && (row = row.options);

            if (row.hasOwnProperty("backgroundColor")) {
                const { backgroundColor, backgroundOpacity } = row;
                this._addBackground(rect, backgroundColor, backgroundOpacity);
            }

            if (row.hasOwnProperty("background")) {
                const { color, opacity } = row.background;
                this._addBackground(rect, color, opacity);
            }
        };

        const computeRowHeight = (row) => {

            let result = 0;

            // if row is object, content with property and options
            if (!Array.isArray(row) && typeof row === "object" && !row.hasOwnProperty("property")) {
                const cells = [];
                // get all properties names on header
                table.headers.forEach(({ property }) => cells.push(row[property]));
                // define row with properties header
                row = cells;
            }

            row.forEach((cell, i) => {

                let text = cell;

                // object
                // read cell and get label of object
                if (typeof cell === "object") {
                    // define label
                    text = String(cell.label);
                    // apply font size on calc about height row
                    cell.hasOwnProperty("options") && prepareRowOptions(cell);
                }

                text = String(text).replace("bold:", "");

                // calc
                // calc height size of string
                const cellHeight = this.heightOfString(text, {
                    width: columnSizes[i],
                    align: "left",
                });

                result = Math.max(result, cellHeight);

            });

            return result + columnSpacing;
        };

        // Calc columns size
        const calcColumnsSizes = () => {

            let h = []; // header width
            let p = []; // position
            let w;  // table width

            // 1o - Max size table
            w = this.page.width - this.page.margins.right - (options.x || this.page.margins.left);
            // 2o - Size defined
            options.width && (w = String(options.width).replace(/\D/g, ""));

            // 1o
            table.headers.forEach((el) => {
                el.width && h.push(el.width); // - columnSpacing
            });
            // 2o
            if (h.length === 0) {
                h = options.columnsSize;
            }
            // 3o
            if (h.length === 0) {
                columnWidth = (w / table.headers.length); // - columnSpacing // define column width
                table.headers.forEach(() => h.push(columnWidth));
            }

            // Set columnPositions
            h.reduce((prev, curr) => {
                p.push(prev >> 0);
                return prev + curr;
            }, (options.x || this.page.margins.left));

            // Set columnSizes
            h.length && (columnSizes = h);
            p.length && (columnPositions = p);

            // 3o - Sum last position + lest header width
            w = p[p.length - 1] + h[h.length - 1];

            // Set tableWidth
            w && (tableWidth = w);
        };

        const addHeader = () => {
            // Allow the user to override style for headers
            prepareHeader();


            rowHeight = computeRowHeight(table.headers);
            lastPositionX = startX;

            if (table.headers.length > 0) {

                // simple header
                if (typeof table.headers[0] === "string") {
                    // print headers
                    table.headers.forEach((header, i) => {

                        // background header
                        const rectCell = {
                            x: lastPositionX,
                            y: startY - columnSpacing - (rowDistance * 2),
                            width: columnSizes[i],
                            height: rowHeight + columnSpacing,
                        };

                        // add background
                        this._addBackground(rectCell);

                        this.fillColor("white").text(header, lastPositionX + 2, startY, {
                            width: columnSizes[i] >> 0,
                            align: "left",
                        });

                        lastPositionX += columnSizes[i] >> 0;

                    });

                    this.fillColor("black")
                        .fillOpacity(0.7)
                        .fill();

                } else {

                    // Print all headers
                    table.headers.forEach((dataHeader, i) => {

                        let { label, width, renderer } = dataHeader;
                        // check defination
                        width = width || columnSizes[i];
                        // force number
                        width = width >> 0;

                        if (renderer && typeof renderer === "string") {
                            table.headers[i].renderer = fEval(renderer);
                        }

                        // background header
                        const rectCell = {
                            x: lastPositionX,
                            y: startY - columnSpacing - (rowDistance * 2),
                            width: width,
                            height: rowHeight + columnSpacing,
                        };

                        // add background
                        this._addBackground(rectCell);

                        // write
                        this.text(label, lastPositionX, startY, {
                            width: width,
                            align: "left",
                        });

                        lastPositionX += width;

                    });

                }

                // set style
                prepareRowOptions(table.headers);

            }

            // Refresh the y coordinate of the bottom of the headers row
            rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

            // Separation line between headers and rows
            separationsRow(startX, rowBottomY);

            // Datas
            table.datas.forEach((row, i) => {

                rowHeight = computeRowHeight(row);

                // Switch to next page if we cannot go any further because the space is over.
                // For safety, consider 3 rows margin instead of just one
                // if (startY + 2 * rowHeight < maxY) startY = rowBottomY + columnSpacing + rowDistance; // 0.5 is spacing rows
                // else this.addPage();
                if (startY + 2 * rowHeight >= maxY) this.addPage();
                startY = rowBottomY + columnSpacing + rowDistance; // 0.5 is spacing rows

                const rectRow = {
                    x: startX,
                    y: startY - columnSpacing - (rowDistance * 2),
                    width: tableWidth - startX,
                    height: rowHeight + columnSpacing,
                };

                // add background row
                prepareRowBackground(row, rectRow);

                lastPositionX = startX;

                // Print all cells of the current row
                table.headers.forEach((dataHeader, index) => {

                    let { property, width, renderer } = dataHeader;
                    // check defination
                    width = width || columnWidth;

                    const rectCell = {
                        x: lastPositionX,
                        y: startY - columnSpacing - (rowDistance * 2),
                        width: width,
                        height: rowHeight + columnSpacing,
                    };

                    // allow the user to override style for rows
                    prepareRowOptions(row);
                    prepareRow(row, index, i, rectRow);

                    let text = row[property];

                    // cell object
                    if (typeof text === "object") {

                        text = String(text.label); // get label
                        // row[property].hasOwnProperty('options') && prepareRowOptions(row[property]); // set style

                        // options if text cell is object
                        if (row[property].hasOwnProperty("options")) {

                            // set font style
                            prepareRowOptions(row[property]);
                            prepareRowBackground(row[property], rectCell);

                        }

                    } else {

                        // style column by header
                        prepareRowBackground(table.headers[index], rectCell);

                    }

                    // bold
                    if (String(text).indexOf("bold:") === 0) {
                        this.font(this.fontName + "-Bold");
                        text = text.replace("bold:", "");
                    }

                    // size
                    if (String(text).indexOf("size") === 0) {
                        let size = String(text).substr(4, 2).replace(":", "").replace("+", "") >> 0;
                        this.fontSize(size < 7 ? 7 : size);
                        text = text.replace(`size${size}:`, "");
                    }

                    // renderer column
                    // renderer && (text = renderer(text, index, i, row, rectRow, rectCell)) // value, index-column, index-row, row  nbhmn
                    if (typeof renderer === "function") {
                        text = renderer(text, index, i, row, rectRow, rectCell); // value, index-column, index-row, row
                    }

                    this.text(text.slice(0, 250), lastPositionX, startY, {
                        width: width,
                        align: "left",
                    });
                    lastPositionX += width;

                    // set style
                    prepareRowOptions(row);
                    prepareRow(row, index, i, rectRow);

                });

                // Refresh the y coordinate of the bottom of this row
                rowBottomY = Math.max(startY + rowHeight, rowBottomY);

                // Separation line between rows
                separationsRow(startX, rowBottomY);

                // review this code
                if (row.hasOwnProperty("options")) {
                    if (row.options.hasOwnProperty("separation")) {
                        // Separation line between rows
                        separationsRow(startX, rowBottomY, 1, 1);
                    }
                }

            });
            // End datas
        };

        calcColumnsSizes();
        addHeader();

        // Rows
        table.rows.forEach((row, i) => {

            const rowHeight = computeRowHeight(row);

            // Switch to next page if we cannot go any further because the space is over.
            // For safety, consider 3 rows margin instead of just one
            // if (startY + 3 * rowHeight < maxY) startY = rowBottomY + columnSpacing + rowDistance; // 0.5 is spacing rows
            // else this.addPage();
            if (startY + 2 * rowHeight >= maxY) this.addPage();
            startY = rowBottomY + columnSpacing + rowDistance; // 0.5 is spacing rows

            const rectRow = {
                x: columnPositions[0],
                // x: startX,
                y: startY - columnSpacing - (rowDistance * 2),
                width: tableWidth - startX,
                height: rowHeight + columnSpacing,
            };

            lastPositionX = startX;

            row.forEach((cell, index) => {

                const rectCell = {
                    // x: columnPositions[index],
                    x: lastPositionX,
                    y: startY - columnSpacing - (rowDistance * 2),
                    width: columnSizes[index],
                    height: rowHeight + columnSpacing,
                };

                prepareRowBackground(table.headers[index], rectCell);

                // Allow the user to override style for rows
                prepareRow(row, index, i, rectRow);

                // renderer column
                if (typeof table.headers[index] === "object") {
                    table.headers[index].renderer && (cell = table.headers[index].renderer(cell, index, i, row, rectRow, rectCell)); // text-cell, index-column, index-line, row
                }

                this.text(cell, lastPositionX + 2, startY, {
                    width: columnSizes[index],
                    align: "left",
                });

                lastPositionX += columnSizes[index];

            });

            // Refresh the y coordinate of the bottom of this row
            rowBottomY = Math.max(startY + rowHeight, rowBottomY);

            // Separation line between rows
            separationsRow(startX, rowBottomY);

        });
        // End rows

        // update position
        this.x = startX;
        this.y = rowBottomY; // position y final;
        this.moveDown(); // break

        // add fire
        this.off("pageAdded", onFirePageAdded);

        return this;
    }
}
