import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { GameProvider } from './context/GameContext.jsx'
import { AudioProvider } from './context/AudioContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <GameProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </GameProvider>
    </HashRouter>
  </React.StrictMode>
)
