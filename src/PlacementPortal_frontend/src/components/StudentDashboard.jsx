import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { PlacementPortal_backend } from 'declarations/PlacementPortal_backend';

function StudentDashboard() {
  const [companyApplied, setCompanyApplied] = useState("");
  const [studentName, setStudentName] = useState("");
  const [registeredCompanies, setRegisteredCompanies] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]); 
  const [shortlistedCandidates, setShortlistedCandidates] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch data function
  const fetchData = async () => {
    try {
      const companies = await PlacementPortal_backend.getRegisteredCompanies();
      setRegisteredCompanies(companies);

      const candidates = await PlacementPortal_backend.getStudentName();
      setAllCandidates(candidates);

      await fetchShortlistedCandidates();
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Fetch shortlisted candidates function
  const fetchShortlistedCandidates = async () => {
    try {
      const shortlistResults = await PlacementPortal_backend.publishShortlistResults();
      setShortlistedCandidates(shortlistResults);
    } catch (error) {
      console.error("Error fetching shortlisted candidates: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const handleCompanyChange = (event) => {
    setCompanyApplied(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await PlacementPortal_backend.applyForJob(studentName, companyApplied);
  
      if (result.startsWith("Candidate")) {
        setSuccessMessage(result);
        setErrorMessage("");
  
        // Manually add the newly applied candidate to the list immediately
        setAllCandidates(prevCandidates => [
          ...prevCandidates, 
          [studentName, [companyApplied]]
        ]);
  
        await fetchData(); // Fetch updated data from backend, though Nancy would already be in the UI
      } else {
        setErrorMessage(result);
        setSuccessMessage("");
      }
  
      setStudentName("");
      setCompanyApplied("");
    } catch (error) {
      console.error("Error submitting form: ", error);
      setErrorMessage("There was an error registering. Please try again.");
      setSuccessMessage("");
    }
  };
  
  

  return (
    <div className="Student">
      <Stack direction="horizontal" gap={3}>
        <div className="p-2" ms-auto>
          <Form className="CompanyForm" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formStudentName">
              <Form.Label>Student Name:</Form.Label>
              <Form.Control 
                type="text" 
                onChange={handleNameChange} 
                placeholder="Enter Your Full Name" 
                value={studentName} 
              />
              <Form.Text className="text-muted">
                You will only be able to register once.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCompanyName">
              <Form.Label>Company</Form.Label>
              <Form.Control 
                type="text" 
                onChange={handleCompanyChange} 
                placeholder="Company" 
                value={companyApplied} 
              />
            </Form.Group>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>

        <div className="p-2">
          <Card style={{ backgroundColor: "#bcd1dd" }} className="registeredCompanyStudent">
            <Card.Body>
              <Card.Title>Companies Registered</Card.Title>
              <Card.Text>
                <ul>
                  {registeredCompanies.length > 0 ? (
                    registeredCompanies.map((company, index) => (
                      <li key={index}>{company[0]}</li>
                    ))
                  ) : (
                    <li>No companies registered.</li>
                  )}
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="p-2">
          <Card style={{ backgroundColor: "#d6eaf7" }}>
            <Card.Body>
              <Card.Title>All Applied Candidates</Card.Title>
              <Card.Text>
                <ul>
                  {allCandidates.length > 0 ? (
                    allCandidates.map((candidate, index) => (
                      <li key={index}>{candidate[0]} - {candidate[1]?.join(', ')}</li>
                    ))
                  ) : (
                    <li>No candidates have applied yet.</li>
                  )}
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="p-2">
          <Card>
            <Card.Body>
              <Card.Title>Shortlisted Candidates</Card.Title>
              <Card.Text>
                <pre>{shortlistedCandidates || "No shortlisted candidates available."}</pre>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Stack>

      <Footer />
    </div>
  );
}

export default StudentDashboard;
