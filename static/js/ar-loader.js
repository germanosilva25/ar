const loader = document.querySelector(".ar-loader-container");
const loader_progress = loader.querySelector(".ar-loader-text");
const loader_message = loader.querySelector(".ar-message");

let loader_busy = false;

/**
 * Atualiza o valor de progresso de um loader ou indicador de progresso na interface do usuário.
 *
 * @param {number} progress - O valor de progresso a ser exibido (geralmente um número entre 0 e 100).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um elemento HTML com o ID "loader_progress" para exibir o progresso:
 * // <div id="loader_progress">0%</div>
 *
 * // Você pode usar a função `loader.setProgress` para atualizar o valor de progresso assim:
 * const loader_progress = document.getElementById("loader_progress");
 * loader.setProgress(50); // Atualiza o progresso para 50%
 *
 * // Após a chamada da função acima, o elemento com o ID "loader_progress" mostrará "50%" na interface do usuário.
 */
loader.setProgress = (progress) => loader_progress.textContent = progress;

/**
 * Atualiza a mensagem exibida em um elemento HTML com o ID "loader_message".
 *
 * @param {string|null} message - A mensagem a ser exibida (pode ser nula para limpar a mensagem).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um elemento HTML com o ID "loader_message" para exibir mensagens de carregamento:
 * // <div id="loader_message"></div>
 *
 * // Você pode usar a função para definir uma mensagem de carregamento assim:
 * loader.setMessage("Carregando informações..."); // Define uma mensagem de carregamento
 *
 * // Para limpar a mensagem, você pode chamar a função com uma mensagem nula:
 * loader.setMessage(null); // Limpa a mensagem de carregamento
 *
 * // No exemplo acima, a função `loader.setMessage` é usada para atualizar dinamicamente a mensagem exibida em um elemento HTML com o ID "loader_message".
 * // A mensagem é formatada para substituir quebras de linha por tags <br/> para suportar quebras de linha em HTML.
 */
loader.setMessage = (message) => loader_message.innerHTML = message?.replace(/\n/g, "<br/>");

/**
 * Oculta o componente de carregamento (loader) na interface do usuário.
 *
 * @param {boolean} force - Um parâmetro opcional que permite forçar o ocultamento do loader, ignorando qualquer bloqueio de carregamento em andamento (padrão é false).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um loader HTML com a classe "loader" e que você queira ocultá-lo:
 * // <div class="loader show"></div>
 *
 * // Você pode usar a função para ocultar o loader assim:
 * loader.hide(); // Oculta o loader normalmente, respeitando qualquer bloqueio de carregamento
 *
 * // Se você deseja forçar o ocultamento do loader, independentemente de qualquer bloqueio de carregamento:
 * loader.hide(true); // Oculta o loader forçadamente
 *
 * // No exemplo acima, a função `loader.hide` é usada para ocultar o componente de carregamento (loader) na interface do usuário.
 * // O parâmetro opcional `force` permite forçar o ocultamento do loader, se necessário.
 */
loader.hide = (force = false) => {
    if (!force && loader_busy) return;

    document.body.classList.remove("show-loader");

    loader.classList.remove("show");

    setTimeout(() => {
        loader.setProgress("");
        loader.setMessage("");

        loader_busy = false;
    }, 1000);
};

/**
 * Exibe um indicador de carregamento na interface do usuário com uma mensagem opcional e um valor de progresso opcional.
 *
 * @param {string=} message - A mensagem de carregamento a ser exibida (opcional, padrão é uma string vazia).
 * @param {number|null=} progress - O valor de progresso a ser exibido (opcional, padrão é nulo).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um objeto "loader" que representa o indicador de carregamento na interface do usuário:
 *
 * // Exiba o indicador de carregamento sem mensagem:
 * loader.show();
 *
 * // Exiba o indicador de carregamento com uma mensagem personalizada:
 * loader.show("Carregando...");
 *
 * // Exiba o indicador de carregamento com mensagem e progresso:
 * loader.show("Processando...", 50); // 50% de progresso
 *
 * // No exemplo acima, a função `loader.show` é usada para exibir um indicador de carregamento com uma mensagem opcional e um valor de progresso opcional.
 * // Você pode chamar a função sem fornecer mensagem ou progresso para exibir apenas o indicador de carregamento.
 */
loader.show = (message = "", progress = null) => {
    const percents = progress ? `${progress}` : "";

    document.body.classList.add("show-loader");

    loader.classList.add("show");

    loader.setProgress(percents);
    loader.setMessage(message);
};