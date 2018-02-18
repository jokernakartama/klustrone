import { start as startSession } from '~/utils/session'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

// exclude some sessionStorage keys from crosstabs session
const excludedSessionKeys = [
  'sort'
]

startSession(excludedSessionKeys).then(
  function () {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('app')
    )
  }
)
