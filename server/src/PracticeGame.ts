import shuffle from 'shuffle-array'
import { getNpm, getPokemon } from './generator'
import { Category, Mode, PracticeSession, QuizItem } from './types'

const NAMES_PER_CATEGORY = 5

export class PracticeGame implements PracticeSession {
  quiz: QuizItem[]
  mode: Mode.PRACTICE
  socket: SocketIO.Socket

  get current () {
    return this.quiz[0]
  }

  constructor (socket) {
    const pokemon:string[] = []
    const npms:string[] = []
    const offset = Math.floor(Math.random() * 4) - 2
    const pokAmount = NAMES_PER_CATEGORY + offset
    const npmAmount = NAMES_PER_CATEGORY - offset

    fill(pokemon, getPokemon, pokAmount)
    fill(npms, getNpm, npmAmount)

    const quiz:QuizItem[] = [
      ...pokemon.map(name => ({
        name,
        category: Category.POKEMON
      })),
      ...npms.map(name => ({
        name,
        category: Category.NPM
      }))
    ]

    shuffle(quiz)
    this.quiz = quiz
    this.mode = Mode.PRACTICE
    this.socket = socket
  }

  loadNextItem () {
    // Nothing to do
  }

  handleGuess (guess, correct) {
    this.quiz.shift()
  }

  isGameOver () {
    return this.quiz.length === 0
  }
}

function fill (list: string[], getter: () => string, amount: number) {
  while (list.length < amount) {
    const name = getter()
    if (!list.includes(name)) {
      list.push(name)
    }
  }
}
