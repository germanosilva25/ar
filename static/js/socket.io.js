const host = `//${document.domain}:${location.port}`;
const socket = io.connect(host);

const modal = new bootstrap.Modal(".modal");

modal._element.addEventListener("hidden.bs.modal", loader.hide);

const error = (title, message) => {
    const element = modal._element;

    element.querySelector(".modal-title").innerHTML = title;
    element.querySelector(".modal-body p").innerHTML = message.replace(/\n/g, "<br/>");

    loader.hide();
    modal.show();
};

socket.on("connect", () => {
    loader.hide();
    //hideLoader();

    console.log("Conectado ao servidor.");
});

socket.on("disconnect", () => {
    loader.show("Desconectado do servidor, reconectando...");
    //showLoader();

    console.log("Desconectado do servidor.");

    loader_busy = false;
});

// socket.on("upload_progress", (data) => {
//     const { progress } = data;

//     loader_busy = true;

//     loader.show("Enviando...", progress);
//     //showLoader();
//     window.onbeforeunload = (e) => e.preventDefault;

//     console.log("Progresso de upload: " + progress + "%");
// });

// socket.on("upload_completed", () => {
//     console.log("Arquivo enviado com sucesso!");
//     //hideLoader();
//     loader.show("Arquivo enviado com sucesso!", 100);

//     window.onbeforeunload = null;

//     setTimeout(loader.hide, 1000);

//     loader_busy = false;
// });

// socket.on("loader", (message, progress) => {
//     if (progress) progress += "%"

//     loader.show(message, progress);
// });

// socket.on("upload_error", (data) => {
//     const { title, message } = data;

//     error(title, message);
// });

socket.on("error", error);

socket.on("loader", (message, progress) => {
    if (progress) progress += "%"

    loader.show(message, progress);
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

    loader_busy = false;

    loader.hide();
    console.log(data);
    // return
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