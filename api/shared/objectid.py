from bson import ObjectId


def objectid_to_str(document):
    if isinstance(document, list):
        return [objectid_to_str(item) for item in document]
    elif isinstance(document, dict):
        return {key: objectid_to_str(value) for key, value in document.items()}
    elif isinstance(document, ObjectId):
        return str(document)
    else:
        return document
