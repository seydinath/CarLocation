import React from 'react';

export default function Notification({ message, type = 'info' }) {
  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
    </div>
  );
}
