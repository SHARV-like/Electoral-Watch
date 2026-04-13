import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const ReportForm = () => {
  const [formData, setFormData] = useState({ title: '', location: '', type: '', description: '', customType: '' });
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setEvidenceFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if(!formData.title || !formData.location || !formData.type || !formData.description) {
      setErrorMsg('Please complete all foundational text fields.');
      setIsLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      // We use FormData natively here because of Multer configuration on the backend
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('location', formData.location);
      // Map custom type dynamically directly to the DB type string validation if selected
      uploadData.append('type', formData.type === 'custom' ? `Custom: ${formData.customType}` : formData.type);
      uploadData.append('description', formData.description);
      
      if (evidenceFile) {
        uploadData.append('evidence', evidenceFile);
      }

      await axios.post(`${API_BASE_URL}/api/complaints`, uploadData, config);
      
      setSuccessMsg('Report securely submitted. Encrypting and redirecting to feed...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setErrorMsg(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="page-header flex justify-between items-center header-actions">
        <div>
          <h2 className="page-title">Submit Evidence</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Please be concise and ensure data accuracy</p>
        </div>
        <Link to="/dashboard" className="btn mobile-full-width" style={{ background: 'var(--surface-color)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>Cancel</Link>
      </div>
      
      <div className="card">
        {errorMsg && <div style={{ background: 'var(--danger)', color: 'white', padding: '12px', borderRadius: '4px', marginBottom: '15px' }}>{errorMsg}</div>}
        {successMsg && <div style={{ background: 'var(--success)', color: 'white', padding: '12px', borderRadius: '4px', marginBottom: '15px' }}>{successMsg}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Incident Headline</label>
            <input type="text" name="title" className="form-control" placeholder="Brief summary (e.g., Unofficial individuals in booth)" value={formData.title} onChange={handleChange} />
          </div>
          
          <div className="flex gap-20 flex-mobile-col" style={{ marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Location Details</label>
              <input type="text" name="location" className="form-control" placeholder="Booth number, Area code, City" value={formData.location} onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Malpractice Classification</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="bribery">Bribery / Buying Votes</option>
                <option value="booth_capturing">Booth Capturing</option>
                <option value="fake_voting">Fraudulent Voting</option>
                <option value="voter_intimidation">Voter Intimidation</option>
                <option value="other">Other / Unknown</option>
                <option value="custom" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Define Custom Category</option>
              </select>
              
              {formData.type === 'custom' && (
                 <div className="animate-fade-in" style={{ marginTop: '15px' }}>
                   <label className="form-label" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>↳ Specify Exact Category</label>
                   <input type="text" name="customType" className="form-control" placeholder="e.g., Cyber Attack on Machines" value={formData.customType} onChange={handleChange} required style={{ borderLeft: '3px solid var(--primary)', background: 'rgba(0,0,0,0.3)' }} />
                 </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description of Events</label>
            <textarea name="description" className="form-control" rows="5" placeholder="Provide full context, including times..." value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center' }}>
            <label className="form-label" style={{ marginBottom: '15px' }}>Attach Secure Evidence</label>
            
            <div className="flex gap-10 flex-mobile-col" style={{ justifyContent: 'center', marginBottom: '15px' }}>
              <label className="btn btn-primary mobile-full-width" style={{ cursor: 'pointer', background: 'var(--danger)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                📸 Capture Photo
                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>

              <label className="btn mobile-full-width" style={{ cursor: 'pointer', background: 'rgba(239, 71, 111, 0.3)', border: '1px solid var(--danger)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                🎥 Record Video
                <input type="file" accept="video/*" capture="environment" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>

              <label className="btn mobile-full-width" style={{ cursor: 'pointer', background: 'var(--surface-color)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                📁 Browse Files
                <input type="file" accept=".jpg,.jpeg,.png,.mp4,.mkv" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
            </div>

            {evidenceFile && (
              <div style={{ background: 'var(--success)', color: 'black', padding: '8px', borderRadius: '4px', fontSize: '0.9rem', display: 'inline-block', fontWeight: 'bold' }}>
                ✓ {evidenceFile.name} attached
              </div>
            )}
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
              Taking live photos/videos via camera natively encrypts the upload transmission.
            </p>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px' }} disabled={isLoading}>
            {isLoading ? 'Transmitting Securely...' : 'Securely Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
