from dotenv import load_dotenv
load_dotenv()
from langchain.agents import create_agent

def chat():
  agent=create_agent(model="gpt-5-nano", temperature=0.8, model_provider="openai")