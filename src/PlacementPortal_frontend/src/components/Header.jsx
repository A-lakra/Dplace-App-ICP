import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function Header() {
    const location = useLocation();
    const [headerTitle, setHeaderTitle] = useState('');
useEffect(() => {
    console.log("Current pathname:", location.pathname); // Debugging: Check the current path

    // Check the current pathname and set the header title accordingly
    if (location.pathname === '/company-dashboard') {
      setHeaderTitle('Company Dashboard');
    } else if (location.pathname === '/student-dashboard') {
      setHeaderTitle('Student Dashboard');
    } else {
      setHeaderTitle('');
    }
  }, [location.pathname]); // This will run every time the pathname changes

  return (
    <Navbar className="bg-body-tertiary justify-content-between">
      <Form inline="true">
        <Navbar.Brand href="/" className="brandName">PLACEMENT PORTAL</Navbar.Brand>
      </Form>
      <Form inline="true">
        <Navbar.Brand href="/" className="brandName">{headerTitle}</Navbar.Brand>
      </Form>
    </Navbar>
  );
}

export default Header;
