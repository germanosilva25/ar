const host = `//${document.domain}:${location.port}`;
const socket = io.connect(host);

const modal = new bootstrap.Modal(".modal");

modal._element.addEventListener("hidden.bs.modal", loader.hide);

const error = (title, message) => {
    const element = modal._element;

    element.querySelector(".modal-title").innerHTML = title;
    element.querySelector(".modal-body p").innerHTML = message.replace(/\n/g, "<br/>");

    lockScreen(false);

    loader.hide();
    modal.show();
};

socket.on("connect", () => {
    loader.hide();
});

socket.on("disconnect", () => {
    loader.show("Desconectado do servidor, reconectando...");

    lockScreen(false);
});

socket.on("error", error);

socket.on("loader", (message, progress) => {
    loader.show(message, progress);

    lockScreen(true);
});

socket.on("invalid document", (message = null) => {
    const doc_element = document.getElementById("document");

    doc_element.setCustomValidityMessage(message);

    setTimeout(() => doc_element.scrollToSelf(), 50);

    toast("Documento inválido", message, "#CPF/CNPJ", "danger");
    alerty(message, "danger");

    loader.hide(true);
});

socket.on("success", (data, message) => {
    toast("Arquivo enviado!", message, "&check;", "success");

    lockScreen(false);

    loader.hide();

    let doc = new jsPDF("L");

    if (data instanceof Array) {
        data.forEach((item, index) => {
            doc = makePdf(doc, item);

            if (index < data.length - 1)
                doc.addPage();
        });
    } else
        doc = makePdf(doc, data);

    iframe.src = doc.output("bloburl");
});