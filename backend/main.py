from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth, credentials
import firebase_admin
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
try:
    if not firebase_admin._apps:
        # Use application default credentials or a service account key
        # For development, you can use a service account key JSON file
        # cred = credentials.Certificate("firebase-service-account.json")
        # firebase_admin.initialize_app(cred)
        firebase_admin.initialize_app()
except Exception as e:
    print(f"Warning: Firebase Admin initialization failed: {e}")

app = FastAPI(title="AI LeXa Lawyer Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Authorization header",
        )
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "AI LeXa Lawyer API"}

# Import and include routers (we will create these next)
from routers import chat, tools, admin
app.include_router(chat.router, prefix="/api/chat")
app.include_router(tools.router, prefix="/api/tools")
app.include_router(admin.router, prefix="/api/admin")
