import React, { useState } from 'react'
import Scene from './components/Scene/Scene'
import UploadSection from './components/UploadSection/UploadSection'
import Header from './components/Header/Header'
import StatusPanel from './components/StatusPanel/StatusPanel'
import IntroScreen from './components/IntroScreen/IntroScreen'
import './App.css'

export default function App() {
  const [showIntro, setShowIntro] = useState(true) // Nuevo estado para controlar la intro
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [version, setVersion] = useState(0)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [error, setError] = useState(null)

  const handleStartApp = () => {
    setShowIntro(false)
  }

  const handleUpload = async (file) => {
    if (!file) return

    setLoading(true)
    setError(null)

    // Crear preview de la imagen
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const result = await res.json()
        console.log(result)
        setVersion(v => v + 1)
        setReady(true)
      } else {
        throw new Error('Error en la reconstrucción')
      }
    } catch (err) {
      setError('Error al procesar la imagen. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setReady(false)
    setLoading(false)
    setError(null)
    setUploadedImage(null)
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage)
    }
  }

  // Si showIntro es true, mostrar solo la IntroScreen
  if (showIntro) {
    return <IntroScreen onStart={handleStartApp} />
  }

  return (
    <>
      {!ready ? (
        <>
          <Header />
          <UploadSection
            onUpload={handleUpload}
            loading={loading}
            error={error}
          />
        </>
      ) : (
        <>
          <Scene version={version} uploadedImage={uploadedImage} />
          <StatusPanel onReset={() => handleReset()} />
        </>
      )}
    </>
  )
}