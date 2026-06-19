import React, { useMemo, useState } from 'react';
import { formatFcfa } from '../utils/currency';

export default function CarsFleet({ cars, onSelectCar }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [seatsFilter, setSeatsFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');

  const minDaily = Math.min(...cars.map((car) => car.price));
  const maxDaily = Math.max(...cars.map((car) => car.price));
  const getBrandInitials = (brand) => brand.split(/[\s-]+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const fuelOptions = useMemo(() => {
    return [...new Set(cars.map((car) => car.fuel))].sort((a, b) => a.localeCompare(b));
  }, [cars]);

  const seatsOptions = useMemo(() => {
    return [...new Set(cars.map((car) => car.seats))].sort((a, b) => a - b);
  }, [cars]);

  const quickFilterOptions = [
    { id: 'all', label: 'Tous' },
    { id: 'budget', label: 'Budget' },
    { id: 'family', label: 'Famille' },
    { id: 'sport', label: 'Sport' },
    { id: 'electric', label: 'Electrique' }
  ];

  const displayedCars = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = cars.filter((car) => {
      const matchesFuel = fuelFilter === 'all' || car.fuel === fuelFilter;
      const matchesPrice =
        priceFilter === 'all'
        || (priceFilter === 'low' && car.price <= 70000)
        || (priceFilter === 'mid' && car.price > 70000 && car.price <= 150000)
        || (priceFilter === 'high' && car.price > 150000);
      const matchesSeats = seatsFilter === 'all' || car.seats >= Number(seatsFilter);
      const matchesAvailability =
        availabilityFilter === 'all'
        || (availabilityFilter === 'available' && car.available)
        || (availabilityFilter === 'unavailable' && !car.available);
      const matchesQuick =
        quickFilter === 'all'
        || (quickFilter === 'budget' && car.price <= 70000)
        || (quickFilter === 'family' && car.seats >= 5)
        || (quickFilter === 'sport' && (car.power >= 400 || car.acceleration <= 4.5))
        || (quickFilter === 'electric' && car.fuel.toLowerCase().includes('lectrique'));
      const searchableText = `${car.brand} ${car.model} ${car.year} ${car.transmission} ${car.fuel}`.toLowerCase();
      const matchesSearch = normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);
      return matchesFuel && matchesPrice && matchesSeats && matchesAvailability && matchesQuick && matchesSearch;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'power-desc':
        sorted.sort((a, b) => b.power - a.power);
        break;
      case 'price-asc':
      default:
        sorted.sort((a, b) => a.price - b.price);
    }

    return sorted;
  }, [cars, fuelFilter, priceFilter, seatsFilter, availabilityFilter, quickFilter, searchTerm, sortBy]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (searchTerm.trim()) filters.push({ key: 'search', label: `Recherche: ${searchTerm.trim()}` });
    if (quickFilter !== 'all') {
      const selectedQuick = quickFilterOptions.find((filter) => filter.id === quickFilter);
      if (selectedQuick) filters.push({ key: 'quick', label: `Rapide: ${selectedQuick.label}` });
    }
    if (fuelFilter !== 'all') filters.push({ key: 'fuel', label: `Carburant: ${fuelFilter}` });
    if (priceFilter === 'low') filters.push({ key: 'price', label: 'Prix: jusqu a 70 000 FCFA' });
    if (priceFilter === 'mid') filters.push({ key: 'price', label: 'Prix: 70 001 a 150 000 FCFA' });
    if (priceFilter === 'high') filters.push({ key: 'price', label: 'Prix: plus de 150 000 FCFA' });
    if (seatsFilter !== 'all') filters.push({ key: 'seats', label: `Places: ${seatsFilter}+` });
    if (availabilityFilter === 'available') filters.push({ key: 'availability', label: 'Disponibilite: disponible' });
    if (availabilityFilter === 'unavailable') filters.push({ key: 'availability', label: 'Disponibilite: indisponible' });
    return filters;
  }, [availabilityFilter, fuelFilter, priceFilter, quickFilter, searchTerm, seatsFilter]);

  const hasActiveFilters = activeFilters.length > 0;

  const resetFilters = () => {
    setSearchTerm('');
    setFuelFilter('all');
    setPriceFilter('all');
    setSeatsFilter('all');
    setAvailabilityFilter('all');
    setQuickFilter('all');
    setSortBy('price-asc');
  };

  const clearSingleFilter = (filterKey) => {
    if (filterKey === 'search') setSearchTerm('');
    if (filterKey === 'quick') setQuickFilter('all');
    if (filterKey === 'fuel') setFuelFilter('all');
    if (filterKey === 'price') setPriceFilter('all');
    if (filterKey === 'seats') setSeatsFilter('all');
    if (filterKey === 'availability') setAvailabilityFilter('all');
  };

  const handleCardKeyDown = (event, car) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectCar(car);
    }
  };

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
        <p>Format annonce: comparez rapidement, filtrez par besoin, puis ouvrez la fiche complete.</p>
      </div>

      <div className="quick-filters" aria-label="Filtres rapides">
        {quickFilterOptions.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`quick-filter-chip ${quickFilter === filter.id ? 'active' : ''}`}
            onClick={() => setQuickFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="fleet-toolbar" aria-label="Filtres de recherche flotte">
        <div className="fleet-toolbar-field search-field">
          <label htmlFor="fleet-search">Recherche</label>
          <input
            id="fleet-search"
            type="search"
            placeholder="Marque, modele, annee, transmission..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="fleet-toolbar-field">
          <label htmlFor="fleet-fuel">Carburant</label>
          <select
            id="fleet-fuel"
            value={fuelFilter}
            onChange={(event) => setFuelFilter(event.target.value)}
          >
            <option value="all">Tous</option>
            {fuelOptions.map((fuel) => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>

        <div className="fleet-toolbar-field">
          <label htmlFor="fleet-price">Prix</label>
          <select
            id="fleet-price"
            value={priceFilter}
            onChange={(event) => setPriceFilter(event.target.value)}
          >
            <option value="all">Tous les budgets</option>
            <option value="low">Jusqu a 70 000 FCFA</option>
            <option value="mid">70 001 a 150 000 FCFA</option>
            <option value="high">Plus de 150 000 FCFA</option>
          </select>
        </div>

        <div className="fleet-toolbar-field">
          <label htmlFor="fleet-seats">Places</label>
          <select
            id="fleet-seats"
            value={seatsFilter}
            onChange={(event) => setSeatsFilter(event.target.value)}
          >
            <option value="all">Toutes</option>
            {seatsOptions.map((seats) => (
              <option key={seats} value={seats}>{seats}+ places</option>
            ))}
          </select>
        </div>

        <div className="fleet-toolbar-field">
          <label htmlFor="fleet-availability">Disponibilite</label>
          <select
            id="fleet-availability"
            value={availabilityFilter}
            onChange={(event) => setAvailabilityFilter(event.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Indisponibles</option>
          </select>
        </div>

        <div className="fleet-toolbar-field">
          <label htmlFor="fleet-sort">Trier par</label>
          <select
            id="fleet-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix decroissant</option>
            <option value="year-desc">Annee recente</option>
            <option value="power-desc">Puissance</option>
          </select>
        </div>

        <div className="fleet-toolbar-actions">
          <button
            type="button"
            className="btn-reset-filters"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            Reinitialiser
          </button>

          <div className="fleet-results-count" aria-live="polite">
            {displayedCars.length} / {cars.length} annonce{displayedCars.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters" aria-label="Filtres actifs">
          {activeFilters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className="active-filter-chip"
              onClick={() => clearSingleFilter(filter.key)}
            >
              {filter.label} x
            </button>
          ))}
        </div>
      )}

      <div className="cars-grid">
        {displayedCars.map((car) => (
          <article
            key={car.id}
            className="car-card"
            onClick={() => onSelectCar(car)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => handleCardKeyDown(event, car)}
          >
            <div className="car-card-image">
              <img className="car-card-photo" src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy" />
              <div className="car-card-overlay"></div>
              <span className="car-brand-badge">{getBrandInitials(car.brand)}</span>
              <span className="car-year-chip">{car.year}</span>
            </div>

            <div className="car-card-info">
              <div className="car-headline">
                <div>
                  <div className="car-brand">{car.brand}</div>
                  <div className="car-name">{car.model}</div>
                </div>
                <span className={`car-availability ${car.available ? 'is-available' : 'is-unavailable'}`}>
                  {car.available ? 'Disponible' : 'Indisponible'}
                </span>
              </div>

              <div className="car-specs">
                <span>{car.fuel}</span>
                <span>{car.transmission}</span>
                <span>{car.seats} places</span>
                <span>{car.power} ch</span>
                <span>0-100 en {car.acceleration}s</span>
              </div>

              <p className="car-summary">{car.description}</p>

              <div className="car-features-inline">
                {car.features.slice(0, 3).map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            </div>

            <div className="car-card-pricing">
              <div className="car-price">{formatFcfa(car.price)}/jour</div>
              <button
                type="button"
                className="btn-view-details"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectCar(car);
                }}
              >
                Voir details
              </button>
            </div>
          </article>
        ))}
      </div>

      {displayedCars.length === 0 && (
        <p className="fleet-empty-state">Aucune annonce ne correspond aux filtres actuels.</p>
      )}
    </section>
  );
}
