import json
import requests
from django.conf import settings

def generate_chat_response(question, context, history_msgs=None):
    if history_msgs is None:
        history_msgs = []
        
    system_prompt = f"""You are HealthAI, a friendly, empathetic medical assistant. Talk directly to the patient.
Rules:
1. Respond naturally and conversationally. Say "Hi" or "Hello" if they greet you.
2. Address the patient directly as "you". Never refer to yourself in the third person. Use "I".
3. Keep answers very concise.
4. Use this medical context to answer:
{context}"""

    messages = [{"role": "system", "content": system_prompt}]
    
    for msg in history_msgs:
        messages.append({
            "role": "user" if msg['role'] == 'user' else "assistant", 
            "content": msg['message']
        })
        
    messages.append({"role": "user", "content": question})

    try:
        # Connect to local Ollama instance using the /api/chat endpoint
        url = "http://localhost:11434/api/chat"
        payload = {
            "model": "phi3",
            "messages": messages,
            "stream": False
        }
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        return data.get('message', {}).get('content', "I'm sorry, I couldn't generate a response.").strip()
    except Exception as e:
        print(f"Ollama API Error (Chat): {e}")
        return "I'm having trouble connecting to the local Llama AI. Please ensure the Ollama application is running on your system!"
