/**
 * Exibe uma notificação de alerta dinâmica na interface do usuário.
 *
 * @param {string} message - A mensagem a ser exibida na notificação.
 * @param {string} _class - A classe de alerta que determina o estilo da notificação (opcional, padrão é "success").
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um elemento HTML com a classe "container" e um elemento "span" dentro dele.
 * // Você pode usar a função para exibir uma notificação de alerta assim:
 * alerty("Operação concluída com sucesso!", "success"); // Exibe uma notificação de sucesso
 * alerty("Atenção! Algo deu errado.", "danger"); // Exibe uma notificação de erro
 *
 * // O exemplo acima exibe notificações de alerta na interface do usuário com mensagens personalizadas.
 * // As classes de alerta possíveis são: "info", "primary", "success", "warning" e "danger".
 */
const alerty = (message, _class = "success") => {
    const span = document.querySelector(".container > span");
    const icons = {
        info: "info-fill",
        primary: "info-fill",
        success: "check-circle-fill",
        warning: "exclamation-triangle-fill",
        danger: "exclamation-triangle-fill"
    };

    const template = `<div class="alert alert-${_class} alert-dismissible fade show d-flex align-items-center mt-2 mb-0" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="${_class}:"><use xlink:href="#${icons[_class]}"></use></svg>
        <div>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </div>`;

    const div = createElementFromHTML(template);

    span.insertAdjacentElement("afterend", div);

    setTimeout(() => div.querySelector("button").click(), 5000);
};
