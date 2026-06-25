# AppTrack

AppTrack is a full-stack application tracking platform that helps users manage job and university applications in one place. It combines manual application tracking with automated Gmail synchronization to extract and organize application-related emails.

## Features

### Authentication

* Google OAuth Login
* Secure user-specific application management

### Application Tracking

* Add, edit, delete, and manage applications
* Track jobs, internships, and university applications
* Filter and search applications
* Export application data as CSV

### Gmail Integration

* Connect Gmail using Google OAuth
* Automatically scan Gmail for application-related emails
* Extract organization names, email subjects, and timestamps
* Detect university admission emails
* Detect application status updates from recruiters

### Smart Classification

Automatically categorizes emails into:

* Applied
* Under Review
* Assessment
* Interview
* Accepted
* Rejected

Automatically distinguishes between:

* Job / Internship Applications
* University Applications

### Analytics Dashboard

* Total Applications
* University Applications
* Interviews
* Accepted Applications
* Rejected Applications

### Duplicate Prevention

* Prevents duplicate application entries
* Updates existing application records when newer status updates are detected

## Tech Stack

### Frontend

* React.js
* JavaScript
* CSS
* Google OAuth
* Recharts

### Backend

* FastAPI
* Python
* SQLAlchemy
* PostgreSQL

### Database

* PostgreSQL (Neon)

### Deployment

* Frontend: Vercel
* Backend: Render

## Workflow

1. User logs in using Google OAuth.
2. User connects Gmail.
3. AppTrack scans Gmail for application-related emails.
4. Relevant emails are classified and stored.
5. Dashboard updates automatically with application statistics.
6. Users can manually manage and track applications through the interface.

## Future Enhancements

* Automatic status progression updates
* University wishlist tracker
* Resume-to-job matching
* AI-powered application insights
* Application timeline visualization

## Author

**Maaz Qadry**
B.Tech Electronics & Communication Engineering
Jaypee Institute of Information Technology
