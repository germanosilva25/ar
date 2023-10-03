if (!window.jsPDF) window.jsPDF = jspdf.jsPDF;

/**
 * Adiciona texto a um documento PDF criado com jsPDF.
 *
 * @param {number} fontSize - O tamanho da fonte do texto.
 * @param {string} text - O texto a ser adicionado ao documento.
 * @param {number} x - A coordenada X onde o texto será posicionado no PDF.
 * @param {number} y - A coordenada Y onde o texto será posicionado no PDF.
 * @param {object=} options - Opções adicionais de formatação do texto (opcional).
 * @param {boolean=} isBold - Define se o texto deve ser exibido em negrito (opcional, padrão é false).
 * @param {number=} font - O índice da fonte a ser usada (0 para "Arial", 1 para "TrebuchetMS" ou fonte personalizada) (opcional, padrão é 1).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {object} A instância jsPDF para permitir chamadas encadeadas.
 *
 * @example
 * // Exemplo de uso:
 * const pdf = new jsPDF();
 * pdf.addText(12, "Texto normal", 20, 20);
 * pdf.addText(14, "Texto em negrito", 20, 40, {}, true);
 * pdf.save("exemplo.pdf");
 *
 * // No exemplo acima, criamos um documento PDF usando jsPDF e adicionamos dois trechos de texto.
 * // O primeiro trecho usa uma fonte padrão ("TrebuchetMS") com tamanho de fonte 12.
 * // O segundo trecho é exibido em negrito, usa uma fonte diferente ("Arial") e tem tamanho de fonte 14.
 * // O documento PDF resultante é salvo com o nome "exemplo.pdf".
 */
jsPDF.API.addText = function(fontSize, text, x, y, options = {}, isBold = false, font = 1) {
    const fonts = [ "Arial", "TrebuchetMS" ];
    const bold = isBold ? "bold" : "normal";

    this.setFont(fonts[font] || font, bold);
    this.setFontSize(fontSize);
    this.text(text, x, y, options);

    return this;
};

/**
 * Adiciona um código de barras a um documento PDF gerado com jsPDF.
 *
 * @param {string} text - O texto a ser codificado no código de barras.
 * @param {number} x - A coordenada x da posição onde o código de barras será adicionado.
 * @param {number} y - A coordenada y da posição onde o código de barras será adicionado.
 * @param {number} width - A largura do código de barras.
 * @param {number} height - A altura do código de barras.
 * @param {object=} options - Opções de configuração do código de barras (opcional).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {object} A instância do objeto jsPDF para permitir chamadas encadeadas.
 *
 * @example
 * // Exemplo de uso:
 * const pdf = new jsPDF();
 * const barcodeText = "123456789"; // Texto a ser codificado no código de barras
 * const xPosition = 20;
 * const yPosition = 30;
 * const barcodeWidth = 80;
 * const barcodeHeight = 40;
 * const barcodeOptions = { bcid: "code128" }; // Tipo de código de barras
 *
 * pdf.barCode(barcodeText, xPosition, yPosition, barcodeWidth, barcodeHeight, barcodeOptions);
 *
 * // Após adicionar o código de barras, você pode salvar o PDF ou realizar outras operações.
 * pdf.save("documento_com_codigo_de_barras.pdf");
 */
jsPDF.API.barCode = function(text, x, y, width, height, options = {}) {
    bwipjs.toCanvas(canvas, {
        ...{ bcid: "code128", text },
        ...options
    });

    this.addImage(canvas, "PNG", x, y, width, height);

    return this;
};

/**
 * Extensão da biblioteca jsPDF para adicionar um triângulo em um documento PDF.
 *
 * @param {number} x - A coordenada x do vértice inferior esquerdo do triângulo.
 * @param {number} y - A coordenada y do vértice inferior esquerdo do triângulo.
 * @param {number} width - A largura do triângulo.
 * @param {number} height - A altura do triângulo.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha criado um objeto jsPDF chamado "pdf" e deseja adicionar um triângulo ao documento.
 *
 * // Você pode usar a função "addTriangle" assim:
 * pdf.addTriangle(50, 50, 40, 60); // Adiciona um triângulo com vértice inferior esquerdo em (50, 50), largura 40 e altura 60
 *
 * // Após chamar a função, o triângulo será adicionado ao documento PDF criado com jsPDF.
 */
jsPDF.API.addTriangle = function(x, y, width, height) {
    let x1 = x, y1 = y,
        x2 = x1 + (width / 2),
        y2 = y1 - height,
        x3 = x1 + width,
        y3 = y1;

    this.triangle(x1, y1, x2, y2, x3, y3);
};

/**
 * Adiciona um retângulo arredondado com cantos de raio igual em um documento PDF criado com jsPDF.
 *
 * @param {number} x - A coordenada x do canto superior esquerdo do retângulo.
 * @param {number} y - A coordenada y do canto superior esquerdo do retângulo.
 * @param {number} radius - O raio dos cantos arredondados do retângulo.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * const doc = new jsPDF();
 *
 * // Adiciona um retângulo arredondado com cantos de raio 10 na posição (20, 30) do documento.
 * doc.addRectangle(20, 30, 10);
 *
 * // Salva ou exibe o documento, dependendo da ação desejada.
 * // doc.save("arquivo.pdf"); // Para salvar o documento em um arquivo PDF.
 * // doc.output("dataurlnewwindow"); // Para exibir o documento em uma nova janela do navegador.
 *
 * // No exemplo acima, a função personalizada addRectangle é usada para adicionar um retângulo arredondado ao documento PDF criado com jsPDF.
 */
jsPDF.API.addRectangle = function(x, y, radius) {
    this.roundedRect(x, y, radius, radius, radius, radius);
};

/**
 * Adiciona um conjunto complexo de retângulos e códigos de barras a um documento PDF.
 *
 * @param {object} data - Um objeto contendo os números dos objetos.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {jsPDF} A instância do objeto jsPDF atualizada.
 *
 * @example
 * // Exemplo de uso:
 * const doc = new jsPDF();
 *
 * const data = {
 *     objectNumber: "123456",
 *     objectNumberAA: "789012"
 * };
 *
 * // Adicione um conjunto complexo de retângulos e códigos de barras ao documento PDF:
 * doc.addRect(data);
 *
 * // Salve o documento PDF no arquivo ou visualize-o no navegador.
 * doc.save("meuDocumento.pdf");
 *
 * // No exemplo acima, a função `addRect` é usada para adicionar retângulos e códigos de barras ao documento PDF.
 * // Os detalhes específicos de posicionamento e tamanho dos retângulos e códigos de barras são definidos dentro da função.
 */
jsPDF.API.addRect = function(data) {
    const w = this.internal.pageSize.getWidth();
    const h = this.internal.pageSize.getHeight();

    const datamatrix = `${data.objectNumberAA}${data.clientIdentifier}`;

    let x = (w - 210) / 2,
        y = (h - 91) / 2;

    // Retângulo principal
    this.rect(x, y, 210, 91);

    // Códigos de barras (imagem)
    this.barCode(data.zipCode, x + 28, y + 39.5, 25, 11);
    this.barCode(data.objectNumber, x + 14.5, y + 73, 56, 15);
    this.barCode(datamatrix, x + 135.6, y + 10.5, 13.5, 13.5, { bcid: "datamatrix", padding: 4.5 }); // datamatrix code
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