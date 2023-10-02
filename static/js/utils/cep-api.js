let last_cep;

/**
 * Busca informações de um CEP em uma API de serviços de CEP (API ViaCEP/BrasilAPI).
 *
 * @param {string} cep - O CEP que deseja consultar.
 * @param {number=} api - O índice da API a ser utilizada (0 para ViaCEP, 1 para BrasilAPI, opcional, padrão é 0).
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @returns {Promise<object>} Uma promise que resolve com os detalhes do endereço correspondente ao CEP consultado.
 *
 * @example
 * // Exemplo de uso:
 * // Consultar informações de um CEP usando a API ViaCEP:
 * getCepApi("01311200").then((address) => {
 *     console.log(address); // Exibe os detalhes do endereço no console
 * }).catch((error) => {
 *     console.error(error); // Exibe um erro no console, se ocorrer
 * });
 *
 * // Consultar informações de um CEP usando a API BrasilAPI:
 * getCepApi("01311200", 1).then((address) => {
 *     console.log(address); // Exibe os detalhes do endereço no console
 * }).catch((error) => {
 *     console.error(error); // Exibe um erro no console, se ocorrer
 * });
 */
const getCepApi = async (cep, api = 0) => {
    const apiList = [
        `https://viacep.com.br/ws/${cep}/json/`,
        `https://brasilapi.com.br/api/cep/v1/${cep}`,
    ];

    return await fetch(apiList[api])
        .then(response => response.json())
        .then((response) => {
            if (response.erro) return getCepApi(cep, 1);

            return response;
        });
};

/**
 * Consulta um serviço de API para obter informações de endereço com base em um CEP fornecido e preenche campos de formulário.
 *
 * @async
 * @param {string} cep - O CEP a ser consultado.
 *
 * @author Misteregis <misteregis@gmail.com>
 * @copyright Copyright (c) 2023, Siger
 *
 * @example
 * // Exemplo de uso:
 * const inputCep = document.getElementById('cepInput');
 * inputCep.addEventListener('blur', async () => {
 *     const cep = inputCep.value;
 *     await getCep(cep);
 * });
 *
 * // No exemplo acima, a função `getCep` é usada para consultar informações de endereço com base em um CEP.
 * // A consulta é acionada quando o campo de entrada de CEP perde o foco (blur).
 * // Os dados de endereço obtidos são preenchidos automaticamente em campos de formulário correspondentes.
 */
const getCep = async (cep) => {
    const code =  cep.replace(/\D/g, '');

    if (code.length < 8 || last_cep === cep) return;

    last_cep = cep;

    const addressElements = document.querySelectorAll('.address');
    addressElements.forEach((element) => {
        element.disabled = true;

        if (!['zip-code', 'number', 'complement'].includes(element.id))
            element.value = '...';
    });

    await getCepApi(cep).then((response) => {
        let errors = '<ul class="mb-0">';

        if (response.hasOwnProperty('message')) {
            response.errors.forEach((item) => {
                errors += `<li>${item.message}</li>`;
            });

            error("Erro na consulta de CEP", `${errors}</ul>`);
        }

        const data = {
            state: response.state || response.uf || '',
            city: response.city || response.localidade || '',
            neighborhood: response.neighborhood || response.bairro || '',
            street: response.street || response.logradouro || '',
        };

        for (const key in data)
            document.querySelector(`#${key}`).value = data[key];
    });

    addressElements.forEach((element) => element.disabled = false);
};