import os
from ftplib import FTP
from threading import Thread

from flask import request
from flask_socketio import SocketIO, disconnect, emit
from tqdm import tqdm

from generate import TextAR
from models.form_data import FormData
from models.response_data import ResponseData
from token_ecidade import include
from utils.case_converter import CaseConverter
from views import app

socketio = SocketIO(app)

# Dicionário para rastrear as conexões dos clientes
client_connections = {}

_request_timeout = int(os.getenv("FLASK_CONNECTION_TIMEOUT", 10))

def ftp_upload_progress(sid, file_path, callback):
    def upload():
        filename = os.path.basename(file_path)

        with open(file_path, "rb") as file:
            file_size = os.path.getsize(file_path)
            uploaded_size = 0

            def upload_callback(data):
                nonlocal uploaded_size
                uploaded_size += len(data)
                progress = int((uploaded_size / file_size) * 100)
                pbar.update(len(data))
                socketio.sleep(.001)
                callback(sid, progress)

            try:
                # Configurações do servidor FTP
                ftp_host = os.getenv("FTP_SERVER_HOST")
                ftp_user = os.getenv("FTP_SERVER_USER")
                ftp_pass = os.getenv("FTP_SERVER_PASS")
                ftp_dir = os.getenv("FTP_SERVER_DIR")

                ftp = FTP(ftp_host, ftp_user, ftp_pass, timeout=_request_timeout)

                with tqdm(total=file_size, unit="B", unit_scale=True, desc=f"Enviando {filename}", leave=False) as pbar:
                    ftp.storbinary(f"STOR {ftp_dir} {os.path.basename(file_path)}", file, callback=upload_callback)

                ftp.quit()

                socketio.emit("upload_completed", to=sid)
            except Exception as e:
                print(e)
                socketio.emit("upload_error", {
                    "title": "Erro na conexão com o servidor FTP",
                    "message": e.__str__()
                }, to=sid)

    thread = Thread(target=upload)
    thread.start()

def loader(sid, message, progress=None):
    emit("loader", (message, progress), to=sid)

@socketio.on("connect")
def handle_connect():
    sid = request.sid

    print(f"Client Connected: {sid}")

@socketio.on("disconnect")
def handle_disconnect():
    sid = request.sid

    print(f"Client Disconnected: {sid}")

@socketio.on("send data")
def handle_send_data(data):
    sid = request.sid

    print(data)

    json_model = FormData(data)

    if json_model.is_valid() is False:
        type = json_model.get_doc_type()

        message = f"O {type} {json_model.cpfcnpj} não é válido!"

        emit("invalid document", (message), to=sid)
    else:
        with open('response.json', 'r', encoding='utf-8') as file:
            import json

            response = json.load(file)
            res = response.get("data")
            # data = data.get("data")
            loader(sid, "Preparando...")
            socketio.sleep(.5)

            response_data = ResponseData(res)
            response_data = response_data.get_data()

            # Remover
            name = data.get("name")
            surname = data.get("surname")
            fullname = f"{name} {surname}"
            response_data["recipient-data"] = data
            response_data["recipient-data"]["name"] = fullname
            response_data["recipient-data"]["zip-code"] = data.get("zipCode")
            ###

            text_ar = TextAR(response_data)

            loader(sid, "Gerando AR...")
            # socketio.sleep(1.5)

            # # print(response_data.get_data())
            # print(text_ar.generate())
            # print(response_data)

            if text_ar.generate():
                loader(sid, "Enviando arquivo...")
                # socketio.sleep(1.5)

                data = {
                    "data": response_data["recipient-data"],
                    "header": ""
                }
                data = CaseConverter.convert_keys(response_data, CaseConverter.to_camel_case)

                message = "Arquivo enviado com sucesso."

                emit("success", (data, message))
            else:
                emit("error", ("Erro AR", "Ocorreu um erro na geração do AR!"), to=sid)

        return
        json_data = json_model.get_data()
        response = include(json_data)
        data = response.get("data")

        error = None
        message = None

        if data.get("error"):
            message = data.get("message")
            error = True

        if ("data" in data and "erro" in data.get("data") and data.get("data").get("erro")):
            message = data.get("data").get("message")
            error = True

        if error:
            emit("error", ("Erro!", message), to=sid)

        print(data.get("error"), data, data.get("message"))
        # print(json_model.get_data())
        # print(json_model.is_valid())
        # # json_data = json_model.get_data()
        # # response = include(json_data)
        # # data = response.get("data")
        # # print(data)
        # socketio.sleep(2)
        # loader(sid, "Nero")
        # socketio.sleep(2)
        # loader(sid, "Testing...", 37)
        # # emit("loader", ("aaa", "bbb"), to=sid)

@socketio.on("upload_request")
def handle_upload_request(data):
    sid = request.sid

    # uploaded_file = data["file"]
    # print(data, data.get("file").filename)
    print(data)
    file_path = "../py-download/INV-BRA-610251-92264-51.pdf"
    file_path = "../py-download/php-8.0.30-Win32-vs16-x64.zip"

    def progress_callback(sid, progress):
        socketio.emit("upload_progress", {"progress": progress}, to=sid)
        # socketio.sleep(.5)

    ftp_upload_progress(sid, file_path, progress_callback)


# def exception(exception):
#     error = self.error(f"Erro interno do servidor:\n<i>{exception.__str__()}</i>")

#     if self.debug:
#         print(traceback.format_exc())

#         error["data"]["traceback"] = traceback.format_exc()

#     return jsonify(error), 500