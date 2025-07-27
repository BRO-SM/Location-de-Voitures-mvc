import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Switgreeting from "../UI/Alert";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    CNE: '',
    password: '',
    confirmPassword: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate fields
  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name) newErrors.last_name = 'Le nom est requis';
    if (!formData.phone_number) newErrors.phone_number = 'Le numéro de téléphone est requis';
    if (!formData.email) newErrors.email = 'L’e-mail est requis';
    if (!formData.CNE) newErrors.CNE = 'Le CNE est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { confirmPassword, ...userData } = formData;

    try {
      setIsLoading(true);
      await axios.post('http://localhost:3000/api/users/inscription', userData);
      setGreeting(" Bienvenue " + formData.first_name + " votre Compte créé avec succès" );
      setTimeout(() => navigate("/login"), 1500);
      
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.error || '❌ Échec de l’inscription, réessayez';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5 p-4 border rounded bg-light shadow-sm" style={{ maxWidth: '600px' }}>
      {greeting && <Switgreeting title={greeting} />} 
      <h2 className="mb-4 text-center">Créer un compte</h2>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Prénom</label>
          <input
            type="text"
            name="first_name"
            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label>Nom</label>
          <input
            type="text"
            name="last_name"
            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
        </div>
      </div>

      <div className="mb-3">
        <label>Numéro de téléphone</label>
        <input
          type="tel"
          name="phone_number"
          className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
          value={formData.phone_number}
          onChange={handleChange}
        />
        {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label>CNE</label>
        <input
          type="text"
          name="CNE"
          className={`form-control ${errors.CNE ? 'is-invalid' : ''}`}
          value={formData.CNE}
          onChange={handleChange}
        />
        {errors.CNE && <div className="invalid-feedback">{errors.CNE}</div>}
      </div>

      <div className="mb-3">
        <label>Mot de passe</label>
        <input
          type="password"
          name="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>

      <div className="mb-3">
        <label>Confirmer le mot de passe</label>
        <input
          type="password"
          name="confirmPassword"
          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
        {isLoading ? 'Création en cours...' : 'Créer un compte'}
      </button>

      <p className="mt-3 text-center">
        Vous avez déjà un compte ?{' '}
        <Link to="/login" className="text-primary">Se connecter</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
