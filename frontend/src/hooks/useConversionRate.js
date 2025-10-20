import { useState } from 'react';
import * as Sentry from "@sentry/react";

function useConversionRate() {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateRate = async (conversions, visitors) => {
    setError(null);
    setRate(null);

    // BUGGY VALIDATION: This checks < 0 instead of <= 0
    // This allows zero values to pass validation, causing division-by-zero errors
    if (conversions < 0 || visitors < 0) {
      setError('Conversions and visitors must be positive numbers');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/calculate-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversions, visitors }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate conversion rate');
      }

      setRate(data.rate);
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);

      // Report error to Sentry with context
      Sentry.captureException(err, {
        tags: {
          feature: 'conversion-calculator',
        },
        extra: {
          conversions,
          visitors,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { rate, error, isLoading, calculateRate };
}

export default useConversionRate;
