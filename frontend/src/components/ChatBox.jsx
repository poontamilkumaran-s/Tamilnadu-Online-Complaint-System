import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Info, Shield, User as UserIcon } from 'lucide-react';

const ChatBox = ({ complaintId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const data = await getMessages(complaintId);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Chat load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchChatMessages();
      // Poll chat messages every 4 seconds for pseudo-realtime experience
      const interval = setInterval(fetchChatMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [complaintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      const data = await sendMessage(complaintId, inputText.trim());
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setInputText('');
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '480px', padding: 0, overflow: 'hidden' }}>
      {/* Chat Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <MessageSquare size={18} color="var(--accent-primary)" />
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Communication & Ticket Notes</h4>
      </div>

      {/* Message History List */}
      <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlignment: 'center', color: 'var(--text-muted)', margin: 'auto' }}>Loading discussion...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlignment: 'center', color: 'var(--text-muted)', margin: 'auto', fontSize: '0.9rem' }}>
            No messages yet. Start the conversation with your agent!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
            const isSys = msg.isSystemNote;

            if (isSys) {
              return (
                <div key={msg._id} style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Info size={13} />
                    <span>{msg.message}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg._id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {msg.sender?.name || 'User'} ({msg.sender?.role || 'Member'})
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{
                  maxWidth: '75%',
                  padding: '0.75rem 1rem',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isMe ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)',
                  border: isMe ? 'none' : '1px solid var(--border-color)',
                  color: '#fff',
                  fontSize: '0.92rem',
                  wordBreak: 'break-word',
                  boxShadow: isMe ? 'var(--accent-glow)' : 'none'
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Type your message or response..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flex: 1 }}
          disabled={sending}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !inputText.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
