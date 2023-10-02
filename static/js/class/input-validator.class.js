/**
 * Classe para validar e definir classes CSS e mensagens de validação personalizadas para elementos <input>.
 */
class InputValidator {
    /**
     * Cria uma instância de InputValidator.
     *
     * @param {string|HTMLInputElement} elementOrSelector - O elemento de entrada ou seletor do elemento a ser validado.
     * @param {string=} validClass - A classe CSS a ser aplicada quando o elemento é válido (opcional, padrão é "is-valid").
     * @param {string=} invalidClass - A classe CSS a ser aplicada quando o elemento é inválido (opcional, padrão é "is-invalid").
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @throws {Error} Se o elemento não for encontrado ou o argumento for inválido.
     *
     * @example
     * // Exemplo de uso:
     * // Suponha que você tenha um elemento de entrada com o ID "myInput".
     *
     * // Crie uma instância do InputValidator usando o ID do elemento
     * const validator = new InputValidator("myInput");
     *
     * // Você também pode especificar classes CSS personalizadas (opcionalmente)
     * const customValidator = new InputValidator("myInput", "custom-valid", "custom-invalid");
     */
    constructor(elementOrSelector, validClass = "is-valid", invalidClass = "is-invalid") {
        this.element = this.resolveElement(elementOrSelector);
        this.invalidClass = invalidClass;
        this.validClass = validClass;
    }

    /**
     * Resolve um elemento de entrada com base em um seletor ou elemento fornecido.
     *
     * @param {string|HTMLInputElement} elementOrSelector - O elemento de entrada ou seletor do elemento a ser resolvido.
     * @returns {HTMLInputElement} O elemento de entrada resolvido.
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @throws {Error} Se o elemento não for encontrado ou o argumento for inválido.
     *
     * @example
     * // Exemplo de uso:
     * // Suponha que você tenha um elemento de entrada com o ID "myInput".
     *
     * // Crie uma instância do InputValidator usando o ID do elemento
     * const validator = new InputValidator("myInput");
     */
    resolveElement(elementOrSelector) {
        if (elementOrSelector instanceof HTMLInputElement) {
            return elementOrSelector;
        }

        if (typeof elementOrSelector !== "string") {
            throw new Error("Elemento inválido. Deve ser uma string de seletor ou um HTMLInputElement.");
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
     * Define a validade do elemento, aplicando classes CSS personalizadas e uma mensagem de validação personalizada.
     *
     * @param {string=} message - A mensagem de validação personalizada a ser definida (opcional, padrão é uma string vazia).
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @example
     * // Exemplo de uso:
     * // Suponha que você tenha um elemento de entrada com o ID "myInput".
     *
     * // Crie uma instância do InputValidator para o elemento de entrada
     * const inputElement = document.getElementById("myInput");
     * const validator = new InputValidator(inputElement);
     *
     * // Defina uma mensagem de validação personalizada para o elemento
     * validator.setValidity("Este campo é obrigatório.");
     *
     * // Após chamar setValidity, as classes CSS e a mensagem de validação personalizada são aplicadas ao elemento.
     * // Se o campo estiver inválido, a classe "is-invalid" será aplicada e a mensagem será exibida.
     * // Se o campo estiver válido, a classe "is-valid" será aplicada.
     */
    setValidity(message = "") {
        const addClass = message ? this.invalidClass : this.validClass;
        const removeClass = message ? this.validClass : this.invalidClass;

        this.element.classList.remove(removeClass);
        this.element.classList.add(addClass);
        this.element.setCustomValidity(message);
    }
}

/**
 * Extende o protótipo de HTMLInputElement com um método para definir mensagens de validação personalizadas.
 *
 * @param {string=} message - A mensagem de validação personalizada a ser definida (opcional, padrão é uma string vazia).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {HTMLInputElement} O próprio elemento HTML para permitir chamadas encadeadas.
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um elemento de entrada com o ID "myInput".
 *
 * // Use o método setCustomValidityMessage para definir uma mensagem de validação personalizada
 * const inputElement = document.getElementById("myInput");
 * inputElement.setCustomValidityMessage("Este campo é obrigatório.");
 */
HTMLInputElement.prototype.setCustomValidityMessage = function(message) {
    const validator = new InputValidator(this);

    validator.setValidity(message);

    return this;
};
