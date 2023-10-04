import os
from ftplib import FTP
from threading import Lock, Thread

from flask import request
from flask_socketio import SocketIO
from tqdm import tqdm

from generate import TextAR
from models.form_data import FormData
from models.response_data import ResponseData
from token_ecidade import include
from utils.case_converter import CaseConverter
from views import app

socketio = SocketIO(app)

cancel_upload = False

_request_timeout = int(os.getenv("FLASK_CONNECTION_TIMEOUT", 10))

def ftp_upload_progress(client_id, file_path, data, callback):
    global cancel_upload

    filename = os.path.basename(file_path)

    # Lock para garantir que apenas uma thread altere a variável cancel_upload por vez
    cancel_lock = Lock()

    with open(file_path, "rb") as file:
        file_size = os.path.getsize(file_path)
        uploaded_size = 0

        def upload_callback(data):
            nonlocal uploaded_size
            uploaded_size += len(data)
            progress = int((uploaded_size / file_size) * 100)
            pbar.update(len(data))
            callback(client_id, progress)

            with cancel_lock:
                if cancel_upload:
                    raise Exception("Upload cancelado pelo usuário")

        try:
            # Configurações do servidor FTP
            ftp_host = os.getenv("FTP_SERVER_HOST")
            ftp_user = os.getenv("FTP_SERVER_USER")
            ftp_pass = os.getenv("FTP_SERVER_PASS")
            ftp_dir = os.getenv("FTP_SERVER_DIR")

            ftp = FTP(ftp_host, ftp_user, ftp_pass, timeout=_request_timeout)

            with tqdm(total=file_size, unit="B", unit_scale=True, desc=f"Enviando {filename}", leave=False) as pbar:
                ftp.storbinary(f"STOR {ftp_dir}{os.path.basename(file_path)}", file, callback=upload_callback)

            ftp.quit()

            socketio.sleep(.4)
            socketio.emit("success", (data, "Arquivo enviado com sucesso."), to=client_id)
        except Exception as e:
            print(e)
            socketio.emit("upload_error", {
                "title": "Erro na conexão com o servidor FTP",
                "message": e.__str__()
            }, to=client_id)
        finally:
            with cancel_lock:
                if cancel_upload:
                    remove_remote_file(ftp_host, ftp_user, ftp_pass, os.path.join(ftp_dir, os.path.basename(file_path)))

                cancel_upload = False

def remove_remote_file(ftp_host, ftp_user, ftp_pass, remote_file):
    try:
        ftp = FTP(ftp_host, ftp_user, ftp_pass, timeout=_request_timeout)
        ftp.delete(remote_file)
        ftp.quit()
    except Exception as e:
        print(f"Erro ao excluir o arquivo remoto {remote_file}: {e}")

def upload_request(client_id, file_path, data):
    def progress_callback(client_id, progress):
        loader(client_id, "Enviando arquivo...", progress)

    client_id = request.sid
    thread = Thread(target=ftp_upload_progress, args=(client_id, file_path, data, progress_callback))
    thread.start()

def loader(client_id, message, progress=None):
    socketio.emit("loader", (message, progress), to=client_id)

@socketio.on("connect")
def handle_connect():
    global cancel_upload

    cancel_upload = False

    print(f"Cliente {request.sid} conectado.")

@socketio.on("disconnect")
def handle_disconnect():
    global cancel_upload

    cancel_upload = True

    client_id = request.sid

    print(f"Cliente {client_id} desconectado.")

@socketio.on("send data")
def handle_send_data(data):
    client_id = request.sid

    print(data)

    json_model = FormData(data)

    if json_model.is_valid() is False:
        type = json_model.get_doc_type()

        message = f"O {type} {json_model.cpfcnpj} não é válido!"

        socketio.emit("invalid document", (message), to=client_id)
    else:
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

        if error is None:
            loader(client_id, "Preparando...")

            response_data = ResponseData(data)
            response_data = response_data.get_data()

            text_ar = TextAR(response_data)

            loader(client_id, "Gerando AR...")

            file_path = text_ar.generate()

            if file_path is not False:
                loader(client_id, "Enviando arquivo...")

                data = CaseConverter.convert_keys(response_data, CaseConverter.to_camel_case)

                upload_request(client_id, file_path, data)
            else:
                socketio.emit("error", ("Erro AR", "Ocorreu um erro na geração do AR!"), to=client_id)
        else:
            socketio.emit("error", ("Erro!", message), to=client_id)