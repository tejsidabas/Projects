import React from 'react';

const serviceImages = {
  cleaning: 'photo-1581578731548-c64695cc6952',
  cooking: 'photo-1556911220-e15b29be8c8f',
  laundry: 'photo-1517677208171-0bc6725a3e60',
  dishes: 'photo-1556911220-bff31c812dba',
  grocery: 'photo-1542838132-92c53300491e',
  elderly: 'photo-1576765608866-5b51046452a4'
};

export default function ServiceCard({ service, onSelect }) {
  const imageKey = serviceImages[service.id] || serviceImages.cleaning;
  const imageUrl = `https://images.unsplash.com/${imageKey}?auto=format&fit=crop&w=650&q=80`;

  return (
    <button className="service-card" onClick={() => onSelect(service)}>
      <div className="service-photo">
        <img src={imageUrl} alt={service.name} />
        <span className={`service-icon ${service.color || 'pink'}`}>
          {service.icon || '⌂'}
        </span>
      </div>

      <div className="service-card-content">
        <div className="service-title-row">
          <h3>{service.name}</h3>
          <span className="arrow-circle">↗</span>
        </div>

        <p>{service.description}</p>

        <div className="service-price">
          From <strong>₹{service.price}</strong>
          <span>/hour</span>
        </div>
      </div>
    </button>
  );
}
