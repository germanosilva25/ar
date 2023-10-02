/**
 * Formata um CEP brasileiro no formato "XXXXX-XXX" (ou "XXXXX" se for menor que 8 dígitos).
 *
 * @param {string} code - O código CEP a ser formatado.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {string} O CEP formatado.
 *
 * @example
 * // Exemplo de uso:
 * const unformattedZipCode1 = "12345678";
 * const formattedZipCode1 = formatZipCode(unformattedZipCode1);
 * console.log(formattedZipCode1); // Saída: "12345-678"
 *
 * const unformattedZipCode2 = "9876a5432";
 * const formattedZipCode2 = formatZipCode(unformattedZipCode2);
 * console.log(formattedZipCode2); // Saída: "98765-432"
 *
 * // No exemplo acima, a função `formatZipCode` é usada para formatar códigos CEP em um formato padrão brasileiro.
 * // Ela remove caracteres não numéricos e adiciona o hífen, se necessário.
 */
const formatZipCode = (code) => {
    const zipCode = code.replace(/\D/g, ''); // Remove caracteres não numéricos
    const cepPattern = /^(\d{5})(\d{0,3})$/; // Expressão regular para extrair o formato
    const matches = zipCode.match(cepPattern);

    if (matches)
        return matches[2] ? `${matches[1]}-${matches[2]}` : matches[1]; // Formata o CEP

    return zipCode; // Retorna o CEP original se não houver correspondência
};

const zipCodeElement = document.getElementById('zip-code');

/**
 * Manipula o evento de colagem (paste) no elemento de campo de CEP.
 *
 * @param {Event} e - O objeto de evento associado à ação de colagem.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * const zipCodeElement = document.getElementById("zipCodeInput");
 *
 * zipCodeElement.onpaste = (e) => {
 *     // Obtém o valor colado da área de transferência (clipboard)
 *     const value = (e.clipboardData || window.clipboardData).getData('text');
 *
 *     // Formata o valor como um CEP
 *     const cep = formatZipCode(value);
 *
 *     // Define o valor formatado no campo de CEP
 *     e.target.value = cep;
 *
 *     // Executa uma ação com o CEP, como buscar informações associadas a ele
 *     getCep(cep);
 * };
 *
 * // Neste exemplo, quando o usuário cola um valor em `zipCodeElement`, a função manipuladora
 * // é chamada para formatar o valor como um CEP, definir o valor formatado no campo e
 * // realizar uma ação com o CEP, como buscar informações relacionadas a ele.
 */
zipCodeElement.onpaste = (e) => {
    const value = (e.clipboardData || window.clipboardData).getData('text');
    const cep = formatZipCode(value);

    e.target.value = cep;

    getCep(cep);
};

/**
 * Associa uma função de formatação e busca de CEP a um campo de entrada de CEP.
 *
 * @param {Event} e - O evento de entrada acionado quando o usuário digita no campo de CEP.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * // Suponha que você tenha um campo de entrada HTML para o CEP com o ID "zipCodeElement":
 * // <input type="text" id="zipCodeElement">
 *
 * // Você pode usar o código abaixo para formatar o CEP e buscar informações do CEP quando o usuário digita:
 * const zipCodeElement = document.getElementById("zipCodeElement");
 *
 * zipCodeElement.oninput = (e) => {
 *     const cep = formatZipCode(e.target.value); // Formata o CEP
 *     e.target.value = cep; // Define o valor formatado no campo de entrada
 *     getCep(cep); // Realiza uma busca de informações do CEP
 * };
 *
 * // Neste exemplo, sempre que o usuário digitar algo no campo de CEP, a função `formatZipCode` será chamada para formatar o CEP.
 * // O valor formatado é definido de volta no campo de entrada e, em seguida, a função `getCep` é chamada para buscar informações do CEP.
 */
zipCodeElement.oninput = (e) => {
    const cep = formatZipCode(e.target.value); // Formata o CEP
    e.target.value = cep; // Define o valor formatado no campo de entrada
    getCep(cep); // Realiza uma busca de informações do CEP
};