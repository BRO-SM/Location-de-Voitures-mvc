// src/pages/admin/ClientMessages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import {
  Mail, User, MessageSquare, ChevronDown, ChevronUp,
  Send, Clock, AlertCircle, Search, Loader2, CheckCircle
} from 'lucide-react';


export default function ClientMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState({ messages: false, reply: false });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(prev => ({ ...prev, messages: true }));
        setError(null);
        const { data } = await axios.get("http://localhost:3000/api/users/contact/messages", {
          params: { adminEmail: user.email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Erreur lors du chargement des messages");
        setMessages([]);
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    if (user?.role === 'admin') fetchMessages();
  }, [user]);

  const filteredMessages = messages.filter(msg => {
    const q = searchTerm.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(q) ||
      msg.email?.toLowerCase().includes(q) ||
      msg.message?.toLowerCase().includes(q)
    );
  });

  const handleOpenMessage = async (msg) => {
    if (!msg.recipient_email) {
      try {
        await axios.put(`http://localhost:3000/api/users/contact/open/${msg.contact_id}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setMessages(prev =>
          prev.map(m =>
            m.contact_id === msg.contact_id ? { ...m, recipient_email: user.email } : m
          )
        );
      } catch (err) {
        setError("Erreur lors de l'assignation du message");
      }
    }

    setSelectedMessage(selectedMessage?.contact_id === msg.contact_id ? null : msg);
    setReplyMessage('');
    setSuccess(null);
    setError(null);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Veuillez écrire un message avant d'envoyer");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, reply: true }));
      setError(null);

      await axios.post(`http://localhost:3000/api/users/contact/reply`, {
        contact_id: selectedMessage.contact_id,
        reply: replyMessage
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setMessages(prev =>
        prev.map(m =>
          m.contact_id === selectedMessage.contact_id
            ? { ...m, reply: replyMessage, replied_by: user.name, replied_at: new Date().toISOString() }
            : m
        )
      );

      setReplyMessage('');
      setSuccess("Réponse envoyée avec succès !");
    } catch (err) {
      setError("Erreur lors de l'envoi de la réponse");
    } finally {
      setLoading(prev => ({ ...prev, reply: false }));
    }
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleString('fr-FR', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="container my-5">
      {/* Header + Search */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3><Mail className="me-2 text-primary" /> Messages des Clients</h3>
        <div className="input-group w-50">
          <span className="input-group-text"><Search /></span>
          <input type="text" className="form-control" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger d-flex align-items-center">
        <AlertCircle className="me-2" /> {error}
        <button className="btn-close ms-auto" onClick={() => setError(null)}></button>
      </div>}

      {success && <div className="alert alert-success d-flex align-items-center">
        <CheckCircle className="me-2" /> {success}
        <button className="btn-close ms-auto" onClick={() => setSuccess(null)}></button>
      </div>}

      <div className="row">
        {/* Message List */}
        <div className="col-md-5">
          <div className="list-group">
            {loading.messages && <p className="text-center py-3"><Loader2 className="me-2 spinner-border spinner-border-sm" /> Chargement...</p>}
            {filteredMessages.length === 0 && !loading.messages ? (
              <div className="text-center py-5 text-muted">
                <MessageSquare size={40} className="mb-3" />
                <p>Aucun message trouvé.</p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <button key={msg.contact_id}
                  className={`list-group-item list-group-item-action ${selectedMessage?.contact_id === msg.contact_id ? 'active' : ''} ${msg.reply ? '' : 'fw-bold'}`}
                  onClick={() => handleOpenMessage(msg)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <User size={16} className="me-2" />
                      {msg.name}
                      {!msg.recipient_email && <span className="badge bg-danger ms-2">Nouveau</span>}
                      <p className="mb-0 small text-muted">{msg.email}</p>
                      <p className="mb-0">{msg.message.length > 60 ? msg.message.slice(0, 60) + "..." : msg.message}</p>
                    </div>
                    {selectedMessage?.contact_id === msg.contact_id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="col-md-7">
          {selectedMessage ? (
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Message de {selectedMessage.name}</h5>
                <small><Clock size={14} className="me-1" /> {formatDate(selectedMessage.created_at)}</small>
              </div>
              <div className="card-body">
                <p><strong>Email :</strong> {selectedMessage.email}</p>
                <p><strong>Message :</strong></p>
                <div className="bg-light p-3 rounded mb-3">{selectedMessage.message}</div>

                {selectedMessage.reply ? (
                  <div className="alert alert-info">
                    <p><strong>Réponse :</strong></p>
                    <p>{selectedMessage.reply}</p>
                    <small className="text-muted">Par {selectedMessage.replied_by} le {formatDate(selectedMessage.replied_at)}</small>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="form-control mb-2"
                      rows={4}
                      placeholder="Écrivez votre réponse ici..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <button
                      className="btn btn-primary d-flex align-items-center"
                      onClick={handleSendReply}
                      disabled={loading.reply || !replyMessage.trim()}
                    >
                      {loading.reply ? (
                        <>
                          <Loader2 className="me-2 spinner-border spinner-border-sm" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="me-2" />
                          Envoyer
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted mt-5">
              <Mail size={48} className="mb-3" />
              <p>Aucun message sélectionné</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
