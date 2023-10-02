import json

from util import format_string_with_mask


class ResponseData():
    def __init__(self, response_json):
        self.data = response_json.get("data")
        self.client_data = self.data.get("dados_cliente")
        self.data_return = self.data.get("dados_devolucao")
        self.ar_data = self.data.get("dados_carta")

    def _object_data(self):
        identifier = self.client_data.get("identificador")
        object_acronym = self.data.get("sigla_objeto", "YY")
        object_number = str(self.ar_data.get("numero_objeto")).zfill(8)
        digit = self.calculate_verification_digit(object_number)
        object_number = f"{object_acronym}{object_number}{digit}BR"

        return {
            # number(4) - Código do cliente (a ser definido pelos Correios)
            "client-code": self.ar_data.get("codigo_cliente", "ABC"),

            # string(40) - Nome do cliente
            "client-name": self.data_return.get("nome"),

            # string(8) - Identificador do cliente (Literal fornecido pelos Correios)
            "client-identifier": identifier,

            # number(5) - Número sequencial de arquivo (número de remessa de arquivo - sequencial de remessa de arquivo)
            "shipping": self.ar_data.get("lote"),

            # string(2) - Sigla do objeto (tipo postal)
            "object-acronym": object_acronym,

            # number(9) - Número do objeto (faixas fornecidas pelos Correios sem o DV, o cliente deve gera-lo)
            "object-number": object_number,

            # string(60) - Conteúdo (livre para o usuário)
            "free-content": ""
        }

    def _recipient_data(self):
        data = self.ar_data

        # Dados do destinatário
        return {
            "name": data.get("nome"),
            "zip-code": format_string_with_mask(data.get("cep")),
            "street": data.get("logradouro"),
            "number": data.get("numero"),
            "complement": data.get("complemento"),
            "neighborhood": data.get("bairro"),
            "city": data.get("cidade"),
            "state": data.get("uf"),
        }

    def _return_data(self):
        data = self.data_return

        return {
            "name": data.get("nome"),
            "zip-code": format_string_with_mask(data.get("cep_devolucao")),
            "street": data.get("logradouro_devolucao"),
            "number": data.get("numero_devolucao"),
            "complement": data.get("complemento_devolucao"),
            "neighborhood": data.get("bairro_devolucao"),
            "city": data.get("cidade_devolucao"),
            "state": data.get("uf_devolucao"),
        }

    def get_data(self):
        return {
            "return-data": self._return_data(),
            "object-data": self._object_data(),
            "recipient-data": self._recipient_data()
        }

    def calculate_verification_digit(self, registration_number):
        # Verifique o tamanho do número de registro
        if not (1 <= len(registration_number) <= 8):
            raise ValueError("O número de registro deve conter de 1 a 8 dígitos.")

        # Peso associado a cada dígito
        weights = [8, 6, 4, 2, 3, 5, 9, 7]

        # Preencha com zeros à esquerda se o número de registro tiver menos de 8 dígitos
        registration_number = registration_number.zfill(8)

        # Inicialize a soma
        total = 0

        # Calcule a soma ponderada dos dígitos
        for i in range(8):
            digit = int(registration_number[i])
            weight = weights[i]
            total += digit * weight

        # Calcule o resto da divisão por 11
        remainder = total % 11

        # Verifique as regras para o dígito verificador
        if remainder == 0:
            return 5
        elif remainder == 1:
            return 0
        else:
            return 11 - remainder