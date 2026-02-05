from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from datetime import datetime
import schemas
import auth
from database import get_db
from config import settings
from models import Voice
from tts_service import tts_service
import pickle

router = APIRouter()


@router.post("/upload", response_model=schemas.Voice)
async def upload_voice(
    name: str,
    description: str = "",
    language: str = "en",
    is_public: bool = False,
    file: UploadFile = File(...),
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a voice file for cloning"""
    # Validate file type
    if not file.filename.endswith(('.wav', '.mp3', '.m4a', '.flac')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Supported formats: wav, mp3, m4a, flac"
        )
    
    # Save uploaded file
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    voice_dir = os.path.join(settings.UPLOAD_DIR, "voices")
    audio_path = os.path.join(voice_dir, unique_filename)
    
    with open(audio_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Validate audio
    is_valid, message, duration = tts_service.validate_audio_file(audio_path)
    if not is_valid:
        os.remove(audio_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Extract voice embedding
    try:
        voice_embedding = tts_service.extract_voice_embedding(audio_path)
        
        # Save embedding
        embedding_path = audio_path.replace(file_extension, ".pkl")
        with open(embedding_path, "wb") as f:
            pickle.dump(voice_embedding, f)
    except Exception as e:
        os.remove(audio_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process voice: {str(e)}"
        )
    
    # Create database entry
    db_voice = Voice(
        name=name,
        description=description,
        audio_path=audio_path,
        duration=duration,
        language=language,
        user_id=current_user.id,
        is_public=1 if is_public else 0
    )
    
    db.add(db_voice)
    db.commit()
    db.refresh(db_voice)
    
    return db_voice


@router.get("/", response_model=List[schemas.Voice])
async def list_voices(
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """List all voices available to the current user"""
    # Get user's own voices and public voices
    voices = db.query(Voice).filter(
        (Voice.user_id == current_user.id) | (Voice.is_public == 1)
    ).all()
    
    return voices


@router.get("/{voice_id}", response_model=schemas.Voice)
async def get_voice(
    voice_id: int,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific voice"""
    voice = db.query(Voice).filter(Voice.id == voice_id).first()
    
    if not voice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voice not found"
        )
    
    # Check permissions
    if voice.user_id != current_user.id and voice.is_public == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this voice"
        )
    
    return voice


@router.delete("/{voice_id}")
async def delete_voice(
    voice_id: int,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a voice"""
    voice = db.query(Voice).filter(Voice.id == voice_id).first()
    
    if not voice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voice not found"
        )
    
    # Check permissions
    if voice.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this voice"
        )
    
    # Delete files
    try:
        if os.path.exists(voice.audio_path):
            os.remove(voice.audio_path)
        
        embedding_path = voice.audio_path.replace(
            os.path.splitext(voice.audio_path)[1], ".pkl"
        )
        if os.path.exists(embedding_path):
            os.remove(embedding_path)
    except Exception as e:
        print(f"Error deleting files: {e}")
    
    # Delete database entry
    db.delete(voice)
    db.commit()
    
    return {"message": "Voice deleted successfully"}
