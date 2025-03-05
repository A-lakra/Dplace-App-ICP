
import { PlacementPortal_backend } from 'declarations/PlacementPortal_backend';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import './index.scss';
import Footer from './components/Footer';
import CenterCard from './components/CenterCard';
import StudentDashboard from './components/StudentDashboard';
import CompanyDashboard from './components/CompanyDashboard'; // Import the company dashboard

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          {/* Route for the main CenterCard component */}
          <Route path="/" element={<CenterCard />} />
          
          {/* Route for the student dashboard */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          
          {/* Route for the company dashboard */}
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
