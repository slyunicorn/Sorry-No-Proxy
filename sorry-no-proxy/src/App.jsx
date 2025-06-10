import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import "./App.css"
const imageCount = 5;
const images = Array.from({ length: imageCount }, (_, i) => `/images/${i + 1}.jpg`);
const interval = 500; // 2 images/sec

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);

  const timerRef = useRef(null);
  const imageIntervalRef = useRef(null);
  const qrTimeoutRef = useRef(null);

  const stopAll = () => { // Ensure clean Re-starts
    clearInterval(timerRef.current);
    clearInterval(imageIntervalRef.current);
    clearTimeout(qrTimeoutRef.current);
    setRunning(false);
    setShowQR(false);
  };

  const startSequence = () => {
    stopAll();

    setRunning(true);
    setElapsedTime(0);
    setCurrentIndex(0);

    //cycle images
    imageIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    //stopwatch
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= 20) stopAll();
        return newTime;
      });
    }, 1000);

    //between 5s and 15s
    const qrDelay = Math.floor(Math.random() * 10000) + 5000;
    qrTimeoutRef.current = setTimeout(() => {
      setShowQR(true);
      setTimeout(() => setShowQR(false), 500); 
    }, qrDelay);
  };

  useEffect(() => {
    return stopAll; // Cleanup on Unmount
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>QR Code</h2>

      {showQR ? (
        <QRCodeSVG value="date-cypher" size={256} includeMargin={true} />
      ) : (
        <img
          src={images[currentIndex]}
          alt="cycling"
          style={{
            width: '300px',
            height: '300px',
            objectFit: 'cover',
            border: '8px solid white',
            borderRadius: '8px',
          }}
        />
      )}

      <div style={{ marginTop: '20px', fontSize: '1.5rem' }}>
        Elapsed Time: {elapsedTime}s
      </div>

      <div style={{ marginTop: '20px' }}>
        {running ? (
          <button
            onClick={startSequence}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
             Reset Now
          </button>
        ) : (
          <button
            onClick={startSequence}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            ▶️ Start Again
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
