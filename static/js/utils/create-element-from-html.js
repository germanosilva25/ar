/**
 * Cria um elemento DOM a partir de uma string HTML.
 *
 * @param {string} html_string - A string HTML a partir da qual o elemento será criado.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {HTMLElement} O elemento DOM criado a partir da string HTML.
 *
 * @example
 * // Exemplo de uso:
 * const html_string = '<p>Este é um parágrafo</p>';
 *
 * const element = createElementFromHTML(html_string);
 * document.body.appendChild(element); // Adiciona o elemento ao corpo do documento
 *
 * // No exemplo acima, a função cria um elemento <p> a partir da string HTML e o adiciona ao corpo do documento.
 */
const createElementFromHTML = (html_string) => {
    const div = document.createElement("div");

    div.innerHTML = html_string.trim();

    return div.firstChild;
};