import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Importar el componente Admin
import AdminPanel from './Admin.jsx'

// Verificar que el DOM esté listo
const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AdminPanel />
    </React.StrictMode>
  )
} else {
  console.error('❌ No se encontró el elemento root')
}