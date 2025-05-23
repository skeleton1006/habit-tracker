import { useState } from 'react'

function App() {
  const [message, setMessage] = useState('')

  const fetchHello = async () => {
    try {
      const response = await fetch('http://localhost:8080/hello')
      const text = await response.text()
      setMessage(text)
    } catch (error) {
      setMessage('API呼び出しに失敗しました')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>習慣トラッカー：フロントテスト</h1>
      <button onClick={fetchHello}>Say Hello</button>
      <p>{message}</p>
    </div>
  )
}

export default App
