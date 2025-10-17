from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow your React frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Looped backend is live!"}

@app.post("/generate")
def generate_video(data: dict):
    text = data.get("text", "")
    # Later you'll plug in your summarization + video pipeline here
    return {"result": f"Generated AI video for: {text}"}
