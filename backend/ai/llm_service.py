from openai import OpenAI
from dotenv import load_dotenv
import os
import hashlib,json

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

CACHE = {} 

def getCacheKey(prompt):
    return hashlib.sha256(prompt.encode()).hexdigest()

def callLLm(prompt):
    key = getCacheKey(prompt)

    if key in CACHE:
        return CACHE[key]
    
    try:
        response = client.responses.create(
            model="llama-3.1-8b-instant",
            input=prompt,
            temperature=0.2
        )
        print(response)
        result = response.output_text
        parsed = json.loads(result)

        CACHE[key] = parsed
        return parsed

    except Exception as e:
        print(e)
        return {"error": "AI reasoning unavailable"}
