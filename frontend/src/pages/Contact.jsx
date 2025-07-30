import React, { useState } from 'react';
import { FiSend, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../context/useAuth';
import axios from 'axios';

export default function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.first_name + " " + user?.last_name || '',
    email: user?.email || '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    if (!user) {
      if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await axios.post("http://localhost:3000/api/users/contact", {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        user_id: user?.user_id || null
      });

      setSubmitSuccess(true);
      setFormData({
        name: user?.first_name + " " + user?.last_name || '',
        email: user?.email || '',
        message: ''
      });
    } catch (err) {
      setSubmitError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    }
  };

  return (
    <div className="container my-5" id="contact">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 text-primary">
                Contactez-nous
              </h2>

              {submitSuccess && (
                <div className="alert alert-success">Votre message a été envoyé avec succès.</div>
              )}
              {submitError && (
                <div className="alert alert-danger">{submitError}</div>
              )}

              <form onSubmit={handleSubmit}>
                {!user && (
                  <>
                    <div className="mb-3">
                      <label className="form-label"><FiUser /> Nom</label>
                      <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        name="name" value={formData.name} onChange={handleChange} />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label"><FiMail /> Email</label>
                      <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        name="email" value={formData.email} onChange={handleChange} />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label className="form-label"><FiMessageSquare /> Message</label>
                  <textarea className={`form-control ${errors.message ? "is-invalid" : ""}`}
                    name="message" rows="5" value={formData.message} onChange={handleChange}></textarea>
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi..." : "Envoyer le message"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
