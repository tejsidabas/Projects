import React, { useState } from 'react';

export default function ContactPage({ onShowNotice }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Booking inquiry',
    message: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    onShowNotice('Thank you! Your feedback/inquiry has been recorded.');
    setFormData({ name: '', email: '', topic: 'Booking inquiry', message: '' });
  }

  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">SUPPORT & ASSISTANCE</span>
        <h1>Get in Touch with Sahayata</h1>
        <p>Have questions regarding household booking, helper onboarding, or project feedback?</p>
      </div>

      <form className="panel contact-form" onSubmit={handleSubmit}>
        <label>
          Your Full Name
          <input
            required
            placeholder="e.g. Anjali Gupta"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </label>

        <label>
          Email Address
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </label>

        <label>
          Inquiry Topic
          <select
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          >
            <option>Booking inquiry</option>
            <option>Helper verification request</option>
            <option>Attendance or payment clarification</option>
            <option>Project evaluation feedback</option>
          </select>
        </label>

        <label>
          Message
          <textarea
            required
            rows="4"
            placeholder="Write your query or message here..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </label>

        <button className="btn btn-primary" type="submit">
          Send Message →
        </button>
      </form>
    </section>
  );
}
