import { useEffect, useRef, useState } from 'react';
import { FaviconAnimator } from 'favicon-animate';
import './App.css';

export function App() {
  const animatorRef = useRef(null);
  const [badgeNumber, setBadgeNumber] = useState(5);
  const [badgePosition, setBadgePosition] = useState('top-right');
  const [hasBadge, setHasBadge] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initialize animator
    animatorRef.current = new FaviconAnimator({
      favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="%23667eea" width="32" height="32"/></svg>',
      pauseOnHidden: true
    });

    // Set initial badge
    animatorRef.current.setBadge({
      number: badgeNumber,
      position: badgePosition,
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF'
    });

    // Track visibility
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      animatorRef.current?.destroy();
    };
  }, []);

  const handleBadgeNumberChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBadgeNumber(value);
    if (animatorRef.current && hasBadge) {
      animatorRef.current.updateBadge(value);
    }
  };

  const handlePositionChange = (position) => {
    setBadgePosition(position);
    const badge = animatorRef.current?.getBadge();
    if (badge && animatorRef.current && hasBadge) {
      badge.position = position;
      animatorRef.current.setBadge(badge);
    }
  };

  const handleToggleBadge = () => {
    if (hasBadge) {
      animatorRef.current?.removeBadge();
      setHasBadge(false);
    } else {
      animatorRef.current?.setBadge({
        number: badgeNumber,
        position: badgePosition,
        backgroundColor: '#FF0000',
        textColor: '#FFFFFF'
      });
      setHasBadge(true);
    }
  };

  const handleFaviconChange = (color) => {
    const colors = {
      blue: '%23667eea',
      red: '%23ff6b6b',
      green: '%2351cf66',
      purple: '%23a78bfa'
    };

    animatorRef.current?.setFavicon(
      `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="${colors[color]}" width="32" height="32"/></svg>`
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h1>favicon-animate</h1>
        <p className="subtitle">Dynamic favicon management with React</p>

        {/* Badge Section */}
        <div className="section">
          <h2 className="section-title">🎯 Badge Control</h2>

          <div className="input-group">
            <input
              type="number"
              value={badgeNumber}
              onChange={handleBadgeNumberChange}
              placeholder="Enter badge number"
              min="0"
              max="999"
            />
            <button
              className="btn btn-primary"
              onClick={handleToggleBadge}
            >
              {hasBadge ? 'Remove' : 'Add'} Badge
            </button>
          </div>

          <div className="button-group">
            <button
              className="btn btn-secondary"
              onClick={() => handlePositionChange('top-left')}
              disabled={!hasBadge}
            >
              Top Left
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handlePositionChange('top-right')}
              disabled={!hasBadge}
            >
              Top Right
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handlePositionChange('bottom-left')}
              disabled={!hasBadge}
            >
              Bottom Left
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handlePositionChange('bottom-right')}
              disabled={!hasBadge}
            >
              Bottom Right
            </button>
          </div>
        </div>

        {/* Favicon Section */}
        <div className="section">
          <h2 className="section-title">🎨 Favicon Control</h2>

          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={() => handleFaviconChange('blue')}
            >
              Blue
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFaviconChange('red')}
            >
              Red
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFaviconChange('green')}
            >
              Green
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFaviconChange('purple')}
            >
              Purple
            </button>
          </div>
        </div>

        {/* Status Section */}
        <div className="section">
          <h2 className="section-title">📊 Status</h2>

          <div className="status">
            <div className="status-item">
              <span className="status-label">Current Badge:</span>
              <span className="status-value">{hasBadge ? badgeNumber : 'None'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Badge Position:</span>
              <span className="status-value">{hasBadge ? badgePosition : '-'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Page Visible:</span>
              <span className="status-value">{isVisible ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
