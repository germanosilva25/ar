const getCepApi = async (cep, api = 0) => {
    const apiList = [
        `https://viacep.com.br/ws/${cep}/json/`,
        `https://brasilapi.com.br/api/cep/v1/${cep}`,
    ];

    return await fetch(apiList[api]).then(response => response.json()).then((response) => {
        if (response.erro) return getCepApi(cep, 1);

        return response;
    });
};

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

let last_cep;

const formatZipCode = (code) => {
    const zipCode = code.replace(/\D/g, '');
    const cepPattern = /^(\d{5})(\d{0,3})$/;
    const matches = zipCode.match(cepPattern);

    if (matches)
        return matches[2] ? `${matches[1]}-${matches[2]}` : matches[1];

    return zipCode;
};

const zipCodeElement = document.getElementById('zip-code');

zipCodeElement.onpaste = (e) => {
    // const cep = e.target.value.replace(/\D/g, "");
    const value = (e.clipboardData || window.clipboardData).getData('text');
    const cep = formatZipCode(value);

    e.target.value = cep;

    getCep(cep);
};

zipCodeElement.oninput = (e) => {
    const cep = formatZipCode(e.target.value);

    e.target.value = cep;

    getCep(cep);
};
