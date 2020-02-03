export enum Category {
  POKEMON = 'pokemon',
  NPM = 'npm'
}

export interface Session {
  socket: SocketIO.Socket
  current: QuizItem
  mode: Mode

  loadNextItem: () => void
  handleGuess: (guess:string, correct: boolean) => void
  isGameOver: () => boolean
}

export interface PracticeSession extends Session {
  quiz: QuizItem[]
  mode: Mode.PRACTICE
  socket: SocketIO.Socket
}

export interface MarathonSession extends Session {
  name: string
  score: number
  lives: number
  socket: SocketIO.Socket
  mode: Mode.MARATHON
}

// export type Session = PracticeSession | MarathonSession

export interface QuizItem {
  name: string,
  category: Category
}

export enum Mode {
  PRACTICE = 'practice',
  MARATHON = 'marathon'
}

export interface StartEvent {
  name?: string,
  mode: Mode
}
