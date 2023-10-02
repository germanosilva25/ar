/**
 * Calcula o hash hexadecimal de uma string.
 *
 * @param {string} str - A string para a qual o hash será calculado.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {string} Uma representação hexadecimal do hash calculado.
 *
 * @example
 * // Exemplo de uso:
 * const inputString = "Hello, World!";
 *
 * const hash = hashStringToHex(inputString);
 * console.log(hash); // Saída: "12a9b02a"
 */
const hashStringToHex = (str) => {
    let hash = 0;

    if (str.length === 0)
        return hash.toString(16);

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }

    return hash.toString(16);
};