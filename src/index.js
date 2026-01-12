import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Workaround: suppress noisy ResizeObserver loop error seen in some browsers
// This guards calls to the native observe() to avoid uncaught exceptions
if (typeof window !== 'undefined' && typeof window.ResizeObserver !== 'undefined') {
  const RO = window.ResizeObserver;
  const originalObserve = RO.prototype.observe;
  RO.prototype.observe = function () {
    try {
      return originalObserve.apply(this, arguments);
    } catch (e) {
      // swallow ResizeObserver loop errors which are non-actionable in many cases
      return undefined;
    }
  };

  // Also ignore the specific runtime error message so it doesn't surface to the dev overlay
  window.addEventListener('error', (event) => {
    if (event && event.message && event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
