import log from './webapp/log'
import { io } from './webapp/app'
import { getPokemon, getNpm } from './generator'
import shuffle from 'shuffle-array'
import { Sessions, QuizItem, Category } from './types'
import { createDB, saveGuess } from './db'

const NAMES_PER_CATEGORY = 5

const sessions:Sessions = {
}

function configureSocketServer (io: SocketIO.Server) {
  io.on('connection', (socket: SocketIO.Socket) => {
    log.debug('user connected', { ip: socket.handshake.address })
    sessions[socket.id] = {
      socket
    }

    socket.on('disconnect', () => {
      log.debug('user disconnected', socket.handshake.address)
      delete sessions[socket.id]
    })

    socket.on('start', (name:string) => {
      sessions[socket.id].name = name
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
          category: Category.pokemon
        })),
        ...npms.map(name => ({
          name,
          category: Category.npm
        }))
      ]

      shuffle(quiz)

      sessions[socket.id].name = name
      sessions[socket.id].quiz = quiz

      sendNextItem(socket)
    })

    socket.on('guess', (guess:string) => {
      const session = sessions[socket.id]
      const item = session.quiz[0]

      session.quiz.shift()

      const correct = guess === item.category
      const gameOver = session.quiz.length === 0
      if (correct) {
        socket.emit('correct', gameOver)
      } else {
        socket.emit('incorrect', gameOver)
      }
      saveGuess(item.name, item.category, correct, socket.handshake.address)
      sendNextItem(socket)
    })
  })
}

function sendNextItem (socket: SocketIO.Socket) {
  const session = sessions[socket.id]
  if (session.quiz.length > 0) {
    const next = session.quiz[0]
    socket.emit('item', next.name)
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

// Entry point

configureSocketServer(io)
createDB()
