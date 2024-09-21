import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

const CenterCard = () => {
  const navigate = useNavigate();

  // Handles the navigation to the student dashboard
  const handleStudentClick = () => {
    navigate('/student-dashboard'); // The path should match the one in your App.js Routes
  };

  // Handles the navigation to the company dashboard
  const handleCompanyClick = () => {
    navigate('/company-dashboard'); // The path should match the one in your App.js Routes
  };

  // const styles={
  //  width: "30rem",
  //  height: "30rem"
  // }
  return (
    <Card  id="centercard" >
      <Card.Img variant="top" src="https://www.jnncollege.edu.in/wp-content/uploads/2019/03/placementcell.png" />
      <Card.Body>
        <Card.Title>
          <strong>Welcome!</strong> to the Training And Placement Cell of National Institute of Technology, Jamshedpur.
        </Card.Title>
        <Card.Text>
          <p>Some important things to Note:</p>
          <ul>
            <li>For Students:</li>
            <ul>
              <li>Students can only apply to a Company once.</li>
              <li>Students can apply to multiple companies.</li>
              <li>Once selected, you will not be able to apply to any other company.</li>
            </ul>
            <li>For Companies:</li>
            <ul>
              <li>Companies can register only once.</li>
            </ul>
            <li>Shortlisted candidates will be visible to all.</li>
          </ul>
        </Card.Text>
        <div className="cardButton">
          <Button className="Student" onClick={handleStudentClick} variant="primary">
            Student
          </Button>
          <Button className="Company" onClick={handleCompanyClick} variant="primary">
            Company
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CenterCard;
