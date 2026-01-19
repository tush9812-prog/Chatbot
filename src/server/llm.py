from dotenv import load_dotenv
import os
load_dotenv()
from openai import OpenAI
config = {
  "name": "Chatbot",
  "apiKey": os.getenv("OPENAI_API_KEY")
}

client = None
def call_llm(prompt):
  global client
  if client is None:
    client = OpenAI(api_key=config.get("apiKey"))
  response =  client.responses.create(model="gpt-5-nano",input=prompt)
  return response.output_text
