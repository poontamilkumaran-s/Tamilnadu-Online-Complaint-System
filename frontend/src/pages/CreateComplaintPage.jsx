import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { PlusCircle, FileText, AlertTriangle, Paperclip, ArrowLeft, Send } from 'lucide-react';

const CreateComplaintPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    priority: 'Medium',
    attachmentName: '',
    attachmentUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addComplaint } = useComplaints();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const attachments = formData.attachmentUrl
      ? [{ name: formData.attachmentName || 'Attachment', url: formData.attachmentUrl }]
      : [];

    const res = await addComplaint({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      attachments,
    });

    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Submit New Complaint</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Provide clear details to help agents resolve your request efficiently</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>Complaint Title / Subject *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Unable to generate monthly PDF invoice reports"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={150}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              >
                <option value="Technical">Technical Support</option>
                <option value="Billing">Billing & Finance</option>
                <option value="Service">Account & Service</option>
                <option value="Product">Product Feedback</option>
                <option value="Other">General / Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>Priority Level *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              >
                <option value="Low">Low - General inquiry</option>
                <option value="Medium">Medium - Normal issue</option>
                <option value="High">High - Impairing workflow</option>
                <option value="Urgent">Urgent - System outage or billing error</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>Detailed Description *</label>
            <textarea
              name="description"
              rows={6}
              placeholder="Describe what happened, error codes observed, steps to reproduce, and expected outcome..."
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Optional Attachment Link */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: '#a5b4fc' }}>
              <Paperclip size={16} /> Optional Supporting Attachment Link
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
              <input
                type="text"
                name="attachmentName"
                placeholder="Name (e.g. Screenshot)"
                value={formData.attachmentName}
                onChange={handleChange}
              />
              <input
                type="url"
                name="attachmentUrl"
                placeholder="URL (e.g. https://imgur.com/screenshot.png)"
                value={formData.attachmentUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Complaint'} <Send size={16} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateComplaintPage;
