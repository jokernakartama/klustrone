import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import Main from './components/Main'
import TokenReciever from './components/TokenReciever'
import { history } from './utils/history'

const App: React.SFC = () => {
  return (
    <Router basename='/' history={ history }>
      <Switch>
        <Route exact={ true } path='/token'>
          <TokenReciever />
        </Route>
        <Route path='/*'>
          <Main />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
