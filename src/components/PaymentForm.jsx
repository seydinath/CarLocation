import React, { useState } from 'react';
import { formatFcfa, formatFcfaPlus } from '../utils/currency';

export default function PaymentForm({ booking, onBack, onPay }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiryDate, setCardExpiryDate] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [termsAccept, setTermsAccept] = useState(false);
  const [privacyAccept, setPrivacyAccept] = useState(false);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/[^0-9]/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardExpiryDate(value);
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    setCardCVC(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!termsAccept || !privacyAccept) {
      alert('Veuillez accepter les conditions');
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    if (cleanCardNumber.length !== 16) {
      alert('Numéro de carte invalide');
      return;
    }

    if (cardExpiryDate.length !== 5 || cardCVC.length !== 3) {
      alert('Informations de carte invalides');
      return;
    }

    onPay({
      cardNumber: cleanCardNumber,
      cardName,
      cardExpiryDate,
      cardCVC
    });
  };

  if (!booking) return null;

  return (
    <section className="payment-section">
      <div className="payment-hero">
        <p className="booking-kicker">Validation securisee</p>
        <h2>Paiement & Confirmation</h2>
        <p className="booking-subtitle">
          Votre transaction est chiffree et votre reservation est confirmee instantanement apres validation.
        </p>
      </div>

      <div className="section-header">
        <h2>Paiement</h2>
        <p>Confirmez vos informations de paiement</p>
      </div>

      <div className="payment-container">
        {/* Résumé */}
        <div className="payment-summary">
          <div className="summary-card">
            <h3>Résumé de votre location</h3>
            <p className="section-caption">Revoyez les details avant de proceder au paiement.</p>

            <div className="booking-info">
              <div className="info-line">
                <span>Véhicule</span>
                <strong>{booking.car.emoji} {booking.car.brand} {booking.car.model}</strong>
              </div>

              <div className="info-line">
                <span>Retrait</span>
                <strong>{new Date(booking.pickup).toLocaleDateString('fr-FR')} à {booking.timeSlot}</strong>
              </div>

              <div className="info-line">
                <span>Retour</span>
                <strong>{new Date(booking.returnDate).toLocaleDateString('fr-FR')}</strong>
              </div>

              <div className="info-line">
                <span>Agence</span>
                <strong>
                  {booking.location === 'paris' && 'Paris - Orly'}
                  {booking.location === 'lyon' && 'Lyon - Satolas'}
                  {booking.location === 'marseille' && 'Marseille - Provence'}
                  {booking.location === 'nice' && 'Nice - Côte d\'Azur'}
                </strong>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="breakdown-line">
                <span>{booking.days} jour{booking.days > 1 ? 's' : ''} × {formatFcfa(booking.car.price)}</span>
                <span>{formatFcfa(booking.basePrice)}</span>
              </div>

              {Object.keys(booking.selectedOptions).map(key => {
                if (!booking.selectedOptions[key]) return null;
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
                  <div key={key} className="breakdown-line">
                    <span>{labels[key]}</span>
                    <span>{formatFcfaPlus(surcharges[key])}</span>
                  </div>
                );
              })}

              <div className="breakdown-total">
                <span>Total</span>
                <strong>{formatFcfa(booking.total)}</strong>
              </div>

              <div className="deposit-info">
                <span>Caution</span>
                <strong>{formatFcfa(booking.total * 0.3)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Forme de paiement */}
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="secure-strip">
            <span>Paiement securise SSL</span>
            <span>Confirmation immediate</span>
            <span>Support prioritaire</span>
          </div>

          <div className="form-section">
            <h3>Coordonnées</h3>

            <div className="form-group">
              <label>Nom sur la carte</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Nom et Prénom"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Informations de paiement</h3>

            <div className="form-group">
              <label>Numéro de carte</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date d'expiration</label>
                <input
                  type="text"
                  value={cardExpiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVC</label>
                <input
                  type="text"
                  value={cardCVC}
                  onChange={handleCVCChange}
                  placeholder="000"
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Conditions</h3>

            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={termsAccept}
                onChange={(e) => setTermsAccept(e.target.checked)}
                required
              />
              <span>J'accepte les conditions générales</span>
            </label>

            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={privacyAccept}
                onChange={(e) => setPrivacyAccept(e.target.checked)}
                required
              />
              <span>J'accepte la politique de confidentialité</span>
            </label>
          </div>

          <div className="button-group">
            <button type="button" className="btn-secondary" onClick={onBack}>
              Retour
            </button>
            <button type="submit" className="btn-success">
              Payer maintenant ({formatFcfa(booking.total)})
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
