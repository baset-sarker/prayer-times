import React, { useState } from 'react';
import axios from 'axios';


function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const serverURL = import.meta.env.VITE_SERVER_URL; // Get the URL
      const response = await axios.post(`/api/auth/login`, { username, password }); // Use it
      onLogin(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className='col-md-6 offset-md-3' style={{ minHeight: '1024px',paddingTop: '100px' }}>
      <div className='col-md-6 offset-md-3'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      </div>
    </div>
    
  );
}

export default Login;