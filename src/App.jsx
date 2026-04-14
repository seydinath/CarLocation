import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import CarsFleet from './components/CarsFleet';
import CarDetails from './components/CarDetails';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import Confirmation from './components/Confirmation';
import MyBookings from './components/MyBookings';
import Notification from './components/Notification';
import { carsDatabase } from './data/cars';
import './styles.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('fleet');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [notification, setNotification] = useState(null);

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedPlayer = localStorage.getItem('premiumRentalPlayer');
    const savedBookings = localStorage.getItem('premiumRentals');
    
    if (savedPlayer) {
      setCurrentPlayer(JSON.parse(savedPlayer));
      setCurrentPage('fleet');
    }
    
    if (savedBookings) {
      setAllBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Sauvegarde joueur
  const handleLogin = (email, username) => {
    const player = {
      name: username,
      email: email,
      loginTime: new Date().toLocaleTimeString('fr-FR')
    };
    setCurrentPlayer(player);
    localStorage.setItem('premiumRentalPlayer', JSON.stringify(player));
    setCurrentPage('fleet');
    showNotification(`Bienvenue ${username}! 🎉`, 'success');
  };

  // Logout
  const handleLogout = () => {
    setCurrentPlayer(null);
    setSelectedCar(null);
    setCurrentBooking(null);
    setCurrentPage('fleet');
    localStorage.removeItem('premiumRentalPlayer');
    showNotification('À bientôt! 👋', 'success');
  };

  // Sélectionner une voiture
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setCurrentPage('details');
  };

  // Aller à la réservation
  const handleGoToBooking = () => {
    if (!selectedCar) {
      showNotification('Veuillez sélectionner une voiture', 'error');
      return;
    }
    setCurrentPage('booking');
  };

  // Sauvegarder la réservation et aller au paiement
  const handleGoToPayment = (bookingData) => {
    setCurrentBooking(bookingData);
    setCurrentPage('payment');
  };

  // Traiter le paiement
  const handleProcessPayment = (paymentData) => {
    const confirmationNumber = 'BOOK' + Date.now().toString().slice(-8);
    
    const booking = {
      id: confirmationNumber,
      playerId: currentPlayer.email,
      player: currentPlayer.name,
      email: currentPlayer.email,
      car: currentBooking.car,
      pickup: currentBooking.pickup,
      returnDate: currentBooking.returnDate,
      days: currentBooking.days,
      basePrice: currentBooking.basePrice,
      totalPrice: currentBooking.total,
      options: currentBooking.selectedOptions,
      location: currentBooking.location,
      timeSlot: currentBooking.timeSlot,
      status: 'confirmed',
      createdAt: new Date().toLocaleString('fr-FR'),
      cardLast4: paymentData.cardNumber.slice(-4)
    };

    const updatedBookings = [...allBookings, booking];
    setAllBookings(updatedBookings);
    localStorage.setItem('premiumRentals', JSON.stringify(updatedBookings));
    
    setCurrentPage('confirmation');
    showNotification(`✓ Réservation confirmée! Numéro: ${confirmationNumber}`, 'success');
  };

  // Afficher notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Si pas connecté, afficher login
  if (!currentPlayer) {
    return (
      <div className="app">
        <LoginModal onLogin={handleLogin} />
      </div>
    );
  }

  // Affichage selon la page actuelle
  const renderPage = () => {
    switch (currentPage) {
      case 'fleet':
        return (
          <CarsFleet 
            cars={carsDatabase}
            onSelectCar={handleSelectCar}
          />
        );
      
      case 'details':
        return (
          <CarDetails 
            car={selectedCar}
            onBack={() => setCurrentPage('fleet')}
            onContinueBooking={handleGoToBooking}
          />
        );
      
      case 'booking':
        return (
          <BookingForm 
            car={selectedCar}
            player={currentPlayer}
            onBack={() => setCurrentPage('details')}
            onContinue={handleGoToPayment}
          />
        );
      
      case 'payment':
        return (
          <PaymentForm 
            booking={currentBooking}
            onBack={() => setCurrentPage('booking')}
            onPay={handleProcessPayment}
          />
        );
      
      case 'confirmation':
        return (
          <Confirmation 
            booking={allBookings[allBookings.length - 1]}
            onNewBooking={() => {
              setCurrentPage('fleet');
              setSelectedCar(null);
            }}
            onViewBookings={() => setCurrentPage('bookings')}
          />
        );
      
      case 'bookings':
        return (
          <MyBookings 
            bookings={allBookings.filter(b => b.playerId === currentPlayer.email)}
            onNewBooking={() => {
              setCurrentPage('fleet');
              setSelectedCar(null);
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header 
        player={currentPlayer}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
        />
      )}
    </div>
  );
}
