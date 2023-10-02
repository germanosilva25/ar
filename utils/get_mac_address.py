from uuid import getnode


def get_mac_address():
    """
    Retorna o endereço MAC da máquina como uma string formatada.

    O endereço MAC é obtido a partir do UUID da máquina e é formatado como uma
    string no formato xx:xx:xx:xx:xx:xx, onde xx representa os octetos hexadecimais
    do endereço MAC.

    Returns:
        str: O endereço MAC da máquina formatado como uma string.
    """
    mac_address = ":".join(["{:02x}".format((getnode() >> elements) & 0xff) for elements in range(0,2*6,2)][::-1])

    return mac_address