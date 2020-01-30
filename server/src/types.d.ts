export enum Category {
  pokemon = 'pokemon',
  npm = 'npm'
}

export interface Session {
  socket: SocketIO.Socket
  name?: string
  quiz?: QuizItem[]
}

export interface QuizItem {
  name: string,
  category: Category
}

export interface Sessions {
  [id: string]: Session
}
