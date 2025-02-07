import os

import openai
from dotenv import load_dotenv

openai.api_key = os.getenv("OPENAI_API_KEY")


def get_embedding(text: str):
    response = openai.Embedding.create(
        input=[text],
        model="text-embedding-3-large"
    )
    embedding = response['data'][0]['embedding']


def audio(text: str):
    embeddings = get_embedding(text)
