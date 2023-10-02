/**
 * Verifica se um objeto é um objeto JavaScript (JSON) válido.
 *
 * @param {any} object - O objeto a ser verificado.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {boolean} Retorna true se o objeto for um objeto JavaScript válido, caso contrário, retorna false.
 *
 * @example
 * const jsonObject = { name: "John", age: 30 };
 * const jsonArray = [1, 2, 3];
 *
 * const isValidJsonObject = isJSON(jsonObject); // Retorna true
 * const isValidJsonArray = isJSON(jsonArray); // Retorna false
 */
const isJSON = (object) => {
    if (!object)
        return false;

    return typeof object === "object" && !Array.isArray(object);
};