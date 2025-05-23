import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // ✅ これが重要！
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
