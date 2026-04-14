import React, { useState } from 'react';

export default function LoginModal({ onLogin }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !username) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide');
      return;
    }

    setError('');
    onLogin(email, username);
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1>Premium Car Rentals</h1>
          <p>Louez les voitures les plus prestigieuses</p>
          <div className="hero-cars">
            <span>⚡ 🏁 👿 🔴 ✨ 🐆 🏎️</span>
          </div>
        </div>
      </div>

      <div className="login-modal" style={{ display: 'flex' }}>
        <div className="login-content">
          <h2>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>

            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Accéder à la plateforme
            </button>

            <p className="login-footer">Aucune inscription requise. Accès instantané.</p>
          </form>
        </div>
      </div>
    </>
  );
}
