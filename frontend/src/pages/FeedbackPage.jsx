import React, { useEffect, useState } from 'react';
import { getFeedbacks, submitFeedback } from '../services/feedbackService';
import { getComplaints } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import { Star, MessageSquare, CheckCircle, Send, AlertCircle } from 'lucide-react';

const FeedbackPage = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ complaintId: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const fbRes = await getFeedbacks();
      if (fbRes.success) setFeedbacks(fbRes.feedbacks);

      if (user?.role === 'USER') {
        const compRes = await getComplaints({ status: 'RESOLVED' });
        if (compRes.success) {
          // Filter out complaints that already have feedback submitted
          const submittedComplaintIds = fbRes.feedbacks.map((f) => f.complaint?._id);
          const eligible = compRes.complaints.filter((c) => !submittedComplaintIds.includes(c._id));
          setResolvedTickets(eligible);
          if (eligible.length > 0) {
            setForm((prev) => ({ ...prev, complaintId: eligible[0]._id }));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.complaintId) return;

    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await submitFeedback(form);
      if (res.success) {
        setMsg({ type: 'success', text: 'Thank you! Your feedback has been recorded.' });
        setForm({ complaintId: '', rating: 5, comment: '' });
        loadData();
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error submitting feedback' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Feedback & Performance Reviews</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>User ratings and reviews following complaint resolution</p>
      </div>

      {/* User Feedback Submission Card */}
      {user?.role === 'USER' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="#fbbf24" /> Leave Complaint Feedback
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Select one of your resolved tickets and rate the assistance provided by our agent.
          </p>

          {msg.text && (
            <div style={{
              background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              color: msg.type === 'success' ? '#6ee7b7' : '#fca5a5',
              fontSize: '0.88rem',
              marginBottom: '1.25rem'
            }}>
              {msg.text}
            </div>
          )}

          {resolvedTickets.length === 0 ? (
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No pending resolved complaints awaiting feedback.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Select Resolved Complaint Ticket</label>
                <select
                  value={form.complaintId}
                  onChange={(e) => setForm({ ...form, complaintId: e.target.value })}
                  required
                  style={{ width: '100%' }}
                >
                  {resolvedTickets.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.ticketId} — {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Your Rating (1 to 5 Stars)</label>
                <RatingStars
                  rating={form.rating}
                  onRate={(val) => setForm({ ...form, rating: val })}
                  size={24}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Comments / Review</label>
                <textarea
                  rows={4}
                  placeholder="Share details about the quality and speed of resolution..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'} <Send size={16} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Feedbacks Stream / List */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Recent Platform Reviews & Feedback</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading feedback...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No feedback reviews submitted yet.</div>
        ) : (
          <div className="grid-2">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{fb.complaint?.ticketId}</span>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginTop: '0.1rem' }}>{fb.complaint?.title}</div>
                    </div>
                    <RatingStars rating={fb.rating} readOnly size={16} />
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.5 }}>
                    "{fb.comment || 'No text comment left.'}"
                  </p>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  <span>User: <strong style={{ color: 'var(--text-muted)' }}>{fb.user?.name}</strong></span>
                  <span>Agent: <strong style={{ color: '#67e8f9' }}>{fb.agent?.name || 'Support'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default FeedbackPage;
