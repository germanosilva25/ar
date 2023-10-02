import json

import util


class FormData():
    def __init__(self, request_json):
        _json = request_json

        self.cpfcnpj = _json.get('document')
        self.valid = util.validate_document(self.cpfcnpj)
        self.destinatario = f"{_json.get('name')} {_json.get('surname')}"
        self.numero = _json.get("number") if _json.get("number") != "" else 0

        self.logradouro = _json.get("street")
        self.bairro = _json.get("neighborhood")
        self.cidade = _json.get("city")
        self.uf = _json.get("state")
        self.cep = _json.get("zipCode")
        self.complemento = _json.get("complement")

    def get_doc_type(self):
        length = len(self.cpfcnpj)

        return "CPF" if length == 14 else "CNPJ" if length == 18 else "CPF/CNPJ"

    def get_data(self):
        if self.is_valid() is False:
            return None

        return {
            "cpfcnpj": self.cpfcnpj,
            "destinatario": self.destinatario,
            "numero": self.numero,
            "logradouro": self.logradouro,
            "bairro": self.bairro,
            "cidade": self.cidade,
            "uf": self.uf,
            "cep": self.cep,
            "complemento": self.complemento,
        }

    def is_valid(self):
        return self.valid