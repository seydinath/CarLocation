import React, { useState, useEffect } from 'react';
import { formatFcfa, formatFcfaPlus } from '../utils/currency';

export default function BookingForm({ car, player, onBack, onContinue }) {
  const [pickup, setPickup] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [location, setLocation] = useState('paris');
  const [timeSlot, setTimeSlot] = useState('09:00');
  const [options, setOptions] = useState({
    insurance: false,
    gps: false,
    childSeat: false,
    driver: false,
    fuel: false,
    additionalDriver: false
  });
  const [rentalDays, setRentalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const surcharges = {
    insurance: 30000 * rentalDays,
    gps: 5000 * rentalDays,
    childSeat: 10000,
    driver: 60000 * rentalDays,
    fuel: 15000,
    additionalDriver: 7000 * rentalDays
  };

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setPickup(today);
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [pickup, returnDate, options]);

  const calculatePrice = () => {
    if (!pickup || !returnDate) return;

    const p = new Date(pickup);
    const r = new Date(returnDate);
    
    if (p >= r) return;

    const days = Math.ceil((r - p) / (1000 * 60 * 60 * 24));
    setRentalDays(days);

    let total = car.price * days;

    const surcharges = {
      insurance: 30000 * days,
      gps: 5000 * days,
      childSeat: 10000,
      driver: 60000 * days,
      fuel: 15000,
      additionalDriver: 7000 * days
    };

    Object.keys(options).forEach(key => {
      if (options[key]) {
        total += surcharges[key];
      }
    });

    setTotalPrice(total);
  };

  const handleToggleOption = (key) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pickup || !returnDate) {
      alert('Veuillez remplir toutes les dates');
      return;
    }

    if (new Date(pickup) >= new Date(returnDate)) {
      alert('La date de retour doit être après la date de retrait');
      return;
    }

    const bookingData = {
      car,
      pickup,
      returnDate,
      days: rentalDays,
      basePrice: car.price * rentalDays,
      total: totalPrice,
      selectedOptions: options,
      location,
      timeSlot
    };

    onContinue(bookingData);
  };

  return (
    <section className="booking-section">
      <div className="booking-hero">
        <div>
          <p className="booking-kicker">Configuration de votre experience</p>
          <h2>{car.brand} {car.model}</h2>
          <p className="booking-subtitle">
            Finalisez votre reservation avec une configuration sur mesure: dates, agence, options et services.
          </p>
        </div>
        <div className="booking-hero-tags">
          <span>Contrat digital rapide</span>
          <span>Assistance 7j/7</span>
          <span>Suivi reservation en temps reel</span>
        </div>
      </div>

      <div className="section-header">
        <h2>Réservation - {car.brand} {car.model}</h2>
        <p>Configurez les détails de votre location</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-container">
          {/* Dates et lieu */}
          <div className="form-section">
            <h3>Dates et lieu</h3>
            <p className="section-caption">Selectionnez vos horaires et votre agence de depart.</p>

            <div className="form-row">
              <div className="form-group">
                <label>Retrait *</label>
                <input
                  type="date"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label>Retour *</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={today}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Agence *</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="paris">Paris - Orly</option>
                  <option value="lyon">Lyon - Satolas</option>
                  <option value="marseille">Marseille - Provence</option>
                  <option value="nice">Nice - Côte d'Azur</option>
                </select>
              </div>

              <div className="form-group">
                <label>Créneau *</label>
                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                  <option value="09:00">09:00 - 10:00</option>
                  <option value="12:00">12:00 - 13:00</option>
                  <option value="15:00">15:00 - 16:00</option>
                  <option value="18:00">18:00 - 19:00</option>
                </select>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="form-section">
            <h3>Options supplémentaires</h3>
            <p className="section-caption">Ajoutez les services qui correspondent a votre usage.</p>

            <div className="options-grid">
              {[
                { key: 'insurance', label: 'Assurance Premium', price: formatFcfaPlus(30000 * rentalDays || 0) },
                { key: 'gps', label: 'GPS Premium', price: formatFcfaPlus(5000 * rentalDays || 0) },
                { key: 'childSeat', label: 'Siège Enfant', price: formatFcfaPlus(10000) },
                { key: 'driver', label: 'Chauffeur', price: formatFcfaPlus(60000 * rentalDays || 0) },
                { key: 'fuel', label: 'Carburant Préchargé', price: formatFcfaPlus(15000) },
                { key: 'additionalDriver', label: 'Conducteur Additionnel', price: formatFcfaPlus(7000 * rentalDays || 0) }
              ].map(opt => (
                <label key={opt.key} className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={options[opt.key]}
                    onChange={() => handleToggleOption(opt.key)}
                  />
                  <span className="option-text">{opt.label}</span>
                  <span className="option-price">{opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="price-summary">
            <h3>Résumé</h3>
            <p className="section-caption">Synthese instantanee de votre budget total.</p>
            <div className="summary-line">
              <span>{rentalDays} jour{rentalDays > 1 ? 's' : ''} × {formatFcfa(car.price)}</span>
              <span>{formatFcfa(car.price * rentalDays)}</span>
            </div>

            {Object.keys(options).map(key => {
              if (!options[key]) return null;
              const labels = {
                insurance: 'Assurance Premium',
                gps: 'GPS Premium',
                childSeat: 'Siège Enfant',
                driver: 'Chauffeur',
                fuel: 'Carburant Préchargé',
                additionalDriver: 'Conducteur Additionnel'
              };
              return (
                <div key={key} className="summary-line">
                  <span>{labels[key]}</span>
                  <span>{formatFcfaPlus(surcharges[key])}</span>
                </div>
              );
            })}

            <div className="summary-total">
              <span>Total</span>
              <span>{formatFcfa(totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="btn-secondary" onClick={onBack}>
            Retour
          </button>
          <button type="submit" className="btn-primary">
            Continuer vers le paiement
          </button>
        </div>
      </form>
    </section>
  );
}
