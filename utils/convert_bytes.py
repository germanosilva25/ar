def convert_bytes(byte_size, to_unit="auto"):
    units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    unit_index = units.index(to_unit.upper()) if to_unit != "auto" else 0

    while byte_size >= 1024 and unit_index < len(units) - 1:
        byte_size /= 1024.0
        unit_index += 1

    converted_size = round(byte_size, 2)
    result_unit = units[unit_index]

    return f"{converted_size} {result_unit}"