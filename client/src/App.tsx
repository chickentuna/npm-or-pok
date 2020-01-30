import React, { useState, useEffect } from 'react'
import './App.scss'
import socket from './socket'

function start () {
  socket.emit('start')
}

function App () {
  const [items, setItems] = useState([])

  function addItem (item) {
    setItems([...items, { name }])
  }

  useEffect(() => {
    console.log('use effect called')
    socket.on('item', (item) => {
      addItem(item)
    })
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
