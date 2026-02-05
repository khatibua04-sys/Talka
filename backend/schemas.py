from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class VoiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    language: str = "en"
    is_public: bool = False


class VoiceCreate(VoiceBase):
    pass


class Voice(VoiceBase):
    id: int
    user_id: int
    audio_path: str
    duration: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    voice_id: Optional[int] = None
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    pitch: float = Field(default=1.0, ge=0.5, le=2.0)
    language: str = Field(default="en", pattern="^(en|sw)$")
    output_format: str = Field(default="mp3", pattern="^(mp3|wav)$")


class TTSResponse(BaseModel):
    output_path: str
    duration: Optional[float] = None
    history_id: int


class TTSHistoryItem(BaseModel):
    id: int
    text: str
    voice_id: Optional[int] = None
    speed: float
    pitch: float
    output_path: Optional[str] = None
    language: str
    created_at: datetime
    
    class Config:
        from_attributes = True
