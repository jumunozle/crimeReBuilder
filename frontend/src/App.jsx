import React, { useState } from 'react'
import Scene from './components/Scene'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [version, setVersion] = useState(0) // Nueva versión para forzar recarga

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('http://localhost:8000/upload/', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      console.log(await res.json())
      setVersion(v => v + 1) 
      setReady(true)
    }

    setLoading(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Reconstruyendo escena 3D... espera ⏳</p>}
      {ready && <Scene version={version} />}
    </div>
  )
}
