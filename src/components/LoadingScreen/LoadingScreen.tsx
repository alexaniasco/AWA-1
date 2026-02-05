import React, { useState, useEffect } from 'react'
import './LoadingScreen.css'

const LoadingScreen = ({ isVisible = true }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [shouldRender, setShouldRender] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setIsAnimatingOut(false)
      setShouldRender(true)
    } else {
      // Iniciar animación de salida
      setIsAnimatingOut(true)
      // Desmontar después de que termine la animación
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 1000) // Duración de la animación
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!shouldRender) return null

  return (
    <div className={`loading-screen ${isAnimatingOut ? 'blur-out' : ''}`}>
      <h1 className="loading-title">Apolo Web Agency</h1>
    </div>
  )
}

export default LoadingScreen
