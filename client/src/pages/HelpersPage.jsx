import React, { useState } from 'react';
import HelperCard from '../components/HelperCard.jsx';

export default function HelpersPage({
  helpers,
  services,
  selectedServiceFilter,
  onSelectHelper,
  onNavigate
}) {
  const [serviceFilter, setServiceFilter] = useState(selectedServiceFilter || 'All Services');
  const [searchFilter, setSearchFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  // Filters helpers against active criteria: service skill, locality, and search term
  const filteredHelpers = helpers.filter((helper) => {
    const matchesService =
      serviceFilter === 'All Services' ||
      (Array.isArray(helper.skills) && helper.skills.includes(serviceFilter));

    const matchesArea =
      !areaFilter.trim() ||
      (helper.area || '').toLowerCase().includes(areaFilter.toLowerCase().trim());

    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (helper.name || '').toLowerCase().includes(q) ||
      (helper.area || '').toLowerCase().includes(q) ||
      (helper.skills || []).some((s) => s.toLowerCase().includes(q));

    return matchesService && matchesArea && matchesSearch;
  });

  function clearFilters() {
    setServiceFilter('All Services');
    setSearchFilter('');
    setAreaFilter('');
  }

  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">MEET YOUR HELPING HANDS</span>
        <h1>Find a Helper for Your Home</h1>
        <p>
          Browse through our verified helpers, check their ratings, experience, and service skills,
          or book directly.
        </p>
      </div>

      <div className="filter-bar">
        <label>
          Service Category
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option>All Services</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Locality / Area
          <input
            placeholder="e.g. Rohini, Pitampura"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          />
        </label>

        <label className="filter-search">
          Keyword Search
          <input
            placeholder="Search by helper name or skill"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </label>

        <button className="btn btn-outline" onClick={clearFilters}>
          Reset
        </button>
      </div>

      <div className="helper-grid">
        {filteredHelpers.map((helper) => (
          <HelperCard
            key={helper.id}
            helper={helper}
            onSelect={(h) => {
              onSelectHelper(h);
              onNavigate('profile');
            }}
            onBook={(h) => {
              onSelectHelper(h);
              onNavigate('booking');
            }}
          />
        ))}
      </div>

      {filteredHelpers.length === 0 && (
        <div className="empty-state">
          <span>⌕</span>
          <h3>No matching helpers found</h3>
          <p>Try widening your search terms or clearing your current filters.</p>
          <button className="btn btn-primary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
