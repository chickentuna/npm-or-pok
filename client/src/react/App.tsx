import React from 'react'
import './App.scss'
import socket from '../socket'
import Game from './Game'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { Ranking } from './Ranking'

function App () {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-header-title'>NPM OR POKEMON?</h1>
      </header>
      <div className='App-content'>
        <Router basename='/npm-or-pok'>
          {/* <Link to='/'>Home</Link> */}

          <div>
            <Switch>

              <Route path='/leaderboard'>
                <Ranking />
              </Route>
              <Route path='/'>
                <Game />
              </Route>
            </Switch>
          </div>
        </Router>

      </div>
    </div>
  )
}

export default App
