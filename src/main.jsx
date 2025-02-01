import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import UploadVideo from './components/UploadVideo .jsx'
import Inicio from './components/Inicio.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Inicio/>
  </StrictMode>,
)
