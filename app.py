from flask import Flask, request, jsonify, render_template
from flask_swagger_ui import get_swaggerui_blueprint
from datetime import datetime
import json
import random
import string

app = Flask(__name__)

JSON_FILE = "./static/scripts/passwords.json"
SWAGGER_URL = "/swagger"
API_URL = "./static/swagger.json"
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL, API_URL, config={"app_name": "JSON Object Management API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)


def generate_random_code(length=8):
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


def read_json():
    try:
        with open(JSON_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []


def write_json(data):
    with open(JSON_FILE, "w") as file:
        json.dump(data, file, indent=2)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/add", methods=["POST"])
def add_object():
    new_object = {
        "code": generate_random_code(),
        "time": "",
        "title": "",
        "account": "",
        "password": "",
        "site": "",
        "note": "",
    }

    all_data = read_json()
    all_data.append(new_object)
    write_json(all_data)
    return jsonify({"message": "Object added successfully", "object": new_object}), 201


@app.route("/update/<string:code>", methods=["PUT"])
def update_object(code):
    print(f"Received update request for code: {code}")
    data = read_json()
    for obj in data:
        if obj["code"] == code:
            updated_data = request.json
            obj["time"] = datetime.now().strftime("%Y-%m-%d")  # 更新日期為當前日期
            if updated_data:
                obj["title"] = updated_data.get("title", obj["title"])
                obj["account"] = updated_data.get("account", obj["account"])
                obj["password"] = updated_data.get("password", obj["password"])
                obj["site"] = updated_data.get("site", obj["site"])
                obj["note"] = updated_data.get("note", obj["note"])
            write_json(data)
            return jsonify({"message": "Object updated successfully", "object": obj})
    return jsonify({"error": "Object not found"}), 404


@app.route("/delete/<string:code>", methods=["DELETE"])
def delete_object(code):
    data = read_json()
    for index, obj in enumerate(data):
        if obj["code"] == code:
            del data[index]
            write_json(data)
            return jsonify({"message": "Object deleted successfully"})
    return jsonify({"error": "Object not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
