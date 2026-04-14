import React from 'react';

export default function Header({ player, currentPage, onNavigate, onLogout }) {
  return (
    <header className="header">
      <div className="logo">
        <h1>Atelier Reserve</h1>
        <p className="tagline">Mobilite premium et service concierge</p>
      </div>

      <nav className="nav-menu">
        <button
          className={`nav-link ${currentPage === 'fleet' ? 'active' : ''}`}
          onClick={() => onNavigate('fleet')}
        >
          Flotte
        </button>
        <button
          className={`nav-link ${currentPage === 'bookings' ? 'active' : ''}`}
          onClick={() => onNavigate('bookings')}
        >
          Mes Réservations
        </button>
      </nav>

      <div className="user-panel">
        {player && (
          <>
            <span className="player-name">Client: {player.name}</span>
            <button className="btn-logout" onClick={onLogout}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
}
