import React, { useState, useEffect } from 'react'
import './App.scss'
import socket from './socket'

enum State {
  INTRO = 'intro',
  STARTED = 'started'
}

function App () {
  const [items, setItems] = useState([])
  const [state, setState] = useState(State.INTRO)

  useEffect(() => {
    console.log('use effect called')
    socket.on('item', (name) => {
      setItems(items => [...items, { name }])
    })
  }, [])

  function start () {
    socket.emit('start')
    setState(State.STARTED)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-header-title'>NPM OR POKEMON?</h1>
      </header>
      <div className='App-content'>
        {state === State.INTRO && (
          <button onClick={start}>Start</button>
        )}
        {items.map(item => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    </div>
  )
}

export default App
