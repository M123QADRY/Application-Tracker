import { useEffect, useState } from "react";
import "./App.css";
import {
  GoogleLogin,
  useGoogleLogin
} from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";
//import {
//  PieChart,
//  Pie,
//  Cell,
 // Tooltip,
 // Legend,
//} from "recharts";

function App() {
  const [applications, setApplications] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  //const [chartMode, setChartMode] = useState("type");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const user = JSON.parse(
  localStorage.getItem("google_user")
);

/*const testGmail = async () => {
  const token = localStorage.getItem(
    "gmail_access_token"
  );

console.log("Token:", token);
console.log("Length:", token?.length);

const response = await fetch(
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=200",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

console.log("Status:", response.status);

const data = await response.json();

console.log(data);

console.log(JSON.stringify(data, null, 2));

if (!data.messages) {
  console.log("No messages returned");
  return;
}

  for (const message of data.messages) {
  const emailResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const email = await emailResponse.json();

  const headers = email.payload?.headers;

  if (!headers) continue;

  const subject =
    headers.find(
      (h) => h.name.toLowerCase() === "subject"
    )?.value || "No Subject";

  const from =
    headers.find(
      (h) => h.name.toLowerCase() === "from"
    )?.value || "Unknown Sender";

  console.log({
    subject,
    from,
    snippet: email.snippet,
  });
}
}*/

  const [formData, setFormData] = useState({
  organization: "",
  title: "",
  application_type: "Job",
  status: "Applied",
  source: "",
  application_url: "",
  location: "",
  notes: "",
});


  const fetchApplications = () => {

  const userId =
    localStorage.getItem("user_id");

  if (!userId) {
    return;
  }

  fetch(
    `https://apptrack-backend-w9aw.onrender.com/applications/${userId}`
  )
    .then((res) => res.json())
    .then((data) => setApplications(data))
    .catch((err) => console.error(err));
};

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("user_id");

  const response = await fetch(
    "https://apptrack-backend-w9aw.onrender.com/applications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: Number(userId), 
        organization: formData.organization, title: formData.title, 
        application_type: formData.application_type, status: "Applied", 
        source: formData.source, 
        application_url: formData.application_url, 
        location: formData.location, notes: formData.notes,
    }),

  }
);

    if (response.ok) {
      fetchApplications();

      setFormData({
        organization: "",
        title: "",
        application_type: "Job",
        status: "Applied",
        source: "",
        application_url: "",
        location: "",
        notes: "",
      });
    }
  };

  const updateStatus = async (id, newStatus) => {
  await fetch(`https://apptrack-backend-w9aw.onrender.com/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  });

  fetchApplications();
};

const totalApplications = applications.length;

const jobs = applications.filter(
  (a) => a.application_type === "Job"
).length;

const universities = applications.filter(
  (a) => a.application_type === "University"
).length;

const scholarships = applications.filter(
  (a) => a.application_type === "Scholarship"
).length;

const interviews = applications.filter(
  (a) => a.status === "Interview"
).length;

const accepted = applications.filter(
  (a) => a.status === "Accepted"
).length;

const rejected = applications.filter(
  (a) => a.status === "Rejected"
).length;

const filteredApplications = applications.filter(
  (application) => {

    const typeMatch =
      typeFilter === "All" ||
      application.application_type === typeFilter;

    const statusMatch =
      statusFilter === "All" ||
      application.status === statusFilter;

    const searchMatch =
  application.organization
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||

  application.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||

  application.location
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||

  application.source
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

    return (
      typeMatch &&
      statusMatch &&
      searchMatch
    );
  }
);

const sortedApplications = [...filteredApplications].sort(
  (a, b) => {

    if (sortOrder === "newest") {
      return b.id - a.id;
    }

    return a.id - b.id;
  }
);

/*const typeData = [
  { name: "Job", value: jobs },
  { name: "University", value: universities },
  { name: "Scholarship", value: scholarships },
];

const statusData = [
  {
    name: "Interview",
    value: interviews,
  },
  {
    name: "Accepted",
    value: accepted,
  },
  {
    name: "Rejected",
    value: rejected,
  },
  {
    name: "Applied",
    value:
      totalApplications -
      interviews -
      accepted -
      rejected,
  },
];

const chartData =
  chartMode === "type"
    ? typeData
    : statusData;*/

const exportCSV = () => {

  const headers = [
    "Organization",
    "Title",
    "Type",
    "Status",
    "Location",
    "Source",
    "Date Applied"
  ];

  const rows = sortedApplications.map(
    (application) => [
      application.organization,
      application.title,
      application.application_type,
      application.status,
      application.location,
      application.source,
      application.date_applied,
    ]
  );

  const csvContent = [
    headers,
    ...rows
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv" }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  const today = new Date()
  .toISOString()
  .split("T")[0];

link.download =
  `applications_${today}.csv`;
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

const handleSuccess = async (
  credentialResponse
) => {

  const user = jwtDecode(
    credentialResponse.credential
  );

  const response = await fetch(
    "https://apptrack-backend-w9aw.onrender.com/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        google_id: user.sub,
        email: user.email,
        name: user.name,
      }),
    }
  );

  const dbUser =
    await response.json();

  localStorage.setItem(
    "user_id",
    dbUser.id
  );

  localStorage.setItem(
    "google_user",
    JSON.stringify(user)
  );

  window.location.reload();
};

const gmailLogin = useGoogleLogin({
  flow: "implicit",

  scope:
    "https://www.googleapis.com/auth/gmail.readonly",

  onSuccess: async (tokenResponse) => {
    console.log("Token Response:", tokenResponse);

    localStorage.setItem(
      "gmail_access_token",
      tokenResponse.access_token
    );
  },

  onError: () => {
    console.log("Gmail Login Failed");
  },
});

if (!user) {
  return (
    <div className="login-screen">
      <h1>AppTrack.</h1>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

const syncGmail = async () => {

  const token = localStorage.getItem(
    "gmail_access_token"
  );

  const universityKeywords = [
    "university",
    "institute",
    "admission",
    "graduate",
    "masters",
    "application fee waiver",
    "fall",
    "spring",
    "phd",
  ];

  console.log("Syncing Gmail...");
  console.log("Token:", token);

  const response = await fetch(
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=(application OR interview OR hiring OR recruiter OR assessment OR career OR job)&maxResults=50",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Response status:", response.status);

  const data = await response.json();

 console.log("Gmail data:", data);

if (!data.messages) {
  console.log("No messages returned");
  return;
}

 const statusRank = {
    Applied: 1,
    "Under Review": 2,
    Assessment: 3,
    Interview: 4,
    Accepted: 5,
    Rejected: 5,
  };

const existingApplications = [
  ...(applications || [])
];

for (const message of data.messages) {

  console.log("NEW LOOP RUNNING");
  console.log("Message ID:", message.id);

  const emailResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Email status:",
    emailResponse.status
  );

  const email = await emailResponse.json();

  const headers = email.payload?.headers || [];

  const dateHeader =
  headers.find(
    (h) => h.name.toLowerCase() === "date"
  )?.value || "";

const emailDate = new Date(dateHeader)
  .toISOString()
  .split("T")[0];

console.log("Email Date:", emailDate);

const subject =
  headers.find(
    (h) => h.name.toLowerCase() === "subject"
  )?.value || "No Subject";


const from =
  headers.find(
    (h) => h.name.toLowerCase() === "from"
  )?.value || "Unknown Sender";


const organization =
  from.split("<")[0].trim();

console.log("FROM:", from);
console.log("ORG:", organization);

const text =
  `${subject} ${from} ${email.snippet}`.toLowerCase();

const isUniversity = universityKeywords.some(
  (keyword) => text.includes(keyword)
);

const applicationKeywords = [
  "application received",
  "thank you for applying",
  "we received your application",
  "under review",
  "reviewing your application",
  "application is being reviewed",
 // "assessment",
//  "coding challenge",
  "online test",
 // "hackerrank",
 // "aptitude test",
  "test link",
  "interview",
  "interview invitation",
  "schedule an interview",
  "interview round",
  "offer letter",
  "selected",
  "congratulations",
  "welcome aboard",
  "we are pleased to offer",
  "offer of employment",
  "not selected",
  "regret to inform",
  "not moving forward",
  "position has been filled",
];

const isApplicationEmail =
  applicationKeywords.some(
    (keyword) => text.includes(keyword)
  );

console.log("TEXT:", text);
console.log("isUniversity:", isUniversity);
console.log(
  "isApplicationEmail:",
  isApplicationEmail
);

// Ignore job alerts, recommendations, newsletters
if (!isUniversity && !isApplicationEmail) {
  continue;
}

let status = "Applied";

// Accepted
if (
  text.includes("congratulations") ||
  text.includes("offer letter") ||
  text.includes("selected") ||
  text.includes("we are pleased to offer") ||
  text.includes("welcome aboard") ||
  text.includes("offer of employment")
) {
  status = "Accepted";
}

// Interview
else if (
  text.includes("interview") ||
  text.includes("interview invitation") ||
  text.includes("schedule an interview") ||
  text.includes("interview round")
) {
  status = "Interview";
}

// Assessment
else if (
  text.includes("assessment") ||
  text.includes("online test") ||
  text.includes("coding challenge") ||
  text.includes("aptitude test") ||
  text.includes("hackerrank") ||
  text.includes("test link")
) {
  status = "Assessment";
}

// Under Review
else if (
  text.includes("under review") ||
  text.includes("reviewing your application") ||
  text.includes("application is being reviewed")
) {
  status = "Under Review";
}

// Rejected
else if (
  text.includes("unfortunately") ||
  text.includes("not moving forward") ||
  text.includes("regret to inform") ||
  text.includes("not selected") ||
  text.includes("position has been filled")
) {
  status = "Rejected";
}

// Applied
else if (
  text.includes("thank you for applying") ||
  text.includes("application received") ||
  text.includes("we received your application") ||
  text.includes("successfully applied")
) {
  status = "Applied";
}

let applicationType = "Application";

if (isUniversity) {
  applicationType = "University";
}

console.log("Posting to AppTrack");

const payload = {
  user_id: Number(localStorage.getItem("user_id")),
  organization,
  title: subject,
  application_type: applicationType,
  status: status,
  source: "Gmail",
  date_applied: emailDate,
  application_url: "",
  location: "",
  notes: email.snippet,
};

console.log(payload);

// Prevent duplicates
const existing = existingApplications.find(
  (app) =>
    app.organization === organization
);
if (existing) {

  if (
    statusRank[status] >
    statusRank[existing.status]
  ) {

    await fetch(
      `https://apptrack-backend-w9aw.onrender.com/applications/${existing.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    console.log(
      `Updated ${organization} from ${existing.status} to ${status}`
    );
  }

  continue;
}

console.log("ABOUT TO POST");

const response = await fetch(
  "https://apptrack-backend-w9aw.onrender.com/applications",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

console.log("POST Status:", response.status);

const result = await response.json();

console.log("POST Response:", result);

existingApplications.push(result);

console.log(
  "Created AppTrack entry:",
  subject
);



// Debug log
console.log({
  subject,
  from,
  organization,
  applicationType,
  snippet: email.snippet,
});


{
  // save to AppTrack
}
}

// Refresh UI
await fetchApplications();

console.log("Gmail sync complete");

};





  // fetchApplications()
  // handleSubmit()
  // other functions...

return (
  <div className="app-layout">

    {/* LEFT PANEL */}

    <div className="form-panel">


      <h1 className="app-title">
        AppTrack.
      </h1>

      <form onSubmit={handleSubmit}>

        <input
          name="organization"
          placeholder="Organization"
          value={formData.organization}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="application_type"
          value={formData.application_type}
          onChange={handleChange}
        >
          <option value="Job">Job</option>
          <option value="University">University</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Competition">Competition</option>
          <option value="Research">Research</option>
        </select>

        <br /><br />

        <input
          name="source"
          placeholder="Source"
          value={formData.source}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="application_url"
          placeholder="Application URL"
          value={formData.application_url}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Add Application
        </button>

      </form>

      {user ? (
  <div className="user-bar">
  <img
    src={user.picture}
    alt={user.name}
    className="user-avatar"
  />

  <span>{user.name}</span>

  <div className="top-controls">
  <button onClick={gmailLogin}>Connect Gmail</button>
  <button onClick={syncGmail}>Sync Gmail</button>
  <button
    onClick={() => {
      localStorage.removeItem("google_user");
      window.location.reload();
    }}
  >
    Logout
  </button>

</div>
</div>
) : (
  <GoogleLogin
    onSuccess={handleSuccess}
    onError={() => console.log("Login Failed")}
  />
)}

    </div>

    

    

    {/* CENTER PANEL */}

    <div className="applications-panel">

      <div className="filters-row">

        <input
  type="text"
  placeholder="Search organization..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

<br /><br />

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >
          <option value="All">All Types</option>
          <option value="Job">Job</option>
          <option value="University">
            University
          </option>
          <option value="Scholarship">
            Scholarship
          </option>
          <option value="Competition">
            Competition
          </option>
          <option value="Research">
            Research
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Applied">
            Applied
          </option>

          <option value="Under Review">
            Under Review
          </option>

          <option value="Assessment">
            Assessment
          </option>

          <option value="Interview">
            Interview
          </option>

          <option value="Accepted">
            Accepted
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Withdrawn">
            Withdrawn
          </option>
        </select>

      </div>

      <select
  value={sortOrder}
  onChange={(e) =>
    setSortOrder(e.target.value)
  }
>
  <option value="newest">
    Newest First
  </option>

  <option value="oldest">
    Oldest First
  </option>
</select>

<button
  className="export-btn"
  onClick={exportCSV}
>
  Export CSV
</button>

      <h2>
  Applications ({filteredApplications.length})
</h2>

{sortedApplications.length === 0 ? (

  <div className="empty-state">
    <h3>No applications found</h3>
    <p>
      Add your first application or
      change your filters.
    </p>
  </div>

) : 


      (sortedApplications.map(
        (application) => (
          <div
            key={application.id}
            className="application-card"
          >
            <h3>
              {application.organization}
            </h3>

            <p>
              Title: {application.title}
            </p>

            <p>
              Type:{" "}
              {application.application_type}
            </p>

            <div>
              Status:

              <select
  className={`status-${application.status
    .toLowerCase()
    .replace(" ", "-")}`}
  value={application.status}
  onChange={(e) =>
    updateStatus(
      application.id,
      e.target.value
    )
  }
>
                <option value="Applied">
                  Applied
                </option>

                <option value="Under Review">
                  Under Review
                </option>

                <option value="Assessment">
                  Assessment
                </option>

                <option value="Interview">
                  Interview
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Withdrawn">
                  Withdrawn
                </option>
              </select>
            </div>

            {application.location && (
  <p>📍 {application.location}</p>
)}

            <p>Source: {application.source}</p>

            <p>
              Date:
              {" "}
              {application.date_applied}
            </p>

            <button
  onClick={async () => {

    const confirmDelete = window.confirm(
      `Delete application for ${application.organization}?`
    );

    if (!confirmDelete) {
      return;
    }

    await fetch(
      `https://apptrack-backend-w9aw.onrender.com/applications/${application.id}`,
      {
        method: "DELETE",
      }
    );

    fetchApplications();
  }}
>
  Delete
</button>


          </div>


        )
        
      ))
      }

    </div>

    {/* RIGHT PANEL */}

    <div className="dashboard">

      <h2>Dashboard</h2>

      <div className="chart-container">
  Application Statistics
</div>
      <div className="stats-grid">

  <div className="stat-card">
    <h2>{totalApplications}</h2>
    <p>Total</p>
  </div>

  <div className="stat-card">
    <h2>{jobs}</h2>
    <p>Jobs</p>
  </div>

    <div className="stat-card">
  <h2>{universities}</h2>
  <p>Universities</p>
</div>

  <div className="stat-card">
    <h2>{interviews}</h2>
    <p>Interviews</p>
  </div>

  <div className="stat-card">
    <h2>{accepted}</h2>
    <p>Accepted</p>
  </div>

  <div className="stat-card">
    <h2>{rejected}</h2>
    <p>Rejected</p>
  </div>

</div>

<footer>
  Built by Maaz Qadry
</footer>

    </div>

  </div>
);
}

export default App;
