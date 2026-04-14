import React from 'react';
import { formatFcfa } from '../utils/currency';

export default function CarsFleet({ cars, onSelectCar }) {
  const minDaily = Math.min(...cars.map((car) => car.price));
  const maxDaily = Math.max(...cars.map((car) => car.price));

  return (
    <section className="cars-section">
      <div className="fleet-hero">
        <div className="fleet-hero-copy">
          <p className="fleet-kicker">Signature Collection</p>
          <h1>Location automobile de prestige, pensee comme un service concierge.</h1>
          <p className="fleet-subtitle">
            Des vehicules selectionnes pour leur style, leur confort et leur caractere, avec une reservation rapide,
            un suivi clair et une experience premium du debut a la remise des cles.
          </p>

          <div className="fleet-tags">
            <span>Livraison aeroport</span>
            <span>Support prioritaire 7j/7</span>
            <span>Inspection avant depart</span>
          </div>
        </div>

        <div className="fleet-hero-stats">
          <div className="hero-stat-card">
            <span className="label">Vehicules</span>
            <span className="value">{cars.length}</span>
          </div>
          <div className="hero-stat-card">
            <span className="label">Tarif d'entree</span>
            <span className="value">{formatFcfa(minDaily)}</span>
          </div>
          <div className="hero-stat-card">
            <span className="label">Tarif prestige</span>
            <span className="value">{formatFcfa(maxDaily)}</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>Notre Flotte Exclusive</h2>
        <p>Selectionnez votre vehicule pour voir les details techniques et finaliser votre reservation.</p>
      </div>

      <div className="cars-grid">
        {cars.map((car) => (
          <div 
            key={car.id}
            className="car-card"
            onClick={() => onSelectCar(car)}
            style={{ cursor: 'pointer' }}
          >
            <div className="car-card-image">
              <div className="car-emoji">{car.emoji}</div>
            </div>

            <div className="car-card-info">
              <div className="car-brand">{car.brand}</div>
              <div className="car-name">{car.model}</div>
              <div className="car-price">{formatFcfa(car.price)}/jour</div>
              <div className="car-availability">Disponible immediatement</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
