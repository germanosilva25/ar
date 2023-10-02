import os
import traceback

from flask import Flask, jsonify, render_template


class FlaskApp(Flask):
    def setup(self):
        self.secret_key = os.getenv("FLASK_SECRET_KEY", "SMF_AR")
        self.configure_error_handlers()
        self.assets_build()

    def get_asset_files(self, ext):
        from glob import glob

        path = rf"static/{ext}/**/*.{ext}"
        files = glob(path, recursive=True)
        files = [file.replace("\\", "/") for file in files]

        return [file.replace("static/", "") for file in files]

    def assets_build(self):
        from flask_assets import Bundle, Environment

        self.config["ASSETS_DEBUG"] = self.config["DEBUG"]

        # Configuração do Flask-Assets
        assets = Environment(self)

        # Bundle para arquivos CSS
        css_bundle = Bundle(
            *self.get_asset_files("css"),
            output="assets/packed.css",  # Nome do arquivo de saída minificado
            filters="cssmin"
        )

        # Bundle para arquivos JS
        js_bundle = Bundle(
            *self.get_asset_files("js"),
            output="assets/packed.js",
            filters="rjsmin"
        )

        # Registra os bundles
        assets.register("js_all", js_bundle)
        assets.register("css_all", css_bundle)

        # Inicializa o assets
        assets.init_app(self)

    def configure_error_handlers(self):
        @self.errorhandler(403)
        def forbidden_page(error):
            return render_template("http/access_forbidden.html"), 403

        @self.errorhandler(404)
        def page_not_found(error):
            return render_template("http/page_not_found.html"), 404

        @self.errorhandler(405)
        def method_not_allowed_page(error):
            return render_template("http/method_not_allowed.html"), 405

        @self.errorhandler(500)
        def server_error_page(error):
            return render_template("http/server_error.html"), 500

    def error(self, message):
        data = {
            "erro": True,
            "mensagem": message
        }

        return {"data": data}

    def exception(self, exception):
        error = self.error(f"Erro interno do servidor:\n<i>{exception.__str__()}</i>")

        if self.debug:
            print(traceback.format_exc())

            error["data"]["traceback"] = traceback.format_exc()

        return jsonify(error), 500