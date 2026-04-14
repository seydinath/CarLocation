import React, { useState } from 'react';
import { formatFcfa } from '../utils/currency';

export default function MyBookings({ bookings, onNewBooking }) {
  const [filter, setFilter] = useState('all');

  const getFilteredBookings = () => {
    const now = new Date();

    return bookings.filter(booking => {
      const pickupDate = new Date(booking.pickup);
      const returnDate = new Date(booking.returnDate);

      if (filter === 'upcoming') {
        return pickupDate > now;
      } else if (filter === 'ongoing') {
        return pickupDate <= now && returnDate >= now;
      } else if (filter === 'past') {
        return returnDate < now;
      }
      return true;
    });
  };

  const filteredBookings = getFilteredBookings();

  return (
    <section className="my-bookings-section">
      <div className="bookings-hero">
        <p className="booking-kicker">Espace client</p>
        <h2>Gestion de vos reservations</h2>
        <p className="booking-subtitle">
          Suivez vos locations passees, en cours et a venir dans un tableau clair, avec acces direct aux informations essentielles.
        </p>
      </div>

      <div className="section-header">
        <h2>Mes Réservations</h2>
        <p>Historique et gestion de vos locations</p>
      </div>

      <div className="filter-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({bookings.length})
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            À venir
          </button>
          <button
            className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`}
            onClick={() => setFilter('ongoing')}
          >
            En cours
          </button>
          <button
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Archivées
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>😴 Aucune réservation pour ce filtre</p>
          <button className="btn-primary" onClick={onNewBooking} style={{ marginTop: '20px' }}>
            Réserver une voiture
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <span className="confirmation-badge">{booking.id}</span>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status === 'confirmed' ? '✓ Confirmée' : booking.status}
                </span>
              </div>

              <div className="booking-car">
                <span className="car-emoji">{booking.car.emoji}</span>
                <div>
                  <div className="car-name">
                    {booking.car.brand} {booking.car.model}
                  </div>
                  <div className="car-meta">
                    {booking.car.year} • {booking.car.fuel}
                  </div>
                </div>
              </div>

              <div className="booking-dates">
                <div className="date-item">
                  <span className="date-label">Retrait</span>
                  <span className="date-value">
                    {new Date(booking.pickup).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="time">{booking.timeSlot}</span>
                </div>

                <div className="arrow">→</div>

                <div className="date-item">
                  <span className="date-label">Retour</span>
                  <span className="date-value">
                    {new Date(booking.returnDate).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="duration">{booking.days}j</span>
                </div>
              </div>

              <div className="booking-info">
                <div className="info-row">
                  <span>Agence</span>
                  <strong>
                    {booking.location === 'paris' && 'Paris - Orly'}
                    {booking.location === 'lyon' && 'Lyon - Satolas'}
                    {booking.location === 'marseille' && 'Marseille - Provence'}
                    {booking.location === 'nice' && 'Nice - Côte d\'Azur'}
                  </strong>
                </div>
              </div>

              <div className="booking-price">
                <span className="label">Total</span>
                <span className="price">{formatFcfa(booking.totalPrice)}</span>
              </div>

              <div className="booking-actions">
                <button className="btn-link">Voir les détails</button>
                <button className="btn-link" style={{ color: '#ff6b6b' }}>
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        className="btn-primary new-booking-btn" 
        onClick={onNewBooking}
        style={{ marginTop: '40px', width: '100%', maxWidth: '300px' }}
      >
        Nouvelle réservation
      </button>
    </section>
  );
}
