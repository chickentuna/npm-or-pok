import React, { Component } from 'react'
import socket from '../socket'
import './Game.scss'
import { BumpButton } from './BumpButton'

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
  correct?: boolean,
  category?: string
}

interface State {
  items: Item[]
  phase: Phase
  current: Item,
  counter: number
}

class Game extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      items: [],
      phase: Phase.INTRO,
      current: null,
      counter: 0
    }
    socket.on('item', (name) => {
      this.setState({
        current: { name },
        counter: this.state.counter + 1
      })
    })
    socket.on('correct', (gameOver) => {
      this.validateGuess(true, gameOver)
    })
    socket.on('incorrect', (gameOver) => {
      this.validateGuess(false, gameOver)
    })
  }

  validateGuess (correct, gameOver) {
    const category = (this.state.current.guess === 'pokemon' && correct) || (this.state.current.guess === 'npm' && !correct) ? 'pokemon' : 'npm'

    const item = {
      ...this.state.current,
      correct,
      category
    }
    this.setState({
      items: [...this.state.items, item],
      phase: gameOver ? Phase.END : this.state.phase
    })
  }

  start () {
    this.setState(this.state = {
      items: [],
      phase: Phase.STARTED,
      current: null,
      counter: 0
    })
    socket.emit('start')
  }

  guess (category) {
    if (this.state.current.guess == null) {
      this.setState({ current: { ...this.state.current, guess: category } })
      socket.emit('guess', category)
    }
  }

  render () {
    const { phase, current, items } = this.state
    return (

      <div className='game'>
        {phase === Phase.INTRO && (
          <>
            <h3>Guess whether the name is a npm package or a pokemon</h3>
            <h4>Not all pokemon names are in English!</h4>
            <div className='start'>

              <BumpButton color='black' handleClick={() => this.start()}>Start</BumpButton>
            </div>
          </>
        )}

        {current && (
          <div className='current'>
            <div className='current-name-container'>
              <div className='current-counter'>{this.state.counter}/10</div>
              <span className='current-name'>{current.name}</span>
            </div>

            <div className='current-buttons-wrapper'>
              <div className='current-buttons'>
                <BumpButton color='red' disabled={phase === Phase.END} handleClick={() => this.guess('npm')}>NPM lib</BumpButton>
                <BumpButton color='blue' disabled={phase === Phase.END} handleClick={() => this.guess('pokemon')}>Pokemon</BumpButton>
              </div>
            </div>

          </div>
        )}
        <div className='items'>
          {items.map(item => (
            <div key={item.name} className={`item ${item.correct ? 'correct' : 'incorrect'}`}>
              <div className='item-emoji'>{item.correct ? '✔️' : '❌'}</div>
              <div className='item-name'>{item.name}</div>
              <div className='item-category'>{item.category}</div>
            </div>
          ))}
        </div>

        {phase === Phase.END && (
          <>
            <div className='score'>
              <h3>You have scored {items.reduce((a, b) => a + (b.correct ? 1 : 0), 0)}/10
              </h3>
            </div>

            <div className='restart'>
              <BumpButton color='black' handleClick={() => this.start()}>Restart</BumpButton>
            </div>
          </>
        )}

      </div>
    )
  }
}

export default Game
