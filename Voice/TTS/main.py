import os
import uuid
import edge_tts
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = "temp_audio"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

@app.get("/tts")
async def text_to_speech(text: str, gender: str = 'female'):
    if not text:
        return {"error": "Metin boş olamaz"}
    
    filename = f"output_{uuid.uuid4()}.mp3"
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    # Microsoft Neural Voices (Türkçe için en iyileri)
    voice = "tr-TR-EmelNeural" if gender == "female" else "tr-TR-AhmetNeural"
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)
    
    return FileResponse(output_path, media_type="audio/mpeg", filename=filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
