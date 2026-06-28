import React, { useEffect, useState } from 'react';
import './Alert.css';

export default function Alert({ message, type = 'message', duration = 10000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // 300ms matches the CSS animation duration
  };

  if (!message) return null;

  return (
    <div className={`custom-alert custom-alert-${type} ${isExiting ? 'custom-alert-exit' : ''}`}>
      <div className="custom-alert-content">
        <span className="custom-alert-text">{message}</span>
        <button className="custom-alert-close" onClick={handleClose} aria-label="Close alert">&times;</button>
      </div>
      <div 
        className="custom-alert-progress" 
        style={{ animationDuration: `${duration}ms` }}
      ></div>
    </div>
  );
}
