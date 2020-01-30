import React, { Component } from 'react'
import socket from '../socket'
import './Game.scss'

enum Phase {
  INTRO = 'intro',
  STARTED = 'started',
  END = 'end'
}

interface Props {

}

interface Item {
  name: string
  guess?: 'pokemon' | 'npm'
  correct?: boolean
}

interface State {
  items: Item[]
  phase: Phase
  current: Item
}

class Game extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      items: [],
      phase: Phase.INTRO,
      current: null
    }
    socket.on('item', (name) => {
      this.setState({ current: { name } })
    })
    socket.on('correct', (gameOver) => {
      this.validateGuess(true, gameOver)
    })
    socket.on('incorrect', (gameOver) => {
      this.validateGuess(false, gameOver)
    })
  }

  validateGuess (correct, gameOver) {
    const item = {
      ...this.state.current,
      correct
    }
    this.setState({
      items: [...this.state.items, item],
      current: null,
      phase: gameOver ? Phase.END : this.state.phase
    })
  }

  start () {
    this.setState({ phase: Phase.STARTED })
    socket.emit('start')
  }

  guess (category) {
    this.setState({ current: { ...this.state.current, guess: category } })
    socket.emit('guess', category)
  }

  render () {
    const { phase, current, items } = this.state
    return (

      <div>
        {phase === Phase.INTRO && (
          <button onClick={() => this.start()}>Start</button>
        )}

        {current && (
          <div className='current'>
            <div className='current-name'>
              {current.name}
            </div>
            {current.guess == null && (
              <div className='current-buttons'>
                <button onClick={() => this.guess('npm')}>NPM lib</button>
                <button onClick={() => this.guess('pokemon')}>Pokemon</button>
              </div>
            )}
          </div>
        )}

        {items.map(item => (
          <div key={item.name} className={`item ${item.correct ? 'correct' : 'incorrect'}`}>
            {item.name}
          </div>
        ))}

        {phase === Phase.END && (
          <div>End</div>
        )}

      </div>
    )
  }
}

export default Game
