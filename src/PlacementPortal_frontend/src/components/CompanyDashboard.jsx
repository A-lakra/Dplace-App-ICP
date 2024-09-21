import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { PlacementPortal_backend } from '../../../declarations/PlacementPortal_backend';

const styling = {
  backgroundColor: "#f0f0f0",
  padding: "10px",
  marginTop: "2px"
};

function CompanyDashboard() {
  const [companyName, setCompanyName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [items, setItems] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");

  
  useEffect(() => {
    const fetchCompaniesAndCandidates = async () => {
      try {
        const companies = await PlacementPortal_backend.getRegisteredCompanies();
        const companyNames = companies.map(company => company[0]);
        setItems(companyNames);
  
        const candidatesData = await PlacementPortal_backend.getStudentName();
        const formattedCandidates = candidatesData.map(([name, companies]) => ({
          name,
          companies
        }));
        setCandidates(formattedCandidates);
  
        // Fetch shortlisted candidates from backend
        const shortlistedData = await PlacementPortal_backend.getShortlistedCandidates();
        
        console.log("Raw Shortlisted Data: ", shortlistedData);  // Inspecting raw data
  
        // Assuming the structure is [candidateName, company]
        const shortlistedSet = new Set(shortlistedData.map(candidate => candidate[0]));
        setShortlistedCandidates(shortlistedSet);
  
        console.log("Shortlisted Candidates Set: ", shortlistedSet);
      } catch (error) {
        setErrorMessage("Failed to load data from the server.");
        console.error("Error fetching data:", error);
      }
    };
  
    fetchCompaniesAndCandidates();
  }, []);
  


  const handleCompanyNameChange = (event) => {
    setCompanyName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (companyName) {
      try {
        const existingCompanies = await PlacementPortal_backend.getRegisteredCompanies();
        const companyNames = existingCompanies.map(company => company[0]);

        if (companyNames.includes(companyName)) {
          alert("Company already registered.");
          return;
        }

        await PlacementPortal_backend.registerCompany(companyName);
        setItems((prevItems) => [...prevItems, companyName]);
        setCompanyName("");
        alert("Company registered successfully!");
      } catch (error) {
        alert("Failed to register company. Please try again.");
      }
    } else {
      alert("Please enter a company name.");
    }
  };

 
  const handleCompanySelect = (event) => {
    const selectedCompany = event.target.value;
    setSelectedCompany(selectedCompany);
  
    // Make sure to log the selected company and shortlisted candidates for debugging
    console.log("Selected Company: ", selectedCompany);
    console.log("Shortlisted Candidates: ", shortlistedCandidates);
  
    // Filter candidates who applied to the selected company and have not been shortlisted
    const availableCandidates = candidates.filter(candidate =>
      candidate.companies.includes(selectedCompany) && !shortlistedCandidates.has(candidate.name)
    );
  
    console.log("Filtered Candidates: ", availableCandidates);  // Log filtered candidates for debugging
  
    setFilteredCandidates(availableCandidates);
  };
  
  
  

  const handleCandidateSelect = (event) => {
    setSelectedCandidate(event.target.value);
  };

  const shortlistCandidate = async () => {
    try {
      if (!selectedCompany || !selectedCandidate) {
        alert("Please select both a company and a candidate.");
        return;
      }
  
      // Check if the candidate is already shortlisted
      if (shortlistedCandidates.has(selectedCandidate)) {
        alert(`${selectedCandidate} has already been shortlisted.`);
        return;
      }
  
      await PlacementPortal_backend.shortlistCandidate(selectedCompany, selectedCandidate);
  
      // Log the shortlisted candidates
      console.log("Before Adding to Shortlist: ", shortlistedCandidates);
  
      // Update shortlisted candidates
      setShortlistedCandidates(prev => {
        const newSet = new Set(prev);
        newSet.add(selectedCandidate);
        return newSet;
      });
  
      alert(`Successfully shortlisted ${selectedCandidate} for ${selectedCompany}`);
  
      // Filter out the selected candidate from the dropdown
      setFilteredCandidates(prevCandidates =>
        prevCandidates.filter(candidate => candidate.name !== selectedCandidate)
      );
  
      console.log("After Adding to Shortlist: ", shortlistedCandidates);
  
      setSelectedCandidate("");  // Reset selected candidate
    } catch (error) {
      alert("Failed to shortlist candidate. Please try again.");
      console.error("Error shortlisting candidate:", error);
    }
  };
  
  
  


  return (
    <div className="Company" style={styling}>
      <Stack direction="horizontal" gap={3}>
      
        <div className="p-2" ms-auto>
        
          <Form className="CompanyForm" onSubmit={handleSubmit}>
          <Card.Title className="rb-title">Registration Board</Card.Title>
            <Form.Group className="mb-3" controlId="formCompanyName">
            
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Company Name"
                value={companyName}
                onChange={handleCompanyNameChange}
              />
              <Form.Text className="text-muted">
                You will only be able to register once.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">Register Company</Button>
          </Form>
         
        </div>
        

        <div className="p-2" ms-auto>
          <Card className="RegisteredComputer">
            <Card.Body>
              <Card.Title className="cr-title">Companies Registered</Card.Title>
              <Card.Text>
                <ul>
                {items.length > 0 ? (
                    items.map((companyName, index) => (
                      <li key={index}>{companyName}</li>
                    ))
                  ) : (
                    <li>No companies registered.</li>
                  )}
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="p-2" ms-auto>
          <Card >
          <Card.Title className="rb-title">ShortListing Board</Card.Title>
            <Form.Group className="mb-3">
              <Form.Label>Select Company</Form.Label>
              <Form.Control as="select" onChange={handleCompanySelect} value={selectedCompany}>
                <option value="">Select a Company</option>
                {items.map((companyName, index) => (
                  <option key={index} value={companyName}>
                    {companyName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
  <Form.Label>Select Candidate</Form.Label>
  <Form.Control as="select" onChange={handleCandidateSelect} value={selectedCandidate}>
    <option value="">Select a Candidate</option>
    {filteredCandidates.length > 0 ? (
      filteredCandidates.map((candidate, index) => (
        <option key={index} value={candidate.name}>
          {candidate.name}
        </option>
      ))
    ) : (
      <option>No candidates available for this company.</option>
    )}
  </Form.Control>
</Form.Group>



            <Button variant="primary" onClick={shortlistCandidate}>
              Shortlist Candidate
            </Button>
          </Card> </div>

      </Stack>

      <Footer />
    </div>
  );
}

export default CompanyDashboard;
