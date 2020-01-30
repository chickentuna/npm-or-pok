import log from './webapp/log'
import { io } from './webapp/app'
import { getPokemon, getNpm } from './generator'
import shuffle from 'shuffle-array'

 enum Category {
  pokemon = 'pokemon',
  npm = 'npm'
}

 interface Session {
  socket: SocketIO.Socket
  name?: string
  quiz?: QuizItem[]
}

 interface QuizItem {
  name: string,
  category: Category
}

 interface Sessions {
  [id: string]: Session
}

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
      fill(pokemon, getPokemon)
      fill(npms, getNpm)

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

      const gameOver = session.quiz.length === 0
      if (guess === item.category) {
        socket.emit('correct', gameOver)
      } else {
        socket.emit('incorrect', gameOver)
      }
    })

    socket.on('next', (guess:string) => {
      const session = sessions[socket.id]
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
configureSocketServer(io)

function fill (list: string[], getter: () => string) {
  while (list.length < NAMES_PER_CATEGORY) {
    const name = getter()
    if (!list.includes(name)) {
      list.push(name)
    }
  }
}
