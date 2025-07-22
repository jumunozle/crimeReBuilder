import React from 'react'
import './StatusPanel.css'

export default function StatusPanel({ uploadedImage, onReset, onNewUpload }) {
  return (
    <div className="status-panel">
      <div className="panel-header">
        <h3>Estado del Modelo</h3>
        <div className="status-indicator">
          <div className="status-dot success"></div>
          <span>Completado</span>
        </div>
      </div>

      <div className="panel-content">
        {uploadedImage && (
          <div className="image-info">
            <h4>Imagen Original</h4>
            <div className="thumbnail-container">
              <img src={uploadedImage} alt="Imagen original" className="thumbnail" />
            </div>
          </div>
        )}

        <div className="model-stats">
          <h4>Información del Modelo</h4>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Estado</span>
              <span className="stat-value success">Reconstruido</span>
            </div>
            <div className="stat">
              <span className="stat-label">Calidad</span>
              <span className="stat-value">Alta</span>
            </div>
            <div className="stat">
              <span className="stat-label">Tipo</span>
              <span className="stat-value">Modelo 3D</span>
            </div>
          </div>
        </div>

        <div className="controls-section">
          <h4>Controles</h4>
          <div className="control-info">
            <div className="control-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Click y arrastra para rotar</span>
            </div>
            <div className="control-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <span>Rueda del mouse para zoom</span>
            </div>
            <div className="control-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
              </svg>
              <span>Click derecho para mover</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-actions">
        <button className="action-button secondary" onClick={onReset}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="1 4 1 10 7 10"/>
            <polyline points="23 20 23 14 17 14"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Reiniciar
        </button>
        
        <button className="action-button primary" onClick={onNewUpload}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Nueva Imagen
        </button>
      </div>
    </div>
  )
}