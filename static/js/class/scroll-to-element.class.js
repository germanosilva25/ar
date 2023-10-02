/**
 * Classe para rolar a página até um elemento específico com opções de deslocamento personalizadas.
 */
class ScrollToElement {
    /**
     * Cria uma instância de ScrollToElement.
     *
     * @param {string|HTMLElement} elementOrSelector - O elemento HTML ou seletor do elemento a ser rolado.
     * @param {boolean|null=} autofocus - Indica se o elemento deve ser focado automaticamente após a rolagem (opcional, padrão é false).
     * @param {number|null=} offsetTop - A quantidade de deslocamento em pixels do topo (opcional, padrão é 10).
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @throws {Error} Se o elemento não for encontrado ou o argumento for inválido.
     *
     * @example
     * // Exemplo de uso:
     * // Suponha que você tenha um elemento de ancoragem com o ID "myAnchor".
     *
     * // Crie uma instância do ScrollToElement usando o ID do elemento de ancoragem
     * const scroller = new ScrollToElement("myAnchor");
     *
     * // Role até o elemento de ancoragem
     * scroller.scroll();
     *
     * // Você também pode especificar um deslocamento personalizado e ativar o foco automático
     * const customScroller = new ScrollToElement("myAnchor", 20, true);
     * customScroller.scroll();
     */
    constructor(elementOrSelector, autofocus = false, offsetTop = 10) {
        this.element = this.resolveElement(elementOrSelector);
        this.autofocus = autofocus || false;
        this.offsetTop = offsetTop || 10;
    }

    /**
     * Resolve um elemento HTML com base em um seletor ou elemento fornecido.
     *
     * @param {string|HTMLElement} elementOrSelector - O elemento HTML ou seletor do elemento a ser resolvido.
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @returns {HTMLElement} O elemento HTML resolvido.
     *
     * @throws {Error} Se o elemento não for encontrado ou o argumento for inválido.
     *
     * @example
     * // Exemplo de uso:
     * // Suponha que você tenha um elemento de ancoragem com o ID "myAnchor".
     *
     * // Crie uma instância do ScrollToElement usando o ID do elemento de ancoragem
     * const scroller = new ScrollToElement("myAnchor");
     */
    resolveElement(elementOrSelector) {
        if (elementOrSelector instanceof HTMLElement) {
            return elementOrSelector;
        }

        if (typeof elementOrSelector !== "string") {
            throw new Error("Elemento inválido. Deve ser uma string de seletor ou um HTMLElement.");
        }

        const selector = elementOrSelector.startsWith("#") || elementOrSelector.startsWith(".")
            ? elementOrSelector
            : `#${elementOrSelector}`;

        const element = document.querySelector(selector);

        if (!element) {
            throw new Error(`Elemento não encontrado com o seletor '${elementOrSelector}'.`);
        }

        return element;
    }

    /**
     * Rola a página até o elemento especificado com opções de deslocamento personalizadas.
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @example
     * // Exemplo de uso:
     * // Suponha que você tenha um elemento de ancoragem com o ID "myAnchor".
     *
     * // Crie uma instância do ScrollToElement para o elemento de ancoragem
     * const anchorElement = document.getElementById("myAnchor");
     * const scroller = new ScrollToElement(anchorElement);
     *
     * // Role até o elemento de ancoragem usando as configurações padrão
     * scroller.scroll();
     *
     * // Role até o elemento de ancoragem e ative o foco automático com um deslocamento personalizado
     * const customScroller = new ScrollToElement(anchorElement, true, 20);
     * customScroller.scroll();
     */
    scroll() {
        const { top } = this.element.getBoundingClientRect();
        const offset = -this.offsetTop;

        if (this.autofocus) this.element.focus();

        const options = {
            top: top + window.scrollY + offset,
            behavior: "smooth"
        };

        window.scrollTo(options);
    }
}

/**
 * Extende o protótipo de HTMLElement com um método para rolar até o próprio elemento.
 *
 * @param {boolean|null=} autofocus - Indica se o elemento deve ser focado automaticamente após a rolagem (opcional, padrão é false).
 * @param {number|null=} offset_top - A quantidade de deslocamento em pixels do topo (opcional, padrão é 10).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {HTMLElement} O próprio elemento HTML para permitir chamadas encadeadas.
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um elemento de ancoragem com o ID "myAnchor".
 *
 * // Use o método scrollToSelf para rolar até o próprio elemento
 * const anchorElement = document.getElementById("myAnchor");
 * anchorElement.scrollToSelf();
 *
 * // Você também pode ativar o foco automático e especificar um deslocamento personalizado
 * anchorElement.scrollToSelf(true, 20);
 */
HTMLElement.prototype.scrollToSelf = function(autofocus = false, offset_top = 10) {
    const scroll_element = new ScrollToElement(this, autofocus, offset_top);

    scroll_element.scroll();

    return this;
};