import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import PrayerList from './components/PrayerList';
import PrayerForm from './components/PrayerForm';
import Home from './components/Home';
import Footer from './components/Footer';
import PrayerView from './components/PrayerView';


const API_URL = '/api/prayer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setIsAuthenticated(true);
    navigate('/prayers');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="row">
      {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">Home</NavLink>
        <div className="navbar-nav">
          {isAuthenticated ? (
            <>
              <NavLink className="nav-link" to="/prayers">Prayers</NavLink>
              <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink className="nav-link" to="/login">Login</NavLink>
          )}
        </div>
      </nav> */}

      <div className='container-fluid'>
       <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/"> &nbsp; &nbsp; Potsdam Masjid</a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleToggle}
            aria-controls="navbarNav"
            aria-expanded={!isCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>


          <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav" >
            <ul className="navbar-nav">
              {isAuthenticated ? (
                  <>
                    <NavLink className="nav-link" to="/prayers">Prayers</NavLink>
                    <NavLink className="nav-link" onClick={handleLogout} >Logout</NavLink>
                    {/* <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button> */}
                  </>
                ) : (
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                )}
            </ul>
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {isAuthenticated && (
          <>
            <Route path="/prayers" element={<PrayerList token={token} apiUrl={API_URL} />} />
            <Route path="/prayers/create" element={<PrayerForm token={token} apiUrl={API_URL} />} />
            <Route path="/prayers/edit/:id" element={<PrayerForm token={token} apiUrl={API_URL} />} />
            {/* <Route path="/prayers/edit/67a6a7f3910f6b920a5d4254" element={<PrayerUpdate token={token} />} /> */}
          </>
        )}
      </Routes>
      <Footer />
      
    </div>
  );
}

export default App;