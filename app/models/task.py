from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.models.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    done = Column(Boolean, default=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
