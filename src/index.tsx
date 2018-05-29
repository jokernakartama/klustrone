import { start as startSession } from '~/utils/session'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import { keys } from '~/constants'

// exclude some sessionStorage keys from crosstabs session
const excludedSessionKeys = [
  keys.SORT_SETTINGS,
  keys.VIEW_SETTINGS
]

startSession(excludedSessionKeys).then(
  function () {
    ReactDOM.render(
      <Provider store={ store }>
        <App />
      </Provider>,
      document.getElementById('app')
    )
  }
)
