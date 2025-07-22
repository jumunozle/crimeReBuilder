import React from 'react'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="7.5,10.5 12,15.5 16.5,10.5"/>
            </svg>
          </div>
          <div className="header-text">
            <h1>CrimeReBuilder</h1>
            <p>Reconstrucción 3D desde Imágenes</p>
          </div>
        </div>
        
        
      </div>
    </header>
  )
}