from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    voices = relationship("Voice", back_populates="owner")
    tts_history = relationship("TTSHistory", back_populates="user")


class Voice(Base):
    __tablename__ = "voices"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    audio_path = Column(String, nullable=False)
    duration = Column(Float)
    language = Column(String, default="en")
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_public = Column(Integer, default=0)  # 0 = private, 1 = public
    
    owner = relationship("User", back_populates="voices")


class TTSHistory(Base):
    __tablename__ = "tts_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(Text, nullable=False)
    voice_id = Column(Integer, ForeignKey("voices.id"), nullable=True)
    speed = Column(Float, default=1.0)
    pitch = Column(Float, default=1.0)
    output_path = Column(String)
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="tts_history")
