import os

from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

load_dotenv()

client = OpenAI()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("tartanhacks")

text = input("Enter text: ")
print(f"Text: {text}")

response = client.embeddings.create(
    input=[text],
    model="text-embedding-3-large",
    encoding_format="float"
)
embedding = response.data[0].embedding

# write to file
# with open("embedding.txt", "w") as f:
#     f.write(J)

# read from file
# with open("embedding.txt", "r") as f:
#     # parse as array of floats
#     embedding = list(map(float, f.read().split()))

index.upsert(
    vectors=[
        {
            "id": "MONGOID2",
            "values": embedding,
            "metadata": {
                "text": text
            }
        },
    ],
    namespace="GROUPNAME"
)
