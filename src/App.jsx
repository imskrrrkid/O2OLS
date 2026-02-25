import './App.css';
import { useState, useRef, useEffect } from 'react';
import generatePassword from './utils/generatePassword';
import { sendBroadcastData, stopBroadcast, sendLocation } from './utils/firebaseAPI';

function App() {
  
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [time, setTime] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [broadcastId, setBroadcastId] = useState('');

  function handleGenerate() {
    const p = generatePassword();
    setPassword(p);
  }

  async function handleStartBroadcast() {
    setLoading(true);
    setError('');
    try {
      const result = await sendBroadcastData(username, password, time);
      console.log('Broadcast started:', result);
      setBroadcastId(result.broadcastId);
      // persist broadcast state so we can resume after reload
      try {
        localStorage.setItem('broadcastId', result.broadcastId);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('time', time);
      } catch (e) {
        console.warn('Could not write to localStorage', e);
      }
      alert(`Broadcast started! ID: ${result.broadcastId}`);
      // start sending location updates
      startLocationUpdates(result.broadcastId);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
      console.error('Broadcast error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStopBroadcast() {
    // Stop location updates first
    stopLocationUpdates();
    setLoading(true);
    setError('');
    try {
      await stopBroadcast(broadcastId);
      console.log('Broadcast stopped');
      alert('Broadcast stopped and deleted!');
      setBroadcastId('');
      try {
        localStorage.removeItem('broadcastId');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('time');
      } catch (e) {
        console.warn('Could not remove localStorage items', e);
      }
      // Reset form fields
      setUsername('');
      setPassword('');
      setTime('');
      setTermsChecked(false);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
      console.error('Stop error:', err);
    } finally {
      setLoading(false);
    }
  }

  // Location watch ref to allow clearing without re-renders
  const locationWatchIdRef = useRef(null);

  function stopLocationUpdates() {
    if (locationWatchIdRef.current != null) {
      try {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
      } catch (e) {
        console.warn('clearWatch failed', e);
      }
      locationWatchIdRef.current = null;
      console.log('Location updates stopped');
    }
  }

  function startLocationUpdates(bid) {
    // clear any existing
    stopLocationUpdates();

    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    const ACCURACY_THRESHOLD = 150; // meters
    const sendPos = pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = pos.coords.accuracy ?? null;

      if (accuracy && accuracy > ACCURACY_THRESHOLD) {
        // Accuracy is poor (likely IP-based or coarse). Warn user but still send data.
        setError(`Location accuracy is low (${Math.round(accuracy)} m). Use a phone with GPS or move to an open area.`);
      } else {
        // Clear previous accuracy warnings
        setError('');
      }

      sendLocation(bid, lat, lng, accuracy).catch(err => {
        console.error('sendLocation error:', err);
        setError(err.message || 'Failed to send location');
      });
    };

    const handleGeoError = err => {
      console.error('Geolocation error:', err);
      setError(err.message || 'Geolocation error');
      if (err.code === 1) { // PERMISSION_DENIED
        alert('Location permission denied. Location updates stopped (broadcast remains active).');
        // Stop location updates but keep broadcast active
        stopLocationUpdates();
      }
    };

    // Start watching position; watchPosition fires whenever position changes
    try {
      const id = navigator.geolocation.watchPosition(sendPos, handleGeoError, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
      locationWatchIdRef.current = id;
      console.log('Location watch started with id', id);
    } catch (e) {
      console.error('watchPosition failed', e);
      setError('Failed to start location watch');
    }
  }

  // Resume any active broadcast from localStorage on mount
  useEffect(() => {
    const savedBid = localStorage.getItem('broadcastId');
    if (savedBid) {
      const savedUser = localStorage.getItem('username') || '';
      const savedPass = localStorage.getItem('password') || '';
      const savedTime = localStorage.getItem('time') || '';
      setBroadcastId(savedBid);
      setUsername(savedUser);
      setPassword(savedPass);
      setTime(savedTime);
      // start sending locations again
      startLocationUpdates(savedBid);
    }

    return () => {
      stopLocationUpdates();
    };
  }, []);

  const isReady = username.trim().length > 0 && password.length > 0 && time.length > 0 && termsChecked === true;

  return (
    <div className="cont">
      <div className="t-space"></div>
      <div className="content">
        {/* <div className="logo">sadsa</div> */}
        <div className="form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={!!broadcastId}
          />
          <div className="hash">
            <input placeholder="Generate your Hash" readOnly value={password} disabled={!!broadcastId} />
            <button onClick={handleGenerate} disabled={!!broadcastId}>Generate</button>
          </div>

          <div className="timer">
            <p>SET TIME</p>
            <div className="timepick">
              <input type="time" value={time} onChange={e => setTime(e.target.value)} disabled={!!broadcastId} />
            </div>
          </div>

          <div className="termcond">
            <input type="checkbox" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} />
            <p>By using our service you agree to term and conditions</p>
          </div>
          <div className="broadcast">
            {!broadcastId ? (
              <>
                <button type="button" disabled={!isReady || loading} onClick={handleStartBroadcast}>
                  {loading ? 'Starting...' : 'Start Broadcasting'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              </>
            ) : (
              <>
                <p style={{ color: 'green', marginBottom: '10px' }}>Broadcasting... ID: {broadcastId}</p>
                <button type="button" style={{ backgroundColor: '#ff4444' }} disabled={loading} onClick={handleStopBroadcast}>
                  {loading ? 'Stopping...' : 'Stop Broadcasting'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              </>
            )}
          </div>
        </div>

      </div>
      <div className="b-space"></div>
    </div>
  );
}

export default App