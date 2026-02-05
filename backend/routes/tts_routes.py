from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import pickle
import schemas
import auth
from database import get_db
from config import settings
from models import TTSHistory, Voice
from tts_service import tts_service

router = APIRouter()


@router.post("/generate", response_model=schemas.TTSResponse)
async def generate_speech(
    request: schemas.TTSRequest,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Generate speech from text"""
    # Load voice embedding if voice_id is provided
    voice_embedding = None
    if request.voice_id:
        voice = db.query(Voice).filter(Voice.id == request.voice_id).first()
        if not voice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Voice not found"
            )
        
        # Check permissions
        if voice.user_id != current_user.id and voice.is_public == 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to use this voice"
            )
        
        # Load voice embedding
        embedding_path = voice.audio_path.replace(
            os.path.splitext(voice.audio_path)[1], ".pkl"
        )
        if os.path.exists(embedding_path):
            with open(embedding_path, "rb") as f:
                voice_embedding = pickle.load(f)
    
    # Generate output filename
    output_filename = f"{uuid.uuid4()}.{request.output_format}"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    # Generate speech
    try:
        output_path, duration = tts_service.generate_speech(
            text=request.text,
            output_path=output_path,
            speed=request.speed,
            pitch=request.pitch,
            language=request.language,
            voice_embedding=voice_embedding,
            output_format=request.output_format
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate speech: {str(e)}"
        )
    
    # Save to history
    history = TTSHistory(
        user_id=current_user.id,
        text=request.text,
        voice_id=request.voice_id,
        speed=request.speed,
        pitch=request.pitch,
        output_path=output_path,
        language=request.language
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    
    return {
        "output_path": f"/api/tts/download/{os.path.basename(output_path)}",
        "duration": duration,
        "history_id": history.id
    }


@router.get("/download/{filename}")
async def download_audio(
    filename: str,
    current_user: schemas.User = Depends(auth.get_current_user)
):
    """Download generated audio file"""
    file_path = os.path.join(settings.OUTPUT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Determine media type
    media_type = "audio/mpeg" if filename.endswith(".mp3") else "audio/wav"
    
    return FileResponse(
        file_path,
        media_type=media_type,
        filename=filename
    )


@router.get("/history", response_model=List[schemas.TTSHistoryItem])
async def get_history(
    skip: int = 0,
    limit: int = 50,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get TTS generation history for current user"""
    history = db.query(TTSHistory).filter(
        TTSHistory.user_id == current_user.id
    ).order_by(TTSHistory.created_at.desc()).offset(skip).limit(limit).all()
    
    return history


@router.delete("/history/{history_id}")
async def delete_history(
    history_id: int,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a history item"""
    history = db.query(TTSHistory).filter(
        TTSHistory.id == history_id,
        TTSHistory.user_id == current_user.id
    ).first()
    
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found"
        )
    
    # Delete audio file if exists
    if history.output_path and os.path.exists(history.output_path):
        try:
            os.remove(history.output_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    db.delete(history)
    db.commit()
    
    return {"message": "History item deleted successfully"}
