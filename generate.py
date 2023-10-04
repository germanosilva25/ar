import os
import re
from datetime import datetime

from unidecode import unidecode

from table import Table


class TextAR:
    def __init__(self, data=None):
        self._registration_amount = 0
        self._shipping = None
        self._sequential = 1
        self._data = []
        self._txt = ""

        self.date = datetime.now()

        self.table = Table()

        self.info = None

        if data is not None:
            self.client_acronym = data.get("client-acronym")
            self.info = data.get("object-data")

            self._shipping = self.info.get("shipping")

            self.set_data([data.get("recipient-data")])

    def _txt270(self):
        self.txt270 = "•" * 270

    def _update_txt(self):
        if (not self._txt):
            self._txt = self.txt270
        else:
            self._txt += f"\n{self.txt270}"

        self._sequential += 1

    def _set_header(self):
        self._txt270()

        # Tipo de registro (8)
        self.set_text(8, 1, 1, 0)

        # Código do cliente (a ser definido pelos Correios)
        self.set_text(self.info.get("client-code"), 2, 5, 0)

        # Filler (preencher com zeros)
        self.set_text(0, 6, 20, 0)

        # Nome do cliente
        self.set_text(self.info.get("client-name"), 21, 60)

        # Data geração (data de geração do arquivo)
        self.set_text(self.date.strftime("%Y%m%d"), 61, 68)

        # Quantidade de registro (quantidade de registro do arquivo, inclui o Registro Header)
        self.set_text(self._registration_amount, 69, 74, 0)

        # Filler (preencher com zeros)
        self.set_text("0", 75, 258, 0)

        # Número sequencial de arquivo (número de remessa de arquivo - sequencial de remessa de arquivo)
        self.set_text(self._shipping, 259, 263, 0)

        # Número sequencial de registro (Sequencial de registro, a partir de 0000001)
        self.set_text(self._sequential, 264, 270, 0)

        self._update_txt()

    def _set_detail(self, detail):
        self._txt270()

        # Tipo de registro (9)
        self.set_text(9, 1, 1)

        # Código do cliente (a ser definido pelos Correios)
        self.set_text(self.info.get("client-code"), 2, 5, 0)

        # Identificador do cliente (Literal fornecido pelos Correios)
        self.set_text(self.info.get("client-identifier"), 6, 13)

        # Sigla do objeto (tipo postal)
        self.set_text(self.info.get("object-acronym"), 14, 15)

        # Número do objeto (faixas fornecidas pelos Correios sem o DV, o cliente deve gera-lo)
        self.set_text(self.info.get("object-number"), 16, 24, 0)

        # País de origem (fixo = BR)
        self.set_text("BR", 25, 36)

        # Código da operação (1101 - inclusão, 1102 - exclusão)
        self.set_text(self._type, 27, 30)

        # Conteúdo (livre para o usuário)
        self.set_text(self.info.get("free-content"), 31, 90)

        # Nome destinatário
        self.set_text(detail["name"], 91, 130)

        # Endereço destinatário
        self.set_text(detail["address"], 131, 210)

        # Cidade destinatário
        self.set_text(detail["city"], 211, 240)

        # UF destinatário
        self.set_text(detail["state"], 241, 242)

        # CEP destinatário
        self.set_text(re.sub(r'[^0-9]', '', detail["zip-code"]), 243, 250, 0)

        # Filler (preencher com zeros)
        self.set_text(0, 251, 258, 0)

        # Número sequencial de arquivo (número de remessa de arquivo - sequencial de remessa de arquivo)
        self.set_text(self._shipping, 259, 263, 0)

        # Número sequencial de registro (Sequencial de registro, a partir de 0000002)
        self.set_text(self._sequential, 264, 270, 0)

        self._update_txt()

    def set_text(self, replace, _from, _until, fill=" "):
        length = _until - (_from - 1)
        text = str(replace).upper()

        if fill == 0:
            text = text[:length].rjust(length, str(fill))
        else:
            text = text[:length].ljust(length, str(fill))

        self.txt270 = self.txt270[:_from - 1] + text + self.txt270[_from - 1 + length:]

    def _get_text(self, line, _from, length=None, is_number=False):
        start = _from - 1
        if length is None:
            length = _from

        text = line[start:start + length].strip()

        try:
            return int(text) if is_number else text
        except:
            return ''

    def _format_date(self, data_str):
        data_obj = datetime.strptime(data_str, "%Y%m%d")

        return data_obj.strftime("%d/%m/%Y")

    def set_data(self, data):
        for detail in data:
            for key in detail:
                detail[key] = unidecode(detail[key])

            detail["address"] = "%s %s " % (detail["street"], detail["number"])

            if detail["complement"]:
                detail["address"] += detail["complement"]

            detail["address"] += " %s %s" % (detail["neighborhood"], detail["city"])

            self._data.append(detail)

    def get_data(self, file_path):
        try:
            data = {
                "header": {},
                "detail": [],
                "trailer": {}
            }

            with open(file_path, "r", encoding="utf-8") as file:
                for line in file:
                    tipo_de_registro = self._get_text(line, 1, 1, True)
                    codigo_do_cliente = self._get_text(line, 2, 4, True)
                    numero_sequencial_arquivo = self._get_text(line, 160, 5, True)
                    numero_sequencial_registro = self._get_text(line, 165, 6, True)
                    nome_do_cliente = self._get_text(line, 21, 40)
                    filler = self._get_text(line, 6, 15)

                    # Header
                    if tipo_de_registro == 0:
                        data["header"] = {
                            "tipo_de_registro": tipo_de_registro,
                            "codigo_do_cliente": codigo_do_cliente,
                            "filler": filler,
                            "nome_do_cliente": nome_do_cliente,
                            "data_do_movimento": self._format_date(self._get_text(line, 61, 8)),
                            "data_da_geracao": self._format_date(self._get_text(line, 69, 8)),
                            "filler2": self._get_text(line, 77, 83),
                            "numero_sequencial_arquivo": numero_sequencial_arquivo,
                            "numero_sequencial_registro": numero_sequencial_registro,
                        }
                    # Detail
                    elif tipo_de_registro == 1:
                        codigo_da_baixa = self._get_text(line, 95, 2)
                        motivo_devolucao = self._get_text(line, 157, 2)

                        data["detail"].append({
                            "tipo_de_registro": tipo_de_registro,
                            "codigo_do_cliente": codigo_do_cliente,
                            "identificacao_do_cliente": self._get_text(line, 6, 8),
                            "sigla_do_objeto": self._get_text(line, 14, 2),
                            "numero_do_objeto": self._get_text(line, 16, 9, True),
                            "pais_de_origem": self._get_text(line, 25, 2),
                            "conteudo": self._get_text(line, 27, 60),
                            "data_da_entrega_do_ar": self._format_date(self._get_text(line, 87, 8)),
                            "codigo_da_baixa": codigo_da_baixa,
                            "codigo_da_baixa_descricao": self.table.lookup_reason(codigo_da_baixa),
                            "lote_do_objeto": self._get_text(line, 97, 8),
                            "nome_do_recebedor": self._get_text(line, 105, 40),
                            "rj_do_recebedor": self._get_text(line, 145, 12),
                            "motivo_devolucao": motivo_devolucao,
                            "motivo_devolucao_descricao": self.table.lookup_reason(motivo_devolucao),
                            "filler": self._get_text(line, 159, 1),
                            "numero_sequencial_arquivo": numero_sequencial_arquivo,
                            "numero_sequencial_registro": numero_sequencial_registro
                        })
                    # Trailer
                    elif tipo_de_registro == 2:
                        data["trailer"] = {
                            "tipo_de_registro": tipo_de_registro,
                            "codigo_do_cliente": codigo_do_cliente,
                            "filler": filler,
                            "nome_do_cliente": nome_do_cliente,
                            "quantidade_de_registros": self._get_text(line, 61, 6, True),
                            "filler2": self._get_text(line, 67, 93),
                            "numero_sequencial_arquivo": numero_sequencial_arquivo,
                            "numero_sequencial_registro": numero_sequencial_registro
                        }

                return data
        except FileNotFoundError:
            print(f"O arquivo '{file_path}' não foi encontrado.")

        except Exception as e:
            print(f"Ocorreu um erro: {e}")

    def set_filename(self):
        date = self.date.strftime("%d%m")
        client_acronym = self.client_acronym
        sequential = self.info.get("shipping")

        return f"{client_acronym}1{date}{sequential}.SD1"

    def generate(self, type = "include"):
        self._type = 1101 if type == "include" else 1102
        self._registration_amount = len(self._data) + 1

        self._set_header()

        for detail in self._data:
            self._set_detail(detail)

        file_path = f"ftp_files/{self.set_filename()}"

        try:
            with open(file_path, "w", encoding="ANSI") as file:
                file.write(self._txt)

            return file_path
        except Exception as e:
            print(f"Erro ao salvar o arquivo: {e}")

            return False
