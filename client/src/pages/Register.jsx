import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    
    if(!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please complete all form fields.');
      setIsLoading(false);
      return;
    }

    const result = await register(formData);
    if (!result.success) {
      setErrorMsg(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', padding: '1px' }}>
      
      {/* Background Animated Doodles */}
      <div className="doodle-icon" style={{ top: '10%', left: '15%', animationDuration: '9s' }}>✉️</div>
      <div className="doodle-icon" style={{ top: '65%', left: '8%', animationDuration: '12s', animationDelay: '1s' }}>⚖️</div>
      <div className="doodle-icon" style={{ top: '25%', right: '12%', animationDuration: '7s', fontSize: '4rem' }}>🗳️</div>
      <div className="doodle-icon" style={{ top: '75%', right: '18%', animationDuration: '10s', animationDelay: '2s' }}>🛡️</div>
      <div className="doodle-icon" style={{ top: '45%', left: '80%', animationDuration: '11s', fontSize: '2.5rem' }}>📊</div>
      {/* Expanded Doodles Layer */}
      <div className="doodle-icon" style={{ top: '5%', right: '35%', animationDuration: '14s', animationDelay: '3s', fontSize: '2rem' }}>🏛️</div>
      <div className="doodle-icon" style={{ top: '85%', left: '25%', animationDuration: '8s', animationDelay: '0.5s', fontSize: '3.5rem' }}>📢</div>
      <div className="doodle-icon" style={{ top: '35%', left: '5%', animationDuration: '13s', fontSize: '2.2rem' }}>📝</div>
      <div className="doodle-icon" style={{ top: '55%', right: '5%', animationDuration: '15s', animationDelay: '1.5s', fontSize: '3rem' }}>🔒</div>
      <div className="doodle-icon" style={{ top: '90%', right: '45%', animationDuration: '9.5s', fontSize: '2.8rem' }}>🌍</div>
      <div className="doodle-icon" style={{ top: '15%', left: '45%', animationDuration: '11.5s', animationDelay: '2s', fontSize: '2.4rem' }}>🤝</div>
      <div className="doodle-icon" style={{ top: '40%', left: '22%', animationDuration: '16s', animationDelay: '0.8s', fontSize: '2.6rem' }}>📸</div>

      <div style={{ maxWidth: '400px', margin: '40px auto', position: 'relative', zIndex: 10 }}>
      <div className="page-header" style={{ textAlign: 'center', border: 'none' }}>
        <h2 className="page-title">Join ElectoralWatch</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Register securely to report malpractices</p>
      </div>
      <div className="card">
        {errorMsg && (
            <div style={{ background: 'var(--danger)', color: 'white', padding: '12px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
              {errorMsg}
            </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" placeholder="e.g. John Doe" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="account@example.com" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Secure Password</label>
            <input type="password" name="password" className="form-control" placeholder="Minimum 6 characters" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={isLoading}>
            {isLoading ? 'Encrypting & Transmitting...' : 'Create Account'}
          </button>
        </form>
      </div>
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 10 }}>
        Already registered? <Link to="/login">Sign in here</Link>
      </p>
      </div>
    </div>
  );
};

export default Register;
