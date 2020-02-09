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
            <table className='items'>
              <tbody>
                <tr key={0} className='item'>
                  <th className='item-col item-rank'>
                    <div className='item-col-content'>
                    #
                    </div>
                  </th>
                  <th className='item-col item-name'>
                    <div className='item-col-content'>
                    Name
                    </div>
                  </th>
                  <th className='item-col item-score'>
                    <div className='item-col-content'>
                    Score
                    </div>
                  </th>
                </tr>
                {leaderboard && leaderboard.map(item => (
                  <tr key={item.rank} className='item'>
                    <td className='item-col item-rank'>
                      <div className='item-col-content'>
                        {item.rank}
                      </div>
                    </td>
                    <td className='item-col item-name'>
                      <div className='item-col-content'>
                        {item.name}
                      </div>
                    </td>
                    <td className='item-col item-score'>
                      <div className='item-col-content'>
                        {item.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='home-link'>
          <Link to='/'>Home</Link>
        </div>
      </div>
    )
  }
}
