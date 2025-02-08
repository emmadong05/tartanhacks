import base64
import os
from typing import Any, Dict

import openai
from dotenv import load_dotenv
from mongo import Mongo
from openai import OpenAI
from pydantic import BaseModel, create_model

# Load API keys from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def create_dynamic_model(model_name: str, fields: Dict[str, Any]) -> BaseModel:
    """
    Creates a Pydantic model dynamically.

    Args:
        model_name: The name of the model.
        fields: A dictionary where keys are field names and values are tuples of (type, default value). 
                If a default value is not needed, use `...` (Ellipsis) as the default value.

    Returns:
        A dynamically created Pydantic model.
    """
    return create_model(model_name, **fields, __base__=BaseModel)


client = OpenAI(api_key=OPENAI_API_KEY)

# Function to encode the image


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def send_image_to_gpt(base64_image, categories, DynamicModel):
    catstr = " and ".join(categories)
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            # {
            #    "role": "system",
            #    "content": "Extract the event information.",
            # },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
                            You are an expert image analyzer.
                            This is a screenshot of an instagram reel. Classify it between {catstr}. For each category, output a score from 1-10 on how likely it is to be that category.
                            Output your answer in the given json format:
                        """,
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": base64_image},
                    },
                ],
            }
        ],
        response_format=DynamicModel,
    )

    event = response.choices[0].message.parsed
    return event


def start_analysis(base64_image, categories):
    fields_definition = {}
    for category in categories:
        fields_definition[category] = (int, ...)

    DynamicModel = create_dynamic_model("DynamicModel", fields_definition)
    analysis_result = send_image_to_gpt(
        base64_image, categories, DynamicModel).dict()
    return analysis_result
