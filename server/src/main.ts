import { createDB, saveGuess, getLeaderboard } from './db'
import { MarathonGame } from './MarathonGame'
import { PracticeGame } from './PracticeGame'
import { Mode, Session, StartEvent } from './types'
import { io } from './webapp/app'
import log from './webapp/log'

function configureSocketServer (io: SocketIO.Server) {
  io.on('connection', (socket: SocketIO.Socket) => {
    log.debug('user connected', { ip: socket.handshake.address })

    let session: Session = null

    socket.on('disconnect', () => {
      log.debug('user disconnected', socket.handshake.address)
    })

    socket.on('start', ({ mode, name }: StartEvent) => {
      if (mode === Mode.PRACTICE) {
        session = new PracticeGame(socket)
      } else if (mode === Mode.MARATHON) {
        if (name == null) { return }
        session = new MarathonGame(name, socket)
      }
      sendNextItem(session, socket)
    })

    socket.on('guess', (guess:string) => {
      if (session == null) { return }
      const item = session.current
      const correct = guess === item.category

      saveGuess(item.name, item.category, guess, socket.handshake.address)

      session.handleGuess(guess, correct)

      const gameOver = session.isGameOver()
      if (correct) {
        socket.emit('correct', gameOver)
      } else {
        socket.emit('incorrect', gameOver)
      }
      if (!gameOver) {
        sendNextItem(session, socket)
      }
    })

    socket.on('leaderboard', async () => {
      const leaderboard = await getLeaderboard()
      socket.emit('leaderboard', leaderboard)
    })
  })
}

function sendNextItem (session: Session, socket) {
  session.loadNextItem()
  socket.emit('item', session.current.name)
}

// Entry point

configureSocketServer(io)
createDB()
