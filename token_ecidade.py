import os

import requests

if "FLASK_APP" not in os.environ:
    from dotenv import load_dotenv

    load_dotenv()

_request_timeout = int(os.getenv("FLASK_CONNECTION_TIMEOUT", 10))

def get_token():
    data = {
        "client_id": os.getenv("OAUTH_CLIENT_ID"),
        "client_secret": os.getenv("OAUTH_CLIENT_SECRET"),
        "grant_type": os.getenv("OAUTH_GRANT_TYPE")
    }

    try:
        url = os.getenv("ECIDADE_BASE") + os.getenv("OAUTH_TOKEN_URI")

        response = requests.post(url, data, timeout=_request_timeout)

        if response.status_code == 200:
            return response.json()
        else:
            return None
    except:
        return None

def include(data):
    token = get_token()

    if token is None:
        return {
            "data": {"error": True, "message": "Não foi possível obter o Token."},
            "status_code": 503
        }

    token = token.get("access_token")

    url = os.getenv("ECIDADE_BASE") + os.getenv("ECIDADE_INCLUSAO")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=_request_timeout)

        return {
            "data": response.json(),
            "status_code": response.status_code
        }

    except Exception:
        return None