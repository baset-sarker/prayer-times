import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import PrayerList from './components/PrayerList';
import PrayerForm from './components/PrayerForm';
import Home from './components/Home';
import Footer from './components/Footer';
import ProviderList from './components/ProviderList';
import ProviderForm from './components/ProviderForm';
import UserList from './components/UserList';


const API_URL_PRAYER = '/api/prayer';
const API_URL_PROVIDER = '/api/provider';
const API_URL_USER = '/api/auth';

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
    navigate('/prayer', { replace: true });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/', { replace: true }); 
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
              <NavLink className="nav-link" to="/prayer">Prayers</NavLink>
              <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink className="nav-link" to="/login">Login</NavLink>
          )}
        </div>
      </nav> */}

      <div className='container-fluid'>
       <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: '#04383F',borderBottom: '1px solid #f3a32c'}}>
          <a className="navbar-brand text-white" href="/"> &nbsp; &nbsp; Potsdam Masjid</a>
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
                    <NavLink className="btn btn-link nav-link text-white" to="/prayer">Prayer Times</NavLink>
                    <NavLink className="btn btn-link nav-link text-white" to="/provider">Wifi Providers</NavLink>
                    <NavLink className="btn btn-link nav-link text-white" to="/user">Admins</NavLink>
                    <button className="btn btn-link nav-link text-white" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <NavLink className="btn btn-link nav-link text-white" to="/login">Login</NavLink>
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
            <Route path="/prayer" element={<PrayerList token={token} apiUrl={API_URL_PRAYER} />} />
            <Route path="/prayer/create" element={<PrayerForm token={token} apiUrl={API_URL_PRAYER} />} />
            <Route path="/prayer/edit/:id" element={<PrayerForm token={token} apiUrl={API_URL_PRAYER} />} />

            <Route path="/provider" element={<ProviderList token={token} apiUrl={API_URL_PROVIDER} />} />
            <Route path="/provider/create" element={<ProviderForm token={token} apiUrl={API_URL_PROVIDER} />} />
            <Route path="/provider/edit/:id" element={<ProviderForm token={token} apiUrl={API_URL_PROVIDER} />} />

            <Route path="/user" element={<UserList token={token} apiUrl={API_URL_USER} />} />
            {/* <Route path="/user/create" element={<ProviderForm token={token} apiUrl={API_URL_USER} />} /> */}
            {/* <Route path="/user/edit/:id" element={<ProviderForm token={token} apiUrl={API_URL_USER} />} /> */}

            {/* <Route path="/prayer/edit/67a6a7f3910f6b920a5d4254" element={<PrayerUpdate token={token} />} /> */}
          </>
        )}
      </Routes>
      <Footer />
      
    </div>
  );
}

export default App;