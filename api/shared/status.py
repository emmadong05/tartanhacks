from flask import jsonify, make_response


def ok(message: str, data: any,  code: int):
    return make_response(jsonify({"message": message, "data": data}), code)


def err(message: str, code: int):
    return make_response(jsonify({"message": message, "data": None}), code)
