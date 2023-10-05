if (!window.jsPDF) window.jsPDF = jspdf.jsPDF;

const self = window.location.href;

const max = (maxWidth) => ({ maxWidth });
const center = (maxWidth) => ({ maxWidth, align: "center" });
const timestamp = () => Math.round(+new Date() / 1000);
const canvas = document.createElement("canvas");
const container = document.querySelector(".container");
const iframe = document.createElement("iframe");
const form = document.forms[0];

document.body.appendChild(iframe);

/**
 * Adiciona um evento de carregamento a um elemento <iframe> para acionar a impressão de seu conteúdo.
 *
 * @param {Event} event - O evento de carregamento do elemento <iframe>.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um elemento HTML <iframe> com o ID "myIframe" incorporando um documento HTML.
 * // Você pode usar o código abaixo para acionar a impressão do conteúdo do <iframe> quando o documento dentro dele estiver totalmente carregado:
 *
 * const iframe = document.getElementById("myIframe");
 *
 * iframe.addEventListener("load", function() {
 *     const win = this.contentWindow || this.contentDocument;
 *     win.print(); // Aciona a impressão do conteúdo do <iframe>
 * });
 *
 * // Neste exemplo, quando o conteúdo do <iframe> estiver completamente carregado, o evento "load" será acionado,
 * // e a função associada a ele será executada, imprimindo o conteúdo do <iframe>.
 */
iframe.addEventListener("load", function() {
    const win = this.contentWindow || this.contentDocument;

    if (this.src) {
        win.print();

        form.querySelectorAll("input").forEach((element) => element.classList.remove("is-valid", "is-invalid"));
        form.classList.remove("was-validated");
        form.reset();
    }
});

/**
 * Obtém a data atual no formato "dd/mm/yyyy" em português do Brasil.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {string} A data atual formatada como uma string no formato "dd/mm/yyyy".
 *
 * @example
 * // Exemplo de uso:
 * const currentDate = toDay();
 * console.log(currentDate); // Saída: "30/09/2023" (dependendo da data atual)
 *
 * // A função `toDay` é usada para obter a data atual em formato de string no formato "dd/mm/yyyy".
 * // O exemplo acima mostra como você pode usá-la para obter a data atual e exibi-la no console.
 */
const toDay = () => (new Date).toLocaleString("pt-br", {year: "numeric", month: "2-digit", day: "numeric"});

/**
 * Converte uma string em formato "camelCase".
 *
 * @param {string} str - A string a ser convertida em "camelCase".
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {string} A string convertida em "camelCase".
 *
 * @example
 * // Exemplo de uso:
 * const inputString = "exemplo_de_texto_em_camel_case";
 *
 * const camelCasedString = camelCase(inputString);
 * console.log(camelCasedString); // Saída: "exemploDeTextoEmCamelCase"
 *
 * // No exemplo acima, a função `camelCase` é usada para converter a string em formato "camelCase".
 * // Ela remove os espaços e caracteres especiais da string e converte cada palavra após o primeiro caractere em maiúsculas.
 */
