import math


def format_bytes_size(sizes_bytes, target_unit="auto", precision=None):
    """
    Formata um ou mais tamanhos em bytes para unidades de tamanho de dados mais legíveis, como KB, MB, GB, etc.

    Args:
        sizes_bytes (int or list of int): Um tamanho em bytes ou uma lista de tamanhos em bytes a serem formatados.
        target_unit (str, optional): A unidade para a qual você deseja formatar (por padrão, "auto" para a unidade apropriada).
        precision (int, optional): O número de casas decimais para arredondar os resultados (por padrão, None para arredondamento padrão).

    Returns:
        str or list of str: Uma string ou uma lista de tamanhos formatados em formato de string, com a unidade especificada.
    """
    # Verifica se o tamanho é zero e retorna "0B" se for o caso
    if isinstance(sizes_bytes, int):
        sizes_bytes = [sizes_bytes]
    elif not isinstance(sizes_bytes, list):
        raise ValueError("O argumento 'sizes_bytes' deve ser um inteiro ou uma lista de inteiros.")

    # Define os nomes das unidades
    unit_names = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")

    # Calcula o índice da unidade de destino
    if target_unit == "auto":
        unit_index = [int(math.floor(math.log(size, 1024))) for size in sizes_bytes]
    else:
        unit_index = [unit_names.index(target_unit.upper())] * len(sizes_bytes)

    # Calcula o fator de conversão para a unidade de destino
    conversion_factors = [math.pow(1024, index) for index in unit_index]

    # Calcula os tamanhos formatados com a precisão especificada
    formatted_sizes = [round(size / factor, precision) for size, factor in zip(sizes_bytes, conversion_factors)]

    # Se houver apenas um tamanho de entrada, retorne como uma string
    if len(formatted_sizes) == 1:
        return f"{formatted_sizes[0]} {unit_names[unit_index[0]]}"

    # Caso contrário, retorne a lista de tamanhos formatados e as unidades de destino como uma lista de strings formatadas
    return [f"{formatted} {unit_names[unit_idx]}" for formatted, unit_idx in zip(formatted_sizes, unit_index)]
