from sqlalchemy import Column, Integer, String, Date, Text
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    organization = Column(String)

    title = Column(String)

    application_type = Column(String)

    status = Column(String)

    date_applied = Column(Date)

    source = Column(String)

    application_url = Column(String)

    location = Column(String)

    notes = Column(Text)