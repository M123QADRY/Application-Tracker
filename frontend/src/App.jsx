import { useEffect, useState } from "react";

function App() {
  const [applications, setApplications] = useState([]);

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
    fetch("http://127.0.0.1:8000/applications")
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

  console.log(formData);

  const response = await fetch(
    "http://127.0.0.1:8000/applications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
  await fetch(`http://127.0.0.1:8000/applications/${id}`, {
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Application Tracker AI</h1>

    <div
  style={{
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "20px",
  }}
>
  <h3>Dashboard</h3>

  <p>Total Applications: {totalApplications}</p>

  <p>Jobs: {jobs}</p>

  <p>Universities: {universities}</p>

  <p>Scholarships: {scholarships}</p>

  <p>Interviews: {interviews}</p>

  <p>Accepted: {accepted}</p>

  <p>Rejected: {rejected}</p>
</div>

      <form onSubmit={handleSubmit}>
        <input
          name="organization"
          placeholder="organization"
          value={formData.organization}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="title"
          placeholder="title"
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

        <button type="submit">Add Application</button>
      </form>

      <hr />

      {applications.map((application) => (
        <div
          key={application.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{application.organization}</h3>
          <p>Title: {application.title}</p>
          <p>Type: {application.application_type}</p>
          <div>
  Status:

  <select
    value={application.status}
    onChange={(e) =>
      updateStatus(
        application.id,
        e.target.value
      )
    }
  >
    <option value="Applied">Applied</option>
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
          <p>Location: {application.location}</p>
          <p>Date Applied: {application.date_applied}</p>
        </div>
      ))}
    </div>
  );
}

export default App;