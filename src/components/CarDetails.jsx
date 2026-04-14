import React from 'react';
import CarViewer3D from './CarViewer3D';
import { formatFcfa } from '../utils/currency';

export default function CarDetails({ car, onBack, onContinueBooking }) {
  const updatePerformanceBar = (value, max) => {
    return (value / max) * 100;
  };

  if (!car) return null;

  return (
    <section className="car-details">
      <div className="details-container">
        <div className="car-showcase">
          <div className="car-signature-row">
            <span className="signature-pill">Collection Signature</span>
            <span className="signature-pill">Service Concierge</span>
            <span className="signature-pill">Assurance Assistance</span>
          </div>

          <div className="car-platform">
            <CarViewer3D car={car} />
          </div>

          {!car.available && (
            <div className="lock-indicator">
              <div className="lock-content">🔒</div>
              <div className="lock-text">Non disponible</div>
            </div>
          )}
        </div>

        <div className="car-info-panel">
          <div className="car-header">
            <h3 className="car-brand">{car.brand}</h3>
            <h2 className="car-model">{car.model}</h2>
            <div className="rating">Experience Premium</div>
          </div>

          <div className="description-box">
            <p>{car.description}</p>
          </div>

          <div className="experience-points">
            <div className="experience-point">
              <span className="point-title">Livraison sur demande</span>
              <span className="point-copy">Aeroport, hotel ou adresse professionnelle.</span>
            </div>
            <div className="experience-point">
              <span className="point-title">Preparation detaillee</span>
              <span className="point-copy">Vehicule controle, nettoye et pret a partir.</span>
            </div>
            <div className="experience-point">
              <span className="point-title">Assistance prioritaire</span>
              <span className="point-copy">Equipe disponible 7j/7 pendant toute la location.</span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Année</span>
              <span className="info-value">{car.year}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Carburant</span>
              <span className="info-value">{car.fuel}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Transmission</span>
              <span className="info-value">{car.transmission}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Places</span>
              <span className="info-value">{car.seats}</span>
            </div>
          </div>

          <div className="performance-section">
            <h4>Performances</h4>
            
            <div className="performance-bar">
              <div className="perf-label">Puissance</div>
              <div className="perf-value">{car.power} ch</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${updatePerformanceBar(car.power, 1000)}%` }}
                ></div>
              </div>
            </div>

            <div className="performance-bar">
              <div className="perf-label">Vitesse max</div>
              <div className="perf-value">{car.speed} km/h</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${updatePerformanceBar(car.speed, 350)}%` }}
                ></div>
              </div>
            </div>

            <div className="performance-bar">
              <div className="perf-label">Accél. 0-100</div>
              <div className="perf-value">{car.acceleration}s</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${100 - updatePerformanceBar(car.acceleration, 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="features-section">
            <h4>Équipements</h4>
            <div className="features-grid">
              {car.features.map((feature, idx) => (
                <div key={idx} className="feature-badge">
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="price-detail">
            <span className="price-label">Prix journalier</span>
            <span className="price-value">{formatFcfa(car.price)}</span>
          </div>

          <div className="premium-note">
            Caution et conditions contractuelles detaillees avant validation finale.
          </div>

          <div className="button-group">
            <button className="btn-secondary" onClick={onBack}>
              Retour
            </button>
            <button 
              className="btn-primary" 
              onClick={onContinueBooking}
              disabled={!car.available}
            >
              {car.available ? 'Continuer la réservation' : 'Non disponible'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
