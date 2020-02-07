import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.scss'
import Game from './Game'
import { Ranking } from './Ranking'

function App () {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-header-title'>NPM OR POKEMON?</h1>
      </header>
      <div className='App-content'>
        <Router basename='/public/npm-or-pok'>
          {/* <Link to='/'>Home</Link> */}

          <div>
            <Switch>

              <Route path='leaderboard'>
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
