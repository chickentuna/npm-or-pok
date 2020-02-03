import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import socket from '../socket'

interface Props {
}

interface State {
  leaderboard: any
}

export class Ranking extends Component<Props, State> {
handleLeaderboard: (any) => void

constructor (props: Props) {
  super(props)
  this.state = {
    leaderboard: []
  }

  socket.emit('leaderboard', () => {
  })

  this.handleLeaderboard = (leaderboard) => {
    this.setState({
      leaderboard: leaderboard
    })
    socket.off('leader')
  }

  socket.on('leaderboard', this.handleLeaderboard)
}

componentWillUnmount () {
  socket.off('leaderboard', this.handleLeaderboard)
}

render () {
  const { leaderboard } = this.state
  return (
    <>{leaderboard && leaderboard.map(rank => (
      <div key={rank.rank}>
        <span>{rank.name}</span>
          &nbsp;
        <span>{rank.score}</span>
      </div>
    ))}
      <Link to='/'>Home</Link>
    </>
  )
}
}
