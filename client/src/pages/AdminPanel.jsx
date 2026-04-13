import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Enforce root administrative intercept
  useEffect(() => {
    if(!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchComplaints();
  }, [user, navigate]);

  const fetchComplaints = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get(`${API_BASE_URL}/api/complaints`, config);
      setComplaints(response.data);
    } catch (error) {
      console.error("Failed to sync system feed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_BASE_URL}/api/complaints/${id}/status`, { status }, config);
      fetchComplaints(); // Dynamically re-trigger metrics cascade pulling updated states natively
    } catch (error) {
      console.error("Failed to commit override", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'var(--success)';
      case 'rejected': return 'var(--danger)';
      default: return 'var(--warning)';
    }
  };

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const verifiedCount = complaints.filter(c => c.status === 'verified').length;
  const rejectedCount = complaints.filter(c => c.status === 'rejected').length;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Security & Moderation Panel</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Review incoming reports, analyze evidence logs, and govern verification statuses.</p>
      </div>
      
      <div className="flex gap-20 flex-mobile-col" style={{ marginBottom: '30px' }}>
        <div className="card animate-fade-in" style={{ flex: 1, borderTop: `4px solid var(--warning)` }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{pendingCount}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Pending Review</p>
        </div>
        <div className="card animate-fade-in" style={{ flex: 1, borderTop: `4px solid var(--success)` }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{verifiedCount}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Verified Corruptions</p>
        </div>
        <div className="card animate-fade-in" style={{ flex: 1, borderTop: `4px solid var(--danger)` }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{rejectedCount}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Rejected Flags</p>
        </div>
      </div>

      <div className="card animate-fade-in">
        <div className="flex justify-between items-center flex-mobile-col" style={{ marginBottom: '20px' }}>
          <h3>Global Incident Master Feed</h3>
          <button onClick={fetchComplaints} className="btn mobile-full-width" style={{ background: 'var(--surface-color)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.8rem' }}>Re-Sync Data</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Accessing Database Overrides...</div>
        ) : complaints.length === 0 ? (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>The master feed is totally clear. No active reports.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {complaints.map((comp) => (
              <div key={comp._id} className="flex-mobile-col" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: `3px solid ${getStatusColor(comp.status)}` }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <div className="flex items-center gap-10" style={{ marginBottom: '5px' }}>
                    <h4 style={{ margin: 0 }}>{comp.title}</h4>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{comp.type.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>{comp.description}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Transmitted by User: <strong>{comp.user?.name || 'Unknown Identity'}</strong> | Node Location: <strong>{comp.location}</strong>
                  </div>
                  {comp.evidence && (
                    <div style={{ marginTop: '10px' }}>
                      <a href={`${API_BASE_URL}${comp.evidence}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', textDecoration: 'underline', color: 'var(--primary)' }}>Access Encrypted Upload Evidence</a>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px', justifyContent: 'center' }}>
                  <span style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: getStatusColor(comp.status), marginBottom: '5px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '4px' }}>
                    STATUS: {comp.status.toUpperCase()}
                  </span>
                  {comp.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusUpdate(comp._id, 'verified')} className="btn" style={{ background: 'var(--success)', color: 'black', padding: '8px', fontSize: '0.8rem' }}>Verify Override</button>
                      <button onClick={() => handleStatusUpdate(comp._id, 'rejected')} className="btn" style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '6px', fontSize: '0.8rem' }}>Flag False</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
