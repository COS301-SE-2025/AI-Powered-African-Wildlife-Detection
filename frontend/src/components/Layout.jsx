import React from 'react';
import './Layout.css';
import { Container, Navbar, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaCamera, FaRegNewspaper, FaUser } from 'react-icons/fa';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderText = () => {
    switch (location.pathname) {
      case '/home': return 'Bush Buddy';
      case '/map': return 'Map';
      case '/capture': return 'Buddy Scanner';
      case '/feed': return 'Sightings Feed';
      case '/profile': return 'Your Profile';
      default: return 'BushBuddy';
    }
  };

  return (
    <>
      <div className="layout-wrapper">
        <Navbar fixed="top" className="header">
          <Navbar.Brand>{getHeaderText()}</Navbar.Brand>
        </Navbar>

        <Container className="main-content">
          <Outlet />
        </Container>

        <div className="nav-container">

          <Navbar className="footer">

            <Button className="nav-button" onClick={() => navigate('/main')}>
              <FaHome size={30} />
            </Button>

            <Button className="nav-button" onClick={() => navigate('/map')}>
              <FaMapMarkedAlt size={30} />
            </Button>

            <div style={{ width: "50px" }} /> {/* Spacer */}

            <Button className="nav-button-scanner" onClick={() => navigate('/capture')}>
              <FaCamera size={30} />
            </Button>

            <Button className="nav-button" onClick={() => navigate('/feed')}>
              <FaRegNewspaper size={30} />
            </Button>

            <Button className="nav-button" onClick={() => navigate('/profile')}>
              <FaUser size={25} />
            </Button>
          </Navbar>
        </div>
      </div>
    </>
  );
}

export default Layout;
