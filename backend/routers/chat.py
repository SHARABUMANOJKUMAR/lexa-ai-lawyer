from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
import os
import httpx
from main import get_current_user

router = APIRouter()

LEGAL_SYSTEM_PROMPT = """You are AI LeXa Lawyer...""" # (Keep the same prompt)

@router.post("")
async def legal_chat(request: Request, user=Depends(get_current_user)):
    body = await request.json()
    messages = body.get("messages", [])
    stream = body.get("stream", False)

    # If the user wants to use Lovable Gateway or Google GenAI directly
    api_key = os.getenv("LOVABLE_API_KEY")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    async def event_generator():
        async with httpx.AsyncClient() as client:
            req_data = {
                "model": "google/gemini-2.5-flash",
                "messages": [{"role": "system", "content": LEGAL_SYSTEM_PROMPT}] + messages,
                "stream": True,
                "temperature": 0.7,
                "max_tokens": 4096,
            }
            async with client.stream(
                "POST", 
                "https://ai.gateway.lovable.dev/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json=req_data
            ) as response:
                async for chunk in response.aiter_bytes():
                    yield chunk

    if stream:
        return StreamingResponse(event_generator(), media_type="text/event-stream")
    else:
        # Non-streaming fallback
        async with httpx.AsyncClient() as client:
             req_data = {
                "model": "google/gemini-2.5-flash",
                "messages": [{"role": "system", "content": LEGAL_SYSTEM_PROMPT}] + messages,
                "stream": False,
                "temperature": 0.7,
                "max_tokens": 4096,
            }
             response = await client.post(
                 "https://ai.gateway.lovable.dev/v1/chat/completions",
                 headers={"Authorization": f"Bearer {api_key}"},
                 json=req_data
             )
             return response.json()
