from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

load_dotenv()
model = init_chat_model(model="gpt-5-nano",  model_provider="openai", temperature=.8)
response = model.invoke("What's the data that this model was trained on?")
print(response)