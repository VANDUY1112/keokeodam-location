import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Enable iOS Safari active touch state & smooth animations
if (typeof window !== 'undefined') {
  document.addEventListener('touchstart', () => {}, { passive: true });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
