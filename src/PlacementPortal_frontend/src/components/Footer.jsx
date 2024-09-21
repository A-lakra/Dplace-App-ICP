import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Footer() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="bottom">
      <Container>
        <Navbar.Brand href="#" className="footer">Placement Dapp made by Archana with ❤️</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Footer;