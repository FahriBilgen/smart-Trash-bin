# Sorumlu: Mustafa

from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bins = relationship("Bin", back_populates="owner")


class Bin(Base):
    __tablename__ = "bins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Smart Trash Bin")
    empty_distance_cm = Column(Float, default=50.0)
    full_distance_cm = Column(Float, default=10.0)
    gas_threshold = Column(Float, default=1000.0)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="bins")


class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    bin_id = Column(Integer, ForeignKey("bins.id"))
    distance_cm = Column(Float, nullable=False)
    fill_percent = Column(Float, nullable=False)
    gas_raw = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    is_full = Column(Boolean, default=False)
    odor_alert = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    bin_id = Column(Integer, ForeignKey("bins.id"))
    type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
