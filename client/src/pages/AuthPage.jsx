import React, { useState } from 'react';

export default function AuthPage({ initialMode = 'login', services, onLogin, onRegister }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('Household');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    area: '',
    rate: 200,
    experience: 3,
    skills: ['House Cleaning']
  });

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSkillToggle(skillName) {
    setFormData((prev) => {
      const exists = prev.skills.includes(skillName);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skillName) : [...prev.skills, skillName]
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(formData.email, formData.password);
      } else {
        await onRegister({
          ...formData,
          role,
          rate: Number(formData.rate) || 200,
          experience: Number(formData.experience) || 1
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  // Pre-fills demo login credentials for evaluation convenience
  function fillDemoCredentials(demoEmail) {
    setMode('login');
    setFormData((prev) => ({
      ...prev,
      email: demoEmail,
      password: 'password123'
    }));
  }

  return (
    <section className="page-frame">
      <div className="auth-card panel">
        <div className="auth-logo">
          <span className="brand-mark">⌂</span>
          <strong>Sahayata</strong>
        </div>

        <div className="role-tabs">
          {['Household', 'Helper', 'Admin'].map((r) => (
            <button
              key={r}
              className={role === r ? 'active' : ''}
              onClick={() => {
                setRole(r);
                setError('');
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fff0f3', color: '#e22d53', padding: '10px 14px', borderRadius: '8px', fontSize: '11px', marginBottom: '14px', border: '1px solid #ffd5de' }}>
            {error}
          </div>
        )}

        {/* Quick Demo Credentials Bar */}
        <div style={{ background: '#f8f6f9', padding: '10px', borderRadius: '10px', marginBottom: '16px', fontSize: '11px' }}>
          <strong style={{ display: 'block', marginBottom: '6px', color: '#4d4a5b' }}>
            ⚡ Quick Demo Accounts (Password: password123):
          </strong>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline btn-small"
              style={{ padding: '4px 8px', fontSize: '10px' }}
              onClick={() => fillDemoCredentials('rahul@demo.com')}
            >
              Household (Rahul)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-small"
              style={{ padding: '4px 8px', fontSize: '10px' }}
              onClick={() => fillDemoCredentials('priya@demo.com')}
            >
              Helper (Priya)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-small"
              style={{ padding: '4px 8px', fontSize: '10px' }}
              onClick={() => fillDemoCredentials('admin@demo.com')}
            >
              Admin (System)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <>
              <label>
                Full Name
                <input
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </label>

              <label>
                Phone Number
                <input
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </label>
            </>
          )}

          <label>
            Email Address
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </label>

          {mode === 'register' && role === 'Household' && (
            <label>
              Household Address
              <input
                placeholder="House/Flat number, Locality, City"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
              />
            </label>
          )}

          {mode === 'register' && role === 'Helper' && (
            <>
              <label>
                Working Area / Locality
                <input
                  placeholder="e.g. Rohini, Pitampura, Delhi"
                  value={formData.area}
                  onChange={(e) => updateField('area', e.target.value)}
                />
              </label>

              <div className="form-row">
                <label>
                  Hourly Rate (₹)
                  <input
                    type="number"
                    min="100"
                    step="10"
                    value={formData.rate}
                    onChange={(e) => updateField('rate', e.target.value)}
                  />
                </label>

                <label>
                  Years of Experience
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.experience}
                    onChange={(e) => updateField('experience', e.target.value)}
                  />
                </label>
              </div>

              <label>
                Services You Offer
                <div className="checkbox-grid">
                  {services.map((s) => (
                    <label key={s.id} className="check-option">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(s.name)}
                        onChange={() => handleSkillToggle(s.name)}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              </label>
            </>
          )}

          <button className="btn btn-primary full" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? `Log in as ${role}` : `Create ${role} Account`} →
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? 'New to Sahayata?' : 'Already registered?'}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Create an account' : 'Log in here'}
          </button>
        </p>
      </div>
    </section>
  );
}
