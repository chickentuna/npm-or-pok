import { MarathonSession, QuizItem, Mode, Category } from './types'
import { getPokemon, getNpm } from './generator'
import { saveMarathonResult, getLeaderboard } from './db'

const MARATHON_LIVES = 3

export class MarathonGame implements MarathonSession {
  name: string
  score: number
  lives: number
  current: QuizItem
  socket: SocketIO.Socket
  mode: Mode.MARATHON

  constructor (name: string, socket:SocketIO.Socket) {
    name = name.trim()
    if (name.length > 64) {
      name = name.slice(0, 64)
    }
    this.socket = socket
    this.name = name || 'Anonymous'
    this.score = 0
    this.lives = MARATHON_LIVES
    this.current = null
    this.mode = Mode.MARATHON
  }

  loadNextItem () {
    if (this.lives <= 0) {
      return
    }

    let nextItem: QuizItem
    if (coinFlip()) {
      nextItem = {
        name: getPokemon(),
        category: Category.POKEMON
      }
    } else {
      nextItem = {
        name: getNpm(),
        category: Category.NPM
      }
    }

    this.current = nextItem
  }

  handleGuess (guess: string, correct: boolean) {
    if (correct) {
      this.score++
    } else {
      this.lives--
    }

    this.current = null

    if (this.isGameOver()) {
      saveMarathonResult(this.name, this.score, this.socket.handshake.address).then(() => {
        getLeaderboard().then((leaderboard) => {
          this.socket.broadcast.emit('leaderboard', leaderboard)
        })
      })
    }
  }

  isGameOver () {
    return this.lives <= 0
  }
}

function coinFlip () {
  return Math.random() < 0.5
}
