import re

def remove_non_numeric_characters(input_str):
    """
    Remove todos os caracteres não numéricos de uma string.

    Args:
        input_str (str): A string de entrada.

    Returns:
        str: A string resultante após a remoção dos caracteres não numéricos.
    """
    return re.sub(r'[^0-9]', '', input_str)

def validate_cpf(cpf):
    """
    Valida um número de CPF.

    Args:
        cpf (str): O número de CPF a ser validado.

    Returns:
        bool: True se o CPF for válido, False caso contrário.
    """
    cpf = remove_non_numeric_characters(cpf)
    v1 = 0
    v2 = 0
    aux = False

    for i in range(1, len(cpf)):
        if cpf[i - 1] != cpf[i]:
            aux = True

    if not aux:
        return False

    for i in range(len(cpf) - 2):
        v1 += int(cpf[i]) * (10 - i)

    v1 = ((v1 * 10) % 11)

    if v1 == 10:
        v1 = 0

    if v1 != int(cpf[9]):
        return False

    for i in range(len(cpf) - 1):
        v2 += int(cpf[i]) * (11 - i)

    v2 = ((v2 * 10) % 11)

    if v2 == 10:
        v2 = 0

    if v2 != int(cpf[10]):
        return False
    else:
        return True

def validate_cnpj(cnpj):
    """
    Valida um número de CNPJ.

    Args:
        cnpj (str): O número de CNPJ a ser validado.

    Returns:
        bool: True se o CNPJ for válido, False caso contrário.
    """
    cnpj = remove_non_numeric_characters(cnpj)
    v1 = 0
    v2 = 0
    aux = False

    for i in range(1, len(cnpj)):
        if cnpj[i - 1] != cnpj[i]:
            aux = True

    if not aux:
        return False

    p1 = 5
    p2 = 13
    for i in range(len(cnpj) - 2):
        if p1 >= 2:
            v1 += int(cnpj[i]) * p1
        else:
            v1 += int(cnpj[i]) * p2
        p1 -= 1
        p2 -= 1

    v1 = (v1 % 11)

    if v1 < 2:
        v1 = 0
    else:
        v1 = (11 - v1)

    if v1 != int(cnpj[12]):
        return False

    p1 = 6
    p2 = 14
    for i in range(len(cnpj) - 1):
        if p1 >= 2:
            v2 += int(cnpj[i]) * p1
        else:
            v2 += int(cnpj[i]) * p2
        p1 -= 1
        p2 -= 1

    v2 = (v2 % 11)

    if v2 < 2:
        v2 = 0
    else:
        v2 = (11 - v2)

    if v2 != int(cnpj[13]):
        return False
    else:
        return True

def validate_document(document):
    """
    Valida um documento (CPF ou CNPJ).

    Args:
        document (str): O número de CPF ou CNPJ a ser validado.

    Returns:
        bool: True se o documento for válido, False caso contrário.
    """
    document = remove_non_numeric_characters(document)
    length = len(document)

    if length == 14:
        return validate_cnpj(document)

    if length == 11:
        return validate_cpf(document)

    if length < 11:
        return validate_document(document.ljust(11, "0"))

    if length < 14:
        return validate_document(document.ljust(14, "0"))

    return False