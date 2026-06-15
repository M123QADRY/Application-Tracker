from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    organization: str
    title: str

    application_type: str

    status: str

    source: str

    application_url: str

    location: str

    notes: str

class StatusUpdate(BaseModel):
    status: str