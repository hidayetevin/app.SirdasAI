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
async def text_to_speech(text: str, gender: str = 'female', mood: str = 'normal'):
    if not text:
        return {"error": "Metin boş olamaz"}
    
    filename = f"output_{uuid.uuid4()}.mp3"
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    # Microsoft Neural Voices
    voice = "tr-TR-EmelNeural" if gender == "female" else "tr-TR-AhmetNeural"
    
    # Duyguya göre hız ve perde ayarları (SSML yerine doğrudan parametreler)
    rate = "+0%"
    pitch = "+0Hz"
    
    if mood == "uzgun":
        rate = "-20%"  # Üzgünken daha yavaş
        pitch = "-5Hz" # Üzgünken daha pes
    elif mood == "heyecanli" or mood == "mutlu":
        rate = "+25%"  # Heyecanlıyken daha hızlı
        pitch = "+10Hz" # Heyecanlıyken daha tiz
    elif mood == "ciddi":
        rate = "-10%" 
        pitch = "-2Hz"

    try:
        # edge-tts Communicate nesnesine doğrudan rate ve pitch veriyoruz.
        # Bu yöntem SSML'den daha kararlı ve etiketleri okuma riski yok.
        communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        await communicate.save(output_path)
        return FileResponse(output_path, media_type="audio/mpeg", filename=filename)
    except Exception as e:
        print(f"TTS Hata: {str(e)}")
        # En güvenli yedek
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
        return FileResponse(output_path, media_type="audio/mpeg", filename=filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
