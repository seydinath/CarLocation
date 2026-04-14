import React, { useEffect } from 'react';
import { formatFcfa, formatFcfaPlus } from '../utils/currency';

export default function Confirmation({ booking, onNewBooking, onViewBookings }) {
  useEffect(() => {
    // Animation confettis
    const confettiEmojis = ['🎉', '🚗', '⭐', '🎊', '✨'];
    const container = document.querySelector('.confetti-container');
    
    if (container) {
      for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
      }
    }
  }, []);

  if (!booking) return null;

  return (
    <section className="confirmation-section">
      <div className="confetti-container"></div>

      <div className="confirmation-content">
        <div className="confirmation-hero">
          <p className="booking-kicker">Reservation finalisee</p>
          <h2>Votre vehicule est confirme</h2>
          <p className="booking-subtitle">
            Votre dossier est enregistre. Tous les details de retrait et de contrat sont prets pour votre arrivee.
          </p>
        </div>

        <div className="success-header">
          <div className="success-icon">✓</div>
          <h2>Réservation Confirmée!</h2>
          <p>Votre véhicule a été réservé avec succès</p>
        </div>

        <div className="confirmation-card">
          <div className="confirmation-number">
            <span className="label">Numero de confirmation</span>
            <span className="number">{booking.id}</span>
          </div>

          <div className="confirmation-details">
            <h3>Détails de votre location</h3>

            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Véhicule</span>
                <span className="value">
                  {booking.car.emoji} {booking.car.brand} {booking.car.model}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Catégorie</span>
                <span className="value">{booking.car.year} • {booking.car.fuel}</span>
              </div>

              <div className="detail-item">
                <span className="label">Retrait</span>
                <span className="value">
                  {new Date(booking.pickup).toLocaleDateString('fr-FR')} à {booking.timeSlot}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Retour</span>
                <span className="value">
                  {new Date(booking.returnDate).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Durée</span>
                <span className="value">{booking.days} jour{booking.days > 1 ? 's' : ''}</span>
              </div>

              <div className="detail-item">
                <span className="label">Agence</span>
                <span className="value">
                  {booking.location === 'paris' && 'Paris - Orly'}
                  {booking.location === 'lyon' && 'Lyon - Satolas'}
                  {booking.location === 'marseille' && 'Marseille - Provence'}
                  {booking.location === 'nice' && 'Nice - Côte d\'Azur'}
                </span>
              </div>
            </div>
          </div>

          <div className="price-section">
            <div className="price-line">
              <span>Location</span>
              <span>{formatFcfa(booking.basePrice)}</span>
            </div>

            {Object.keys(booking.options || {}).map(key => {
              if (!booking.options[key]) return null;
              const surcharges = {
                insurance: 30000 * booking.days,
                gps: 5000 * booking.days,
                childSeat: 10000,
                driver: 60000 * booking.days,
                fuel: 15000,
                additionalDriver: 7000 * booking.days
              };
              const labels = {
                insurance: 'Assurance Premium',
                gps: 'GPS Premium',
                childSeat: 'Siège Enfant',
                driver: 'Chauffeur',
                fuel: 'Carburant Préchargé',
                additionalDriver: 'Conducteur Additionnel'
              };
              return (
                <div key={key} className="price-line">
                  <span>{labels[key]}</span>
                  <span>{formatFcfaPlus(surcharges[key])}</span>
                </div>
              );
            })}

            <div className="price-total">
              <span>Montant à payer</span>
              <span>{formatFcfa(booking.totalPrice)}</span>
            </div>
          </div>

          <div className="important-info">
            <h4>📋 Informations importantes</h4>
            <ul>
              <li>Présentez votre permis de conduire et votre pièce d'identité</li>
              <li>Arrivez 15 minutes avant l'heure de retrait</li>
              <li>Une caution vous sera demandée à la remise du véhicule</li>
              <li>Vous pouvez modifier ou annuler 48h avant la date</li>
            </ul>
          </div>
        </div>

        <div className="button-group">
          <button className="btn-secondary" onClick={onNewBooking}>
            Retourner à la flotte
          </button>
          <button className="btn-primary" onClick={onViewBookings}>
            Voir mes réservations
          </button>
        </div>
      </div>
    </section>
  );
}
