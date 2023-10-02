/**
 * Exibe um toast personalizado na interface do usuário.
 *
 * @param {string} title - O título do toast.
 * @param {string} message - A mensagem a ser exibida no corpo do toast.
 * @param {string|null=} subtitle - (Opcional) O subtítulo do toast. Pode ser nulo.
 * @param {string|null=} bg - (Opcional) A cor de fundo do toast. Pode ser nulo.
 * @param {function|null=} callback - (Opcional) Uma função de retorno de chamada a ser executada após o toast ser exibido ou oculto. Pode ser nulo.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * toast("Sucesso", "A ação foi realizada com êxito", "Detalhes", "success", {
 *     show: function() {
 *         console.log("Toast exibido!");
 *     },
 *     hide: function() {
 *         console.log("Toast oculto!");
 *     }
 * });
 *
 * @returns {void} - Esta função não retorna nenhum valor (void).
 */
const toast = (title, message, subtitle = null, bg = null, callback = null) => {
    const data = hashStringToHex(`${title}|${message}|${subtitle}`);

    let container = document.querySelector(".toast-container");

    if (isJSON(bg)) {
        callback = bg;
        bg = null
    }

    if (!container) {
        container = createElementFromHTML(`<div class="toast-container position-fixed bottom-0 end-0 p-3"></div>`);

        document.body.appendChild(container);

        container._toasts = [];
    }

    if (container._toasts.includes(data)) return;

    container._toasts.push(data);

    const template = `<div role="alert" aria-live="assertive" aria-atomic="true" class="toast">
        <div class="toast-header">
            <strong class="me-auto">${title}</strong>
            <small>${subtitle||""}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
        <div class="toast-body">${message}</div>
    </div>`;

    const toast_element = createElementFromHTML(template);

    if (bg && typeof bg === "string") {
        toast_element.classList.add(`bg-${bg}`, `text-bg-${bg}`);
        toast_element.querySelector(".toast-header").classList.add(`text-bg-${bg}`);
    }

    container.appendChild(toast_element);

    toast_element.dataset.bsAutohide = true;

    const bs_toast = new bootstrap.Toast(toast_element);

    bs_toast.show();

    toast_element.addEventListener("hidden.bs.toast", () => {
        container._toasts = container._toasts.filter((t) => t !== data);

        toast_element.remove();
    });

    if (isJSON(callback)) {
        if (callback.hasOwnProperty("show") && typeof callback.show === "function")
            toast_element.addEventListener("shown.bs.toast", callback.show);

        if (callback.hasOwnProperty("hide") && typeof callback.show === "function")
            toast_element.addEventListener("hidden.bs.toast", callback.hide);
    }
};