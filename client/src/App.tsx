import React, { useState, useEffect } from 'react'
import './App.scss'
import socket from './socket'

function start () {
  console.log('emit')
  socket.emit('start')
}

function App () {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function init () {
      socket.on('item', (name) => {
        setItems([...items, { name }])
      })
    }
    init()
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-header-title'>NPM OR POKEMON?</h1>
      </header>
      <div className='App-content'>
        Hello
        <button onClick={start}>Start</button>
        {items.map(item => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    </div>
  )
}

export default App
