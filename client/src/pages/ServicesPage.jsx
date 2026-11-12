import React from 'react';
import ServiceCard from '../components/ServiceCard.jsx';

export default function ServicesPage({ services, onSelectService, onNavigate }) {
  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">OUR SERVICES</span>
        <h1>A Little Help for Every Home</h1>
        <p>
          Select from our range of verified domestic services. Choose a slot and let
          Sahayata allocate the most suitable helper for your home.
        </p>
      </div>

      <div className="service-grid services-page-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={(s) => {
              onSelectService(s);
              onNavigate('helpers', { service: s.name });
            }}
          />
        ))}
      </div>
    </section>
  );
}
