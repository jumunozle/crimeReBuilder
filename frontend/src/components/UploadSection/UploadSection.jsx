import React, { useRef, useState } from 'react'
import './UploadSection.css'

export default function UploadSection({ onUpload, loading, error, uploadedImage }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      onUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="upload-section">
      <div className="upload-content">
        <h2>Reconstrucción 3D desde Imagen</h2>
        <p className="upload-description">
          Sube una imagen para crear una reconstrucción 3D automática
        </p>

        <div 
          className={`upload-zone ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!loading ? handleClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {loading ? (
            <div className="upload-loading">
              <div className="spinner"></div>
              <p>Procesando imagen...</p>
            </div>
          ) : uploadedImage ? (
            <div className="upload-preview">
              <img src={uploadedImage} alt="Imagen subida" className="preview-image" />
              <p>Imagen cargada correctamente</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
              <h3>Arrastra una imagen aquí</h3>
              <p>o haz clic para seleccionar</p>
              <div className="upload-formats">
                <span>JPG, PNG, WEBP</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="upload-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="upload-features">
          <div className="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>Procesamiento rápido</span>
          </div>
          <div className="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Alta calidad</span>
          </div>
          <div className="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="7.5,10.5 12,15.5 16.5,10.5"/>
            </svg>
            <span>Modelo 3D interactivo</span>
          </div>
        </div>
      </div>
    </div>
  )
}