import re


class CaseConverter:
    """
    Classe utilitária para conversão de diferentes estilos de nomenclatura de strings.
    """

    @staticmethod
    def to_camel_case(input_str):
        """
        Converte uma string para o formato CamelCase.

        Args:
            input_str (str): A string a ser convertida.

        Returns:
            str: A string convertida em CamelCase.

        Example:
            >>> CaseConverter.to_camel_case("hello_world_example")
            'helloWorldExample'
        """
        words = re.split(r"_|-", input_str)
        return words[0] + ''.join(x.title() for x in words[1:])

    @staticmethod
    def to_kebab_case(input_str):
        """
        Converte uma string para o formato kebab-case.

        Args:
            input_str (str): A string a ser convertida.

        Returns:
            str: A string convertida em kebab-case.

        Example:
            >>> CaseConverter.to_kebab_case("HelloWorldExample")
            'hello-world-example'
        """
        return CaseConverter.case_separator(input_str, "-")

    @staticmethod
    def to_snake_case(input_str):
        """
        Converte uma string para o formato snake_case.

        Args:
            input_str (str): A string a ser convertida.

        Returns:
            str: A string convertida em snake_case.

        Example:
            >>> CaseConverter.to_snake_case("HelloWorldExample")
            'hello_world_example'
        """
        return CaseConverter.case_separator(input_str, "_")

    @staticmethod
    def case_separator(input_str, separator="-"):
        """
        Converte uma string para um formato específico com um separador personalizado.

        Args:
            input_str (str): A string a ser convertida.
            separator (str, optional): O separador a ser usado (padrão é "-").

        Returns:
            str: A string convertida no formato especificado.

        Example:
            >>> CaseConverter.case_separator("helloWorldExample", "-")
            'hello-world-example'
        """
        try:
            input_str = re.sub(r'([a-z])([A-Z])', r'\1' + separator + r'\2', input_str)
            words = re.findall(r'[a-zA-Z]+', input_str)
            return separator.join(words).lower()
        except:
            return input_str

    @staticmethod
    def convert_keys(data, key_converter):
        """
        Recursivamente converte as chaves de um dicionário (ou listas de dicionários) usando um conversor de chaves.

        Args:
            data (dict or list): Os dados para os quais as chaves serão convertidas.
            key_converter (function): A função que converte as chaves.

        Returns:
            dict or list: Os dados com as chaves convertidas.

        Example:
            >>> data = {"first_name": "John", "last_name": "Doe"}
            >>> CaseConverter.convert_keys(data, aseConverter.to_camel_case)
            {'firstName': 'John', 'lastName': 'Doe'}
        """
        if isinstance(data, list):
            return [CaseConverter.convert_keys(item, key_converter) for item in data]
        elif isinstance(data, dict):
            return {key_converter(key): CaseConverter.convert_keys(value, key_converter) for key, value in data.items()}
        else:
            return data
