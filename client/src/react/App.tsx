import React from 'react'
import './App.scss'
import socket from '../socket'
import Game from './Game'

function App () {
  socket.on('item', (name) => {

  })

  socket.on('correct', (gameOver) => {

  })

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-header-title'>NPM OR POKEMON?</h1>
      </header>
      <div className='App-content'>
        <Game />
      </div>
    </div>
  )
}

export default App
