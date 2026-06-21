from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    google_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    organization = Column(String)
    title = Column(String)
    application_type = Column(String)
    status = Column(String)
    date_applied = Column(Date)
    source = Column(String)
    application_url = Column(String)
    location = Column(String)
    notes = Column(Text)