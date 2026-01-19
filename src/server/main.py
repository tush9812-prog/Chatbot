from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from llm import call_llm
from db import save_response, get_db

app = FastAPI(title="Chatbot API", version ="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", status_code=201)
async def chat(request: Request, db=Depends(get_db)):
    print("Received request at /chat endpoint")
    request = await request.json()
    llm_response =  call_llm(request.get("prompt"))

    ids = await save_response(db, request.get("prompt"), llm_response)

    return {"status_code" : 201, "message" : llm_response, "ids": ids}


@app.get("/chat", status_code=200)
async def get_chat(request: Request, db = Depends(get_db)):
    request =  await request.json()