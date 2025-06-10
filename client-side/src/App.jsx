import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import "./App.css"
export default function App() {
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [decodedResults, setDecodedResults] = useState([]);
  const [treasureFound, setTreasureFound] = useState(false);
  const lastScanTime = useRef(0);

  const SECRET_CODE = 'date-cypher'; //key

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    };

    let stopStream = null;

    codeReader.current.decodeFromConstraints(
      { video: constraints.video },
      videoRef.current,
      (result, error, controls) => {
        if (result) {
          const now = Date.now();
          if (now - lastScanTime.current > 300) {
            const text = result.getText().trim();
            setDecodedResults((prev) => [...prev, text]);

            if (text === SECRET_CODE) {
              setTreasureFound(true);
            }

            lastScanTime.current = now;
          }
        }
        stopStream = controls.stop;
      }
    );

    return () => {
      if (stopStream) stopStream();
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>QR Scanner with History</h2>
      <video ref={videoRef} muted playsInline style={{ width: 320, height: 240, border: '1px solid black' }} />

      <h3>Decoded QR Codes:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {decodedResults.map((text, index) => (
          <li key={index} style={{ marginBottom: '0.5em', background: '#616161', padding: '0.5em', borderRadius: '5px' }}>
            {text}
          </li>
        ))}
      </ul>

      {treasureFound && (
        <div style={{ marginTop: '2em', padding: '1em', background: 'gold', fontWeight: 'bold', borderRadius: '10px' }}>
          Treasure Found! //treaseure
        </div>
      )}
    </div>
  );
}

