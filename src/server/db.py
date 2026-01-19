from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy import text
import uuid
import asyncpg
import os
from openai import OpenAI
DATABASE_URL = os.getenv("CONNECTION_DB")

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session



async def save_response(db, prompt, response):
    response_id = str(uuid.uuid4())
    prompt_id = str(uuid.uuid4())

    # 1️⃣ Insert into parent table
    await db.execute(
        text("""
            INSERT INTO chat_prompts (id, prompt)
            VALUES (:id, :prompt)
        """),
        {
            "id": prompt_id,
            "prompt": prompt
        }
    )

    # 2️⃣ Insert into child table (FK reference)
    await db.execute(
        text("""
            INSERT INTO chat_responses (id, prompt_id, response)
            VALUES (:id, :prompt_id, :response)
        """),
        {
            "id": response_id,
            "prompt_id": prompt_id,
            "response": response
        }
    )

    # 3️⃣ Commit once
    db.commit()

    return {
        "response_id": response_id,
        "prompt_id": prompt_id
    }

# async def get_prompt(db, prompt_id):
#   return await db.execute(text("""
#   SELECT ))