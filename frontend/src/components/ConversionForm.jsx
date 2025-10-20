import React, { useState } from 'react';
import useConversionRate from '../hooks/useConversionRate';
import './ConversionForm.css';

function ConversionForm() {
  const [conversions, setConversions] = useState('');
  const [visitors, setVisitors] = useState('');
  const { rate, error, isLoading, calculateRate } = useConversionRate();

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRate(Number(conversions), Number(visitors));
  };

  return (
    <form className="conversion-form" onSubmit={handleSubmit} aria-label="Conversion rate calculator form">
      <div className="form-group">
        <label htmlFor="conversions">
          Conversions
        </label>
        <input
          id="conversions"
          type="number"
          value={conversions}
          onChange={(e) => setConversions(Number(e.target.value))}
          placeholder="Enter number of conversions"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="visitors">
          Visitors
        </label>
        <input
          id="visitors"
          type="number"
          value={visitors}
          onChange={(e) => setVisitors(Number(e.target.value))}
          placeholder="Enter number of visitors"
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="submit-button"
      >
        {isLoading ? 'Calculating...' : 'Calculate Rate'}
      </button>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {rate !== null && !error && (
        <div className="result-message">
          Conversion Rate: {rate}%
        </div>
      )}
    </form>
  );
}

export default ConversionForm;
