function useUsernameAvailability(debouncedUsername) {
  const [status, setStatus] = useState('idle');
  const sourceRef           = useRef(null);
  const lastUsernameRef     = useRef('');

  const closeStream = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  useEffect(() => {
    const trimmed = debouncedUsername.trim().toLowerCase();

    if (trimmed.length < 3) {
      closeStream();
      setStatus('idle');
      return;
    }

    if (trimmed === lastUsernameRef.current && sourceRef.current) return;

    closeStream();
    lastUsernameRef.current = trimmed;
    setStatus('checking');

    const source = new EventSource(
      `http://localhost:3000/stream/username/${encodeURIComponent(trimmed)}`
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
      lastUsernameRef.current = '';
    };
  }, [debouncedUsername, closeStream]);

  // Expose closeStream so Signup can call it on submit
  return { status, setStatus, closeStream };
}