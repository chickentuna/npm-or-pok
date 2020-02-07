import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import socket from '../socket'
import './Ranking.scss'

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
      <div className='ranking'>
        <div className='leaderboard'>
          <div className='items-wrapper'>
            <div className='items'>

              <div key={0} className='item'>
                <div className='item-col item-rank'>
                  <div className='item-col-content'>
                    #
                  </div>
                </div>
                <div className='item-col item-name'>
                  <div className='item-col-content'>
                    Name
                  </div>
                </div>
                <div className='item-col item-score'>
                  <div className='item-col-content'>
                    Score
                  </div>
                </div>
              </div>

              {leaderboard && leaderboard.map(item => (
                <div key={item.rank} className='item'>
                  <div className='item-col item-rank'>
                    <div className='item-col-content'>
                      {item.rank}
                    </div>
                  </div>
                  <div className='item-col item-name'>
                    <div className='item-col-content'>
                      {item.name}
                    </div>
                  </div>
                  <div className='item-col item-score'>
                    <div className='item-col-content'>
                      {item.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='home-link'>
          <Link to='/'>Home</Link>
        </div>
      </div>
    )
  }
}
