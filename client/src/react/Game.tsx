import React, { Component } from 'react'
import socket from '../socket'
import { BumpButton } from './BumpButton'
import './Game.scss'

import { Link } from 'react-router-dom'

enum Phase {
  INTRO = 'intro',
  STARTED = 'started',
  END = 'end'
}

enum Mode {
  PRACTICE = 'practice',
  MARATHON = 'marathon'
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
  counter: number,
  name: string,
  mode: Mode,
  lives: number
}

class Game extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      items: [],
      name: null,
      phase: Phase.INTRO,
      current: null,
      counter: 0,
      mode: null,
      lives: 3
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

  startPractice () {
    this.setState({
      items: [],
      phase: Phase.STARTED,
      current: null,
      counter: 0,
      mode: Mode.PRACTICE
    })

    socket.emit('start', { mode: Mode.PRACTICE })
  }

  startMarathon () {
    const name = this.state.name == null ? prompt('Please enter your name') : this.state.name
    this.setState({
      items: [],
      phase: Phase.STARTED,
      current: null,
      lives: 3,
      counter: 0,
      name,
      mode: Mode.MARATHON
    })
    socket.emit('start', { mode: Mode.MARATHON, name })
  }

  guess (category) {
    if (this.state.current.guess == null) {
      this.setState({ current: { ...this.state.current, guess: category } })
      socket.emit('guess', category)
    }
  }

  reset () {
    this.setState({
      items: [],
      name: null,
      phase: Phase.INTRO,
      current: null,
      mode: null
    })
  }

  componentWillUnmount () {
    socket.off('item')
    socket.off('correct')
    socket.off('incorrect')
  }

  render () {
    const { phase, current, items, mode } = this.state
    return (

      <div className='game'>
        {phase === Phase.INTRO && (
          <>
            <h3>Guess whether the name is a npm package or a pokemon</h3>
            <h4>Not all pokemon names are in English!</h4>
            <div className='start'>

              <div className='button-container'>
                <BumpButton color='black' handleClick={() => this.startPractice()}>Practice</BumpButton>
              </div>
              <div className='button-container'>
                <BumpButton color='black' handleClick={() => this.startMarathon()}>Start</BumpButton>
              </div>
            </div>
          </>
        )}

        {current && (
          <div className='current'>
            <div className='current-name-container'>
              {mode === Mode.PRACTICE && (
                <div className='current-counter bigger'>{this.state.counter}/10</div>
              )}
              {mode === Mode.MARATHON && (
                <div className='current-counter'>n°{this.state.counter}</div>
              )}

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
        <div className='items-wrapper'>
          <div className={`items ${items.length > 10 ? 'multi' : ''}`}>
            {items.map(item => (
              <div key={item.name} className={`item ${item.correct ? 'correct' : 'incorrect'}`}>
                <div className='item-emoji'>{item.correct ? '✔️' : '❌'}</div>
                <div className='item-name'>{item.name}</div>
                <div className='item-category'>{item.category}</div>
              </div>
            ))}
          </div>
        </div>

        {phase === Phase.END && (
          <>
            <div className='score'>
              <h3><span>You have scored </span>
                {mode === Mode.PRACTICE && <span>{items.reduce((a, b) => a + (b.correct ? 1 : 0), 0)}/10</span>}
                {mode === Mode.MARATHON && <span>{items.reduce((a, b) => a + (b.correct ? 1 : 0), 0)} points</span>}
              </h3>
            </div>

            {mode === Mode.PRACTICE && (
              <div className='restart'>
                <div className='button-container'>
                  <BumpButton color='black' handleClick={() => this.startPractice()}>Restart</BumpButton>
                </div>
                <div className='button-container'>
                  <BumpButton color='black' handleClick={() => this.reset()}>Home</BumpButton>
                </div>
              </div>
            )}
            {mode === Mode.MARATHON && (
              <div className='restart'>

                <div className='button-container'>
                  <BumpButton color='black' handleClick={() => this.startMarathon()}>Retry</BumpButton>
                </div>
                <div className='button-container'>
                  <BumpButton color='black' handleClick={() => this.reset()}>Home</BumpButton>
                </div>
              </div>
            )}
          </>
        )}
        {phase !== Phase.STARTED && (
          <div className='leaderboard-link'>
            <Link to='/leaderboard'>Leaderboard</Link>
          </div>
        )}
      </div>
    )
  }
}

export default Game
