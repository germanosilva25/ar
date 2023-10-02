
(() => {
    'use strict'

    const forms = document.querySelectorAll(".needs-validation");
    const cpf_cnpj = document.getElementById("document");

    cpf_cnpj.validateDocument = function() {
        const validator = new DocumentValidator();
        const value = validator.removeNonNumericCharacters(this.value);

        if (value.length == 11 || 14 == value.length) {
            const is_valid = validator.validateDocument(this.value);
            const type = value.length === 11 ? "CPF" : "CNPJ";

            if (!is_valid) {
                const message = `O ${type} informado não é válido.`;

                toast("Documento inválido!", message, "#CPF/CNPJ");

                this.setCustomValidityMessage(message);

                return false;
            } else
                this.setCustomValidityMessage();
        }

        return true;
    };

    cpf_cnpj.addEventListener("input", cpf_cnpj.validateDocument);

    function resetInput() {
        if (this.validity.customError)
            this.setCustomValidityMessage();
    }

    Array.from(forms).forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const valid_document = cpf_cnpj.validateDocument();

            if (!valid_document)
                cpf_cnpj.scrollToSelf();

            form.classList.add("was-validated");

            if (!form.checkValidity()) {
                form.querySelectorAll("input:invalid").forEach((element, index) => {
                    if (element.id === cpf_cnpj.id) return;

                    const message = element.validationMessage;
                    const label = element.nextElementSibling?.textContent.slice(1);
                    const pattern = element.pattern ? "#pattern" : "";

                    if (index === 0) element.scrollToSelf(true);

                    toast(label, message, pattern, "danger");

                    if (!element._events) element._events = [];

                    if (!element._events.includes(resetInput)) {
                        element._events.push(resetInput);

                        element.addEventListener("input", resetInput);
                    }
                });

                return;
            }

            document.body.classList.add("show-loader");

            const data = {};

            document.querySelectorAll("input[id]").forEach((input) => data[input.id.camelCase()] = input.value);

            if (socket.connected) {
                loader.setMessage("Por favor, aguarde...");

                socket.emit("send data", data);

                loader_busy = true;
            }

            // setTimeout(() => {
            //     generateAr(data)
            //         .then((msg) => {
            //             form.classList.remove("was-validated");
            //             form.reset();

            //             alerty(msg);
            //         })
            //         .catch((msg) => error("Erro na requisição!", msg))
            //         .finally(() => {
            //             container.classList.remove("show-loader");
            //         });
            // }, 50);
        }, false)
    });
})();

const exampleX = {
    "name": "Joaquim",
    "surname": "Manoel da Silva",
    "document": "84588236164",
    "zip-code": "71937-720",
    "street": "Quadra 202",
    "number": "100",
    "complement": "",
    "neighborhood": "Sul (Águas Claras)",
    "city": "Brasília",
    "state": "DF"
};
const example = {
    "name": "João",
    "surname": "Silva",
    "document": "123.456.789-09",
    "zip-code": "12345-678",
    "street": "Rua Exemplo",
    "number": "123",
    "complement": "Apto 101",
    "neighborhood": "Bairro Exemplo",
    "city": "Cidade Exemplo",
    "state": "SP"
};

for (const key in example)
    document.getElementById(key).value = example[key];

example.zipCode = example["zip-code"];

const span = document.createElement("span");

span.classList.add("text-danger");
span.innerText = "*";

document.querySelectorAll("[required]").forEach((e) => {
    const label = document.querySelector(`[for=${e.id}]`);

    if (label.querySelector("span.text-danger"))
        return;

    label.innerHTML = `${span.outerHTML}${label.innerHTML}`;
});

Inputmask().mask(document.getElementById("document"));