if (!window.jsPDF) window.jsPDF = jspdf.jsPDF;

const self = window.location.href;

const max = (maxWidth) => ({ maxWidth });
const center = (maxWidth) => ({ maxWidth, align: "center" });
const timestamp = () => Math.round(+new Date() / 1000);
const canvas = document.createElement("canvas");
const container = document.querySelector(".container");
const iframe = document.getElementById("print");

iframe.addEventListener("load", function() {
    const win = this.contentWindow || this.contentDocument;

    win.print();
});

const toDay = () => (new Date).toLocaleString('pt-br', {year: "numeric", month: "2-digit", day: "numeric"});
/**
 * Formata uma string para Camel Case (camelCase)
 * @param {string} str A chave que será formatada.
 * @example
 * // Usando function:
 * camelCase("number-phone"); // "numberPhone"
 *
 * // Usando prototype:
 * "zip_code".camelCase(); // "zipCode"
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2022, Siger
 * @returns {string} A string formatada.
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
 * Cálculo do dígito verificador.
 * @param {number|string} registrationNumber O número de registro (8 dígitos).
 * @returns {number} O dígito verificador.
 */
const calculateDigitVerifier = (registrationNumber) => {
    if (typeof registrationNumber !== 'string')
        registrationNumber = registrationNumber.toString();

    if (registrationNumber.length < 8)
        registrationNumber = registrationNumber.padStart(8, 0);

    const weights = [8, 6, 4, 2, 3, 5, 9, 7];
    let sum = 0;

    for (let i = 0; i < 8; i++)
        sum += parseInt(registrationNumber[i]) * weights[i % weights.length];

    if (sum === 0) throw new Error('Número inválido!');

    const rest = sum % 11;
    const digitVerifier = rest === 0 ? 5 : rest === 1 ? 0 : 11 - rest;

    return digitVerifier;
};

const randomRegistrationNumber = () => {
    let random = Math.floor(Math.random() * (99999999 + 1));
    const digitVerifier = calculateDigitVerifier(random);
    const objectNumber = `TE${random}${digitVerifier}BR`;

    return objectNumber;
}

const makePdf = (doc, data) => {
    data.objectNumber = randomRegistrationNumber();
    data.objectNumberAA = data.objectNumber.replace('BR', 'AA');

    doc.setDocumentProperties({
        title: 'Aviso de Recebimento Digital',
        // subject: 'Aviso de Recebimento Digital',
        author: 'Secretaria Municipal de Fazenda (SMF)',
        keywords: 'ar, correios, digital',
        creator: 'jsPDF'
    });

    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    let x = (w - 210) / 2 + 10,
        y = (h - 91) / 2;

    const { name, surname, zipCode, street, number, complement, neighborhood, city, state } = data;

    const zipCodeCityState = `${zipCode} ${city} - ${state}`;
    const address = [ street, number, complement ];
    const fullName = `${name} ${surname}`;
    const fullAddress = [
        address.filter((addr) => addr).join(', '),
        neighborhood
    ];

    const fullAddressMax = doc.getStringUnitWidth(fullAddress[0]);
    const fullAddressText = fullAddress.join(fullAddressMax < 20 ? `\n` : ' — ');
    const fullAddressText2 = fullAddress.join(fullAddressMax < 25 ? `\n` : ' — ');

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
        // align: "justify",
        maxWidth: 91,
        angle: 90,
    }, 45);

    doc.addText(6, [ toDay(), "Trebuchet MS 6"], tx + 16.5, y + 7.5, center(33));

    doc.addText(9, "DESTINATÁRIO", tx, y + 20, max(60), true);
    doc.addText(9, [ fullName, fullAddressText ], tx, y + 24, max(60), true);

    doc.addText(10, zipCodeCityState, tx, y + 36, max(60), true);

    doc.addText(8, "ENDEREÇO PARA DEVOLUÇÃO DO OBJETO", tx, y + 56.2, max(60), true);
    // Palácio Araribóia - R. da Conceição, 100 - Centro, Niterói - RJ, 24020-084
    doc.addText(8, [
        "Secretaria da Fazenda de Niterói",
        "Palácio Araribóia - R. da Conceição, 100",
        "24020-084 - Centro, Niterói - RJ"
    ], tx, y + 59.8, max(60));

    doc.addText(12, data.objectNumber, x + 32.5, y + 72, center(60));

    tx = x + 67;

    doc.addText(8, "AVISO DE", tx + 11.5, y + 5.5, {}, true, "Abandon");
    doc.addText(8, "RECEBIMENTO", tx + 11.5, y + 8, {}, false, "Abandon");
    doc.addText(15, "Digital", tx + 48, y + 8, {}, true);
    doc.addText(18, "YES", tx + 99, y + 6.8, { align: "right" }, true);
    doc.addText(18, "MP", tx + 132, y + 6.8, { align: "right" }, true);

    doc.addText(8, "DESTINATÁRIO", tx, y + 13, max(60), true);
    doc.addText(7, [ fullName, fullAddressText2 ], tx, y + 16, max(60));
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
    doc.addText(8, "ENDEREÇO PARA DEVOLUÇÃO DO AR: Palacio Arariboia - R. da Conceicao, 100", tx, y + 48, max(99), true);

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

const generateArX = (data) => {
    data.objectNumber = randomRegistrationNumber();
    data.objectNumberAA = data.objectNumber.replace('BR', 'AA');

    let doc = new jsPDF("L");

    doc.setDocumentProperties({
        title: 'Aviso de Recebimento Digital',
        // subject: 'Aviso de Recebimento Digital',
        author: 'Secretaria Municipal de Fazenda (SMF)',
        keywords: 'ar, correios, digital',
        creator: 'jsPDF'
    });

    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    let x = (w - 210) / 2 + 10,
        y = (h - 91) / 2;

    const { name, surname, zipCode, street, number, complement, neighborhood, city, state } = data;

    const zipCodeCityState = `${zipCode} ${city} - ${state}`;
    const address = [ street, number, complement ];
    const fullName = `${name} ${surname}`;
    const fullAddress = [
        address.filter((addr) => addr).join(', '),
        neighborhood
    ];

    const fullAddressMax = doc.getStringUnitWidth(fullAddress[0]);
    const fullAddressText = fullAddress.join(fullAddressMax < 20 ? `\n` : ' — ');
    const fullAddressText2 = fullAddress.join(fullAddressMax < 25 ? `\n` : ' — ');

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
        // align: "justify",
        maxWidth: 91,
        angle: 90,
    }, 45);

    doc.addText(6, [ toDay(), "Trebuchet MS 6"], tx + 16.5, y + 7.5, center(33));

    doc.addText(9, "DESTINATÁRIO", tx, y + 20, max(60), true);
    doc.addText(9, [ fullName, fullAddressText ], tx, y + 24, max(60), true);

    doc.addText(10, zipCodeCityState, tx, y + 36, max(60), true);

    doc.addText(8, "ENDEREÇO PARA DEVOLUÇÃO DO OBJETO", tx, y + 56.2, max(60), true);
    // Palácio Araribóia - R. da Conceição, 100 - Centro, Niterói - RJ, 24020-084
    doc.addText(8, [
        "Secretaria da Fazenda de Niterói",
        "Palácio Araribóia - R. da Conceição, 100",
        "24020-084 - Centro, Niterói - RJ"
    ], tx, y + 59.8, max(60));

    doc.addText(12, data.objectNumber, x + 32.5, y + 72, center(60));

    tx = x + 67;

    doc.addText(8, "AVISO DE", tx + 11.5, y + 5.5, {}, true, "Abandon");
    doc.addText(8, "RECEBIMENTO", tx + 11.5, y + 8, {}, false, "Abandon");
    doc.addText(15, "Digital", tx + 48, y + 8, {}, true);
    doc.addText(18, "YES", tx + 99, y + 6.8, { align: "right" }, true);
    doc.addText(18, "MP", tx + 132, y + 6.8, { align: "right" }, true);

    doc.addText(8, "DESTINATÁRIO", tx, y + 13, max(60), true);
    doc.addText(7, [ fullName, fullAddressText2 ], tx, y + 16, max(60));
    doc.addText(7, zipCodeCityState, tx, y + 26, max(60), true);
    doc.addText(12, data.objectNumberAA, tx + 48.9, y + 32, center(100));
    doc.addText(7, "AR", tx + 88.3, y + 17, center(25), true);

    doc.addRectangle(tx + 79.5, y + 11, 17.5);
    doc.addTriangle(tx + 84.2, y + 18.5, 8, 7);
    doc.addText(3.5, "ARIAL 3,5", tx + 88.3, y + 21, center(25), false, 1);
    doc.addText(4.5, "ARIAL, NEGRITO, 4,5", tx + 88.3, y + 22.8, center(21), true, 1);
    doc.addText(4.5, "Correios", tx + 86.5, y + 26, max(21), true, 1);

    doc.addText(6, ["CARIMBO", "UNIDADE DE ENTREGA"], tx + 115.2, y + 11.8, center(32));

    doc.addText(8, "ENDEREÇO PARA DEVOLUÇÃO DO AR: Rua da Conceição, 100 - Centro", tx, y + 48, max(99), true);

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

    doc.autoPrint();

    // document.querySelector("embed").src = doc.output("bloburl");
    document.querySelector("iframe").src = doc.output("bloburl");

    // // doc.output("dataurlnewwindow");
    // let newTab = window.open();

    // newTab.location.href = doc.output("bloburl");
    // setTimeout(() => container.classList.remove("show-loader"), 500)

    container.classList.remove("show-loader");
};

const print = () => (iframe.contentWindow || iframe.contentWindow).print();

const generateArZ = async(data) => {
    // // return console.log(typeof data);
    // let doc = new jsPDF("L");

    // if (data instanceof Array) {
    //     data.forEach((item, index) => {
    //         doc = makePdf(doc, item);

    //         if (index < data.length - 1)
    //             doc.addPage();
    //     });
    // } else
    //     doc = makePdf(doc, data);

    // // doc.autoPrint();

    // iframe.src = doc.output("bloburl");

    // container.classList.remove("show-loader");
    const body = JSON.stringify(data);

    fetch(self, {method: "POST", body})
    .then((response) => response.json())
    .then((response) => {
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

        container.classList.remove("show-loader");

        if (response.data.erro)
            return error("Erro na requisição", response.data.mensagem);

        console.log(response);
    })
    .catch((err) => {
        error("Erro desconhecido!", err.mensagem)
    });
}

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

                // container.classList.remove("show-loader");
            })
            .catch((err) => {
                error("Erro desconhecido!", err.mensagem);

                if (err.hasOwnProperty("traceback"))
                    console.error(err.traceback);

                container.classList.remove("show-loader");
            });
    });
}