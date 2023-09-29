if (!window.jsPDF) window.jsPDF = jspdf.jsPDF;

/**
 * Adiciona um texto ao documento.
 * @param {number} fontSize - O tamanho da fonte.
 * @param {string} text - O texto.
 * @param {number} x - Posição X.
 * @param {number} y - Posição Y.
 * @param {json} options - Um objeto JSON com as opções do this.text().
 * @param {boolean} [isBold=false] - True para negrito. Padrão false.
 * @param {number} [font=1] - A fonte do texto, 0 = Arial e 1 TrebuchetMS. Padrão 1.
 * @name addText
 * @returns {jsPDF.API} O documento.
 */
jsPDF.API.addText = function(fontSize, text, x, y, options = {}, isBold = false, font = 1) {
    const fonts = [ "Arial", "TrebuchetMS" ];
    const bold = isBold ? "bold" : "normal";

    this.setFont(fonts[font] || font, bold);
    this.setFontSize(fontSize);
    this.text(text, x, y, options);

    return this;
}

jsPDF.API.barCode = function(text, x, y, width, height, options = {}) {
    bwipjs.toCanvas(canvas, {
        ...{ bcid: "code128", text },
        ...options
    });

    this.addImage(canvas, "PNG", x, y, width, height);

    return this;
};

jsPDF.API.addTriangle = function(x, y, width, height) {
    let x1 = x, y1 = y,
        x2 = x1 + (width / 2),
        y2 = y1 - height,
        x3 = x1 + width,
        y3 = y1;

    this.triangle(x1, y1, x2, y2, x3, y3);
};

jsPDF.API.addRectangle = function(x, y, radius) {
    this.roundedRect(x, y, radius, radius, radius, radius);
};

jsPDF.API.addRect = function(data) {
    const w = this.internal.pageSize.getWidth();
    const h = this.internal.pageSize.getHeight();

    let x = (w - 210) / 2,
        y = (h - 91) / 2;

    // Retângulo principal
    this.rect(x, y, 210, 91);

    // Códigos de barras (imagem)
    this.barCode('71937720', x + 28, y + 39.5, 25, 11);
    this.barCode(data.objectNumber, x + 14.5, y + 73, 56, 15);
    // this.barCode("barcode", x +138, y + 12, 10, 10, { bcid: "datamatrix" }); // datamatrix code
    this.barCode(`${data.objectNumberAA}YES`, x + 135.6, y + 10.5, 13.5, 13.5, { bcid: "datamatrix", padding: 4.5 }); // datamatrix code
    this.barCode(data.objectNumberAA, x + 89, y + 33, 73, 10, { bcid: "code39" });

    x += 10; y += .5;
    this.setLineDash([2, 1]);
    this.line(x + 65, y + .5, x + 65, x + 96);

    this.setLineDash();

    this.line(x, y, x, x + 95.5);
    this.line(x, y, x + 65, y);
    this.line(x, y + 14, x + 65, y + 14);
    this.line(x, y + 89, x + 65, y + 89);

    // -------------------
    x += 1 + 65; y = y + 9;
    this.rect(x, y, 99, 35);

    // 19,5 x 19,5 mm
    // this.rect(x + 79, y, 19.5, 19.5);

    this.rect(x + 99, y, 34, 40);

    y += + 35;
    this.rect(x, y, 99, 5);

    y += 5;
    this.rect(x, y, 57, 19);
    this.rect(x + 57, y, 42, 19);
    this.rect(x + 57 + 42, y, 34, 19);

    y += 19;
    this.rect(x, y, 133, 7);

    y += 7;
    this.rect(x, y, 99, 7);
    this.rect(x + 99, y, 34, 7);

    y += 7;
    this.rect(x, y, 99, 7);
    this.rect(x + 99, y, 34, 7);

    // -- 3 x 2,5 mm
    x += 58.5; y -= 29.5;
    this.rect(x, y, 3, 2.5);
    this.rect(x + 24, y, 3, 2.5);

    y += 3;
    this.rect(x, y, 3, 2.5);
    this.rect(x + 24, y, 3, 2.5);

    y += 3;
    this.rect(x, y, 3, 2.5);
    this.rect(x + 24, y, 3, 2.5);

    y += 3;
    this.rect(x, y, 3, 2.5);
    this.rect(x + 24, y, 3, 2.5);

    y += 3;
    this.rect(x, y, 3, 2.5);
    // --------------------

    return this;
};