import re

def remove_non_numeric_characters(input_str):
    """Remove caracteres não numéricos.

    Args:
        input_str (Any): O texto/número

    Returns:
        str: Retorna apenas o número.
    """
    return re.sub(r'[^0-9]', '', input_str)

def calculate_verification_digit(input_str, weights):
    """Calcula o dígito verificador.

    Args:
        input_str (Any): O CPF/CNPJ
        weights (Any):

    Returns:
        int
    """
    total = sum(int(c) * w for c, w in zip(input_str, weights))
    remainder = total % 11

    return 0 if remainder < 2 else 11 - remainder

def validate_cpf(cpf):
    # Remove caracteres não numéricos
    cpf = remove_non_numeric_characters(cpf)

    # Verifica se o CPF tem 11 dígitos
    if len(cpf) != 11:
        return False

    digit1 = calculate_verification_digit(cpf[:9], list(range(10, 1, -1)))
    digit2 = calculate_verification_digit(cpf[:10], list(range(11, 1, -1)))

    # Verifica se os dígitos verificadores são iguais aos dígitos informados
    return int(cpf[9]) == digit1 and int(cpf[10]) == digit2

def validate_cnpj(cnpj):
    # Remove caracteres não numéricos
    cnpj = remove_non_numeric_characters(cnpj)

    # Verifica se o CNPJ tem 14 dígitos
    if len(cnpj) != 14:
        return False

    digit1 = calculate_verification_digit(cnpj[:12], [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
    digit2 = calculate_verification_digit(cnpj[:13], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

    # Verifica se os dígitos verificadores são iguais aos dígitos informados
    return int(cnpj[12]) == digit1 and int(cnpj[13]) == digit2

def validate_document(cpf_cnpj):
    cpf_cnpj = remove_non_numeric_characters(cpf_cnpj)
    length = len(cpf_cnpj)

    if length == 14:
        return validate_cnpj(cpf_cnpj)

    if length == 11:
        return validate_cpf(cpf_cnpj)

    if length < 11:
        return validate_document(cpf_cnpj.ljust(11, "0"))

    if length < 14:
        return validate_document(cpf_cnpj.ljust(14, "0"))

    return False

if __name__ == '__main__':
    # Usage examples:
    valid_cpf = '12345678909'
    invalid_cpf = '12345678901'
    valid_cnpj = '12345678000112'
    invalid_cnpj = '12345678000111'

    print(f'Valid CPF: {validate_cpf(valid_cpf)}')
    print(f'Invalid CPF: {validate_cpf(invalid_cpf)}')
    print(f'Valid CNPJ: {validate_cnpj(valid_cnpj)}')
    print(f'Invalid CNPJ: {validate_cnpj(invalid_cnpj)}')

    print('-' * 50)

    print('CPF1:', validate_cpf('13867647798'))
    print('CPF2:', validate_cpf('13867647799'))

    print('-' * 50)

    print('CNPJ1:', validate_cnpj('33.345.626/0001-98'))
    print('CNPJ2:', validate_cnpj('33.345.626/0001-99'))

    print('X:', validate_document('08.804.184/0001-54'))
    print('Y:', validate_document('1-91'))
    print('Y:', validate_document('00.000.000/0001-91'))
