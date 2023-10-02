/**
 * Classe para validar números de CPF e CNPJ em documentos.
 */
class DocumentValidator {
    constructor(document = null) {
        // Bind do método removeNonNumericCharacters para garantir que ele seja chamado no contexto correto.
        // this.removeNonNumericCharacters = this.removeNonNumericCharacters.bind(this);

        if (document)
            return this.validateDocument(document);
    }

    /**
     * Remove todos os caracteres não numéricos de uma string.
     *
     * @param {string} inputStr - A string da qual os caracteres não numéricos serão removidos.
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @returns {string} A string resultante após a remoção dos caracteres não numéricos.
     *
     * @example
     * // Exemplo de uso:
     * const validator = new DocumentValidator();
     * const input = '123-456-7890';
     * const numericString = validator.removeNonNumericCharacters(input);
     * console.log(numericString); // Saída: '1234567890'
     */
    removeNonNumericCharacters(inputStr) {
        // Remove todos os caracteres não numéricos de uma string
        return inputStr.replace(/[^0-9]/g, '');
    }

    /**
     * Valida um número de CPF.
     *
     * @param {string} cpf - O número de CPF a ser validado.
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @returns {boolean} true se o CPF for válido, false caso contrário.
     *
     * @example
     * // Exemplo de uso:
     * const validator = new DocumentValidator();
     * const cpf = '123.456.789-09';
     * const isValid = validator.validateCPF(cpf);
     * console.log(isValid); // Saída: true
     */
    validateCPF(cpf) {
        cpf = this.removeNonNumericCharacters(cpf);

        let v1 = 0;
        let v2 = 0;
        let aux = false;

        for (let i = 1; i < cpf.length; i++) {
            if (cpf[i - 1] !== cpf[i])
                aux = true;
        }

        if (!aux)
            return false;

        for (let i = 0; i < cpf.length - 2; i++)
            v1 += parseInt(cpf[i]) * (10 - i);

        v1 = ((v1 * 10) % 11);

        if (v1 === 10)
            v1 = 0;

        if (v1 !== parseInt(cpf[9]))
            return false;

        for (let i = 0; i < cpf.length - 1; i++)
            v2 += parseInt(cpf[i]) * (11 - i);

        v2 = ((v2 * 10) % 11);

        if (v2 === 10)
            v2 = 0;

        return v2 === parseInt(cpf[10]);
    }

    /**
     * Valida um número de CNPJ.
     *
     * @param {string} cnpj - O número de CNPJ a ser validado.
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @returns {boolean} true se o CNPJ for válido, false caso contrário.
     *
     * @example
     * // Exemplo de uso:
     * const validator = new DocumentValidator();
     * const cnpj = '12.345.678/0001-95';
     * const isValid = validator.validateCNPJ(cnpj);
     * console.log(isValid); // Saída: true
     */
    validateCNPJ(cnpj) {
        cnpj = this.removeNonNumericCharacters(cnpj);

        let v1 = 0;
        let v2 = 0;
        let aux = false;

        for (let i = 1; i < cnpj.length; i++) {
            if (cnpj[i - 1] !== cnpj[i])
                aux = true;
        }

        if (!aux)
            return false;

        let p1 = 5;
        let p2 = 13;

        for (let i = 0; i < cnpj.length - 2; i++) {
            if (p1 >= 2)
                v1 += parseInt(cnpj[i]) * p1;
            else
                v1 += parseInt(cnpj[i]) * p2;

            p1--;
            p2--;
        }

        v1 = (v1 % 11);

        if (v1 < 2)
            v1 = 0;
        else
            v1 = (11 - v1);

        if (v1 !== parseInt(cnpj[12]))
            return false;

        p1 = 6;
        p2 = 14;

        for (let i = 0; i < cnpj.length - 1; i++) {
            if (p1 >= 2)
                v2 += parseInt(cnpj[i]) * p1;
            else
                v2 += parseInt(cnpj[i]) * p2;

            p1--;
            p2--;
        }

        v2 = (v2 % 11);

        if (v2 < 2)
            v2 = 0;
        else
            v2 = (11 - v2);

        return v2 === parseInt(cnpj[13]);
    }

    /**
     * Valida um documento (CPF ou CNPJ).
     *
     * @param {string} document - O documento a ser validado.
     *
     * @author Misteregis <misteregis@gmail.com>
     * @copyright Copyright (c) 2023, Siger
     *
     * @returns {boolean} true se o documento for válido, false caso contrário.
     *
     * @example
     * // Exemplo de uso:
     * const validator = new DocumentValidator();
     * const cpf = '000.000.001-91';
     * const cnpj = '00.000.000/0001-91';
     *
     * const isValidCPF = validator.validateDocument(cpf);
     * console.log(isValidCPF); // Saída: true
     *
     * const isValidCNPJ = validator.validateDocument(cnpj);
     * console.log(isValidCNPJ); // Saída: true
     */
    validateDocument(document) {
        document = this.removeNonNumericCharacters(document);
        const length = document.length;

        if (length === 14)
            return this.validateCNPJ(document);

        if (length === 11)
            return this.validateCPF(document);

        if (length < 11)
            return this.validateDocument(document.padEnd(11, '0'));

        if (length < 14)
            return this.validateDocument(document.padEnd(14, '0'));

        return false;
    }
}