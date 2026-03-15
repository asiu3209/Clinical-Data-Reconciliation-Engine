from openai import OpenAI
from dotenv import load_dotenv
import os
import hashlib,json,time

load_dotenv()
print(os.getenv("OPENAI_API_KEY"))
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_BASE"] = os.getenv("OPENAI_ENDPOINT")
os.environ["OPENAI_API_TYPE"] = "azure"
os.environ["OPENAI_API_VERSION"] = os.getenv("OPENAI_API_VERSION")

client = OpenAI()

CACHE = {} 

def getCacheKey(prompt):
    return hashlib.sha256(prompt.encode()).hexdigest()

def callLLm(prompt):
    key = getCacheKey(prompt)

    if key in CACHE:
        return CACHE[key]
    
    try:
        response = client.chat.completions.create(
            model="clinicalDataReconciliation",
            messages=[
                {"role": "system", "content":"You are a clinical data reconciliation assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        result = response.choices[0].message.content
        CACHE[key] = result
        return result
    except Exception as e:
        time.sleep(1)
        try:
            response = client.chat.completions.create(
                model="clinicalDataReconciliation",
                messages=[{"role": "user", "content": prompt}]
            )

            return json.loads(response.choices[0].message.content)

        except:
            print(e)
            return "AI reasoning unavailable"
