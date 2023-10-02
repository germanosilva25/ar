def format_string_with_mask(input_str, mask=None):
    """
    Formata uma string de acordo com uma máscara especificada.

    Args:
        input_str (str): A string a ser formatada.
        mask (str, optional): A máscara de formatação a ser aplicada (padrão é None).

    Returns:
        str: A string formatada de acordo com a máscara especificada.
    """
    input_str = str(input_str).replace(r"\D", "")
    length = len(input_str)

    if not mask:
        if length == 14:
            mask = "##.###.###/####-##"
        elif length == 11:
            mask = "###.###.###-##"
        elif length == 8:
            mask = "#####-###"
    else:
        mask = str(mask)

    if mask:
        if "#" in mask:
            arr = list(mask)

            for i in range(length):
                if "#" in arr:
                    pos = arr.index("#")
                    arr[pos] = input_str[i]

            mask = ''.join(arr)

            return mask
        else:
            obj = {
                "TELEFONE": "(##) ####-####",
                "CELULAR": "(##) #####-####",
                "CNPJ": "##.###.###/####-##",
                "CPF": "###.###.###-##",
                "CEP": "#####-###"
            }

            mask_upper = mask.upper()

            if mask_upper in obj:
                _mask = obj[mask_upper]
                length = len(_mask.replace(".", "").replace("-", "").replace("/", "").replace("(", "").replace(")", ""))

                input_str = input_str.zfill(length)
                mask = _mask
            else:
                mask = None

            return format_string_with_mask(input_str, mask)

    return input_str
