import React from 'react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast" role="status">
      <span>✓</span>
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}