const camelCase = str => {
    let str_array = str.toLowerCase().match(/[a-z]+/g);

    if (str_array.length < 2)
        return str;

    str = str_array.shift();

    for (let word of str_array)
        str += `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

    return str;
};
String.prototype.camelCase = function () { return camelCase(this) };

/**
 * Calcula o dígito verificador de um número de registro com base em um algoritmo específico.
 *
 * @param {string|number} registrationNumber - O número de registro para o qual o dígito verificador será calculado.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {number} O dígito verificador calculado.
 * @throws {Error} Lança um erro se o número de registro for inválido.
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você precise calcular o dígito verificador de um número de registro:
 *
 * // Caso 1: Número de registro como string
 * const regNumber1 = "12345678";
 * const digitVerifier1 = calculateDigitVerifier(regNumber1);
 * console.log(digitVerifier1); // Saída: 5
 *
 * // Caso 2: Número de registro como número
 * const regNumber2 = 98765432;
 * const digitVerifier2 = calculateDigitVerifier(regNumber2);
 * console.log(digitVerifier2); // Saída: 6
 *
 * // No exemplo acima, a função `calculateDigitVerifier` é usada para calcular o dígito verificador de um número de registro.
 * // A função aceita um número de registro como argumento (pode ser uma string ou um número) e retorna o dígito verificador calculado.
 * // Se o número de registro for inválido (por exemplo, se a soma for igual a zero), um erro será lançado.
 */
const calculateDigitVerifier = (registrationNumber) => {
    if (typeof registrationNumber !== "string")
        registrationNumber = registrationNumber.toString();

    if (registrationNumber.length < 8)
        registrationNumber = registrationNumber.padStart(8, 0);

    const weights = [8, 6, 4, 2, 3, 5, 9, 7];
    let sum = 0;

    for (let i = 0; i < 8; i++)
        sum += parseInt(registrationNumber[i]) * weights[i % weights.length];

    if (sum === 0) throw new Error("Número inválido!");

    const rest = sum % 11;
    const digitVerifier = rest === 0 ? 5 : rest === 1 ? 0 : 11 - rest;

    return digitVerifier;
};

/**
 * Gera aleatoriamente um número de registro com formato específico e um dígito verificador calculado.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {string} Um número de registro gerado aleatoriamente com dígito verificador.
 *
 * @example
 * // Exemplo de uso:
 * const registrationNumber = randomRegistrationNumber();
 * console.log(registrationNumber); // Saída: "TE123456785BR" (valor gerado aleatoriamente)
 *
 * // Neste exemplo, a função `randomRegistrationNumber` é usada para gerar um número de registro aleatório seguindo um formato específico.
 * // O valor gerado inclui a parte fixa "TE", um número aleatório de 8 dígitos, e um dígito verificador calculado.
 * // O valor gerado pode variar a cada chamada da função.
 */
const randomRegistrationNumber = () => {
    let random = Math.floor(Math.random() * (99999999 + 1));
    const digitVerifier = calculateDigitVerifier(random);
    const objectNumber = `TE${random}${digitVerifier}BR`;

    return objectNumber;
}

/**
 * Cria um documento PDF personalizado com informações específicas.
 *
 * @param {jsPDF} doc - A instância da biblioteca jsPDF usada para criar o documento PDF.
 * @param {object} data - Um objeto contendo informações específicas a serem incluídas no PDF.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {jsPDF} A instância do objeto jsPDF atualizada com as informações do PDF.
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha uma instância da biblioteca jsPDF chamada "doc" e um objeto "data" com informações específicas:
 * const doc = new jsPDF();
 * const data = {
 *     "name": "João",
 *     "surname": "Silva",
 *     "document": "123.456.789-01",
 *     "zip-code": "12345-678",
 *     "street": "Rua Exemplo",
 *     "number": "123",
 *     "complement": "Apto 101",
 *     "neighborhood": "Bairro Exemplo",
 *     "city": "Cidade Exemplo",
 *     "state": "SP"
 * };
 *
 * // Use a função para criar um documento PDF personalizado com as informações do objeto "data":
 * makePdf(doc, data);
 *
 * // Salve o documento PDF no arquivo ou visualize-o no navegador.
 * doc.save("meuDocumento.pdf");
 *
 * // No exemplo acima, a função `makePdf` é usada para criar um documento PDF personalizado com informações específicas do objeto "data".
 * // O documento PDF é criado usando a biblioteca jsPDF e, em seguida, pode ser salvo em um arquivo ou visualizado no navegador.
 */
const makePdf = (doc, data) => {
    const { returnData: _ret, recipientData: _rec, objectData: _obj} = data;
    const { name: clientName } = _ret;

    const streetNumber = `${_ret.street}, ${_ret.number}`;

    var data = _obj;

    data.objectNumberAA = data.objectNumber.replace("BR", "AA");
    data.zipCode = _rec.zipCode.replace(/\D/g, "");

    doc.setDocumentProperties({
        title: "Aviso de Recebimento Digital",
        subject: data.clientIdentifier,
        author: clientName,
        keywords: "ar, correios, digital",
        creator: "jsPDF"
    });

    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    let x = (w - 210) / 2 + 10,
        y = (h - 91) / 2;

    const { name, surname, zipCode, street, number, complement, neighborhood, city, state } = _rec;

    const zipCodeCityState = `${zipCode} ${city} - ${state}`;
    const address = [ street, number, complement ];
    const fullAddress = [
        address.filter((addr) => addr).join(", "),
        neighborhood
    ];

    const fullAddressMax = doc.getStringUnitWidth(fullAddress[0]);
    const fullAddressText = fullAddress.join(fullAddressMax < 20 ? `\n` : " — ");
    const fullAddressText2 = fullAddress.join(fullAddressMax < 25 ? `\n` : " — ");

    const returnComplement = _ret.complement ? `${_ret.complement} — ` : ""

    let tx = x + 2.2;

    let cw = x + 146.5 + ((18 - 9.31) / 2);
    doc.addImage("static/images/ar.png", "png", x + 66, y, 71, 9.5);
    doc.addImage("static/images/correios_logo.png", "png", x + 69, y, 9.5, 9.5);
    doc.addImage("static/images/correios_logo2.png", "png", cw, y + 24, 2.5, 2.5);

    doc.addRect(data);

    const verseText = "(ÁREA DE COLAGEM NO VERSO)";
    const verseMax = doc.getStringUnitWidth(verseText);
    doc.setFontSize(6);
    doc.setFont("TrebuchetMS", "bold");
    doc.text(verseText, x - 4, y + 45 + verseMax, {
        maxWidth: 91,
        angle: 90,
    }, 45);

    doc.addText(6, [ toDay(), "Trebuchet MS 6"], tx + 16.5, y + 7.5, center(33));

    doc.addText(9, "DESTINATÁRIO", tx, y + 20, max(60), true);
    doc.addText(9, [ name, fullAddressText ], tx, y + 24, max(60), true);

    doc.addText(10, zipCodeCityState, tx, y + 36, max(60), true);

    doc.addText(8, "ENDEREÇO PARA DEVOLUÇÃO DO OBJETO", tx, y + 56.2, max(60), true);
    // Palácio Araribóia - R. da Conceição, 100 - Centro, Niterói - RJ, 24020-084
    doc.addText(8, [
        clientName, //"Secretaria da Fazenda de Niterói",
        `${returnComplement}${streetNumber}`,//"Palácio Araribóia - R. da Conceição, 100",
        `${_ret.zipCode} — ${_ret.neighborhood}, ${_ret.city} - ${_ret.state}`//"24020-084 - Centro, Niterói - RJ"
    ], tx, y + 59.8, max(60));

    doc.addText(12, data.objectNumber, x + 32.5, y + 72, center(60));

    tx = x + 67;

    doc.addText(8, "AVISO DE", tx + 11.5, y + 5.5, {}, true, "Abandon");
    doc.addText(8, "RECEBIMENTO", tx + 11.5, y + 8, {}, false, "Abandon");
    doc.addText(15, "Digital", tx + 48, y + 8, {}, true);
    doc.addText(18, data.clientIdentifier, tx + 99, y + 6.8, { align: "right" }, true);
    doc.addText(18, "MP", tx + 132, y + 6.8, { align: "right" }, true);

    doc.addText(8, "DESTINATÁRIO", tx, y + 13, max(60), true);
    doc.addText(7, [ name, fullAddressText2 ], tx, y + 16, max(60));
    doc.addText(7, zipCodeCityState, tx, y + 26, max(60), true);
    doc.addText(12, data.objectNumberAA, tx + 48.9, y + 32, center(100));
    doc.addText(7, "AR", tx + 88.3, y + 17, center(25), true);

    doc.addRectangle(tx + 79.5, y + 11, 17.5);
    doc.addTriangle(tx + 84.2, y + 18.5, 8, 7);
    doc.addText(3.5, "ARIAL 3,5", tx + 88.3, y + 21, center(25), false, 1);
    doc.addText(4.5, "ARIAL, NEGRITO, 4,5", tx + 88.3, y + 22.8, center(21), true, 1);
    doc.addText(4.5, "Correios", tx + 86.5, y + 26, max(21), true, 1);

    doc.addText(6, ["CARIMBO", "UNIDADE DE ENTREGA"], tx + 115.2, y + 11.8, center(32));

    // doc.addText(8, "ENDEREÇO PARA DEVOLUÇÃO DO AR: Rua da Conceição, 100 - Centro", tx, y + 48, max(99), true);
    // doc.addText(8, "ENDEREÇO PARA DEVOLUÇÃO DO AR: Palacio Arariboia - R. da Conceicao, 100", tx, y + 48, max(99), true);
    doc.addText(8, `ENDEREÇO PARA DEVOLUÇÃO DO AR: ${streetNumber}`, tx, y + 48, max(99), true);

    doc.addText(6, "TENTATIVAS DE ENTREGA", tx + 22, y + 51.6, center(44), true);
    doc.addText(7, [
        "1ª ____/____/_____  _____:_____h",
        "2ª ____/____/_____  _____:_____h",
        "3ª ____/____/_____  _____:_____h"
    ], tx, y + 56, { maxWidth: 43, lineHeightFactor: 2.30}, true);

    doc.addText(4, "(CAMPO OPCIONAL)", tx + 49.2, y + 56.5, center(14));
    doc.addText(6, "ATENÇÃO", tx + 49.2, y + 59, center(14), true);
    doc.addText(4.8, "Após a 3ª tentativa, devolver o objeto.", tx + 49.2, y + 61, center(14));

    doc.addText(6, "MOTIVOS DE DEVOLUÇÃO", tx + 77, y + 51.6, center(40), true);
    doc.addText(5, ["1", "2", "3", "4", "9"], tx + 59, y + 55, { maxWidth: 3, lineHeightFactor: 1.68, align: "center" });
    doc.addText(5, [
        "Mudou-se",
        "Endereço insuficiente",
        "Não existe o número",
        "Desconhecido",
        "Outros ______________________________"
    ], tx + 61, y + 55, { lineHeightFactor: 1.68 });
    doc.addText(5, ["5", "6", "7", "8"], tx + 83, y + 55, { maxWidth: 3, lineHeightFactor: 1.68, align: "center" });
    doc.addText(5, [
        "Recusado",
        "Não procurado",
        "Ausente",
        "Falecido"
    ], tx + 85, y + 55, { lineHeightFactor: 1.68 });

    doc.addText(6, ["RUBRICA E MATRÍCULA DO", "CARIMBO"], tx + 115.2, y + 52, center(32));

    doc.addText(6, "PARA USO EXCLUSIVO DO REMETENTE (OPCIONAL)", tx, y + 71, max(132));

    doc.addText(6, "ASSINATURA DO RECEBEDOR", tx, y + 78, max(132));
    doc.addText(6, "DATA ENTREGA", tx + 99, y + 78, max(132));
    doc.addText(6, "________/_________/_________", tx + 99, y + 81.4, max(132));

    doc.addText(6, "NOME LEGÍVEL DO RECEBEDOR", tx, y + 85, max(132));
    doc.addText(6, "Nº DOC. DE IDENTIDADE", tx + 99, y + 85, max(132));

    return doc;

};

/**
 * Aciona a impressão do conteúdo de um elemento <iframe>.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um elemento <iframe> com o nome "iframe" em seu documento HTML:
 * // <iframe name="iframe" src="conteudo_para_imprimir.html"></iframe>
 *
 * // Você pode usar a função `print` para acionar a impressão do conteúdo do <iframe> assim:
 * print(); // Inicia o processo de impressão do conteúdo do <iframe>
 *
 * // Neste exemplo, a função `print` é usada para iniciar o processo de impressão do conteúdo dentro do <iframe>.
 * // Certifique-se de que o elemento <iframe> com o nome "iframe" esteja corretamente configurado no seu documento HTML para que a função funcione corretamente.
 */
const print = () => (iframe.contentWindow || iframe.contentWindow).print();

const generateAr = async(data) => {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);

        fetch(self, { method: "POST", body })
            .then((response) => response.json())
            .then((response) => {
                if (response.error)
                    return reject(response.message);

                if (response.data.erro) {
                    if (response.data.hasOwnProperty("traceback"))
                        console.info(response.data.traceback);

                    return reject(response.data.mensagem);
                }

                resolve("Mensagem...");
                // console.log(response);
                // let doc = new jsPDF("L");

                // if (data instanceof Array) {
                //     data.forEach((item, index) => {
                //         doc = makePdf(doc, item);

                //         if (index < data.length - 1)
                //             doc.addPage();
                //     });
                // } else
                //     doc = makePdf(doc, data);

                // iframe.src = doc.output("bloburl");

                // loader.hide();
            })
            .catch((err) => {
                error("Erro desconhecido!", err.mensagem);

                if (err.hasOwnProperty("traceback"))
                    console.error(err.traceback);
            });
    });
}