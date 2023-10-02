class Table():
    "Classe para consultar motivos de baixa e devolução."
    REASONS_FOR_DISCHARGE = {
        "01": "Entregue ao destinatário",
        "02": "Devolvido ao remetente",
        "03": "Objeto não postado fisicamente",
        "04": "Destruído com Autorização do Remetente",
        "18": "Objeto extraviado",
        "20": "Avariado",
        "29": "Roubo",
        "37": "Sinistro",
        "99": "Objeto sem AR Digital"
    }
    "Motivo de Baixa"

    REASONS_FOR_RETURN = {
        "00": "", # Não existe na tabela
        "19": "Endereço incorreto",
        "21": "Ausente ",
        "26": "Não procurado - Destinatário",
        "33": "Documentação não fornecida",
        "38": "Empresa falida",
        "48": "Endereço sem distribuição domiciliar",
        "71": "Mudou-se",
        "72": "Desconhecido",
        "73": "Recusado",
        "75": "Endereço insuficiente",
        "76": "Não existe o número indicado",
        "77": "Ausente - Devolvido ao remetente",
        "78": "Não procurado - remetente",
        "79": "Falecido"
    }
    "Motivo de devolução"

    def __init__(self):
        self.load_reasons()

    def load_reasons(self):
        "Carrega os motivos apropriados (baixa ou devolução) no dicionário de motivos."
        self.reasons = {**self.REASONS_FOR_DISCHARGE, **self.REASONS_FOR_RETURN}

    def lookup_reason(self, code):
        "Consulta e retorna o motivo associado ao código fornecido."
        return self.reasons.get(code, f"Código ({code}) desconhecido")
