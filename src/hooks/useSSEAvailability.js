import { useState, useEffect, useRef, useCallback } from 'react';
export function useSSEAvailability(debouncedValue, endpoint, minLength = 3) {
  const [status, setStatus]    = useState('idle');
  // idle | checking | available | taken | error
  const sourceRef              = useRef(null);
  const lastCheckedRef         = useRef('');

  const closeStream = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  useEffect(() => {
    const trimmed = debouncedValue.trim().toLowerCase();

    if (trimmed.length < minLength) {
      closeStream();
      setStatus('idle');
      return;
    }

    if (trimmed === lastCheckedRef.current && sourceRef.current) return;

    closeStream();
    lastCheckedRef.current = trimmed;

    setStatus('checking');

    const source = new EventSource(
      `http://localhost:3000${endpoint}/${encodeURIComponent(trimmed)}`
    );

    source.onmessage = (event) => {
      const { isTaken, error } = JSON.parse(event.data);
      if (error) { setStatus('error'); return; }
      setStatus(isTaken ? 'taken' : 'available');
    };

    source.onerror = () => {
      setStatus('error');
      closeStream();
    };

    sourceRef.current = source;

    return () => {
      closeStream();
      lastCheckedRef.current = '';
    };
  }, [debouncedValue, endpoint, minLength, closeStream]);

  return { status, setStatus, closeStream };
}