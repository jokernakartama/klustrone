import './embed.styl'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { start as startSession } from '~/utils/session'
import { CloudAPI } from '~/api'
import App from './App'
import store from './store'
import { keys, routes } from '~/constants'

// exclude some sessionStorage keys from crosstabs session
const excludedSessionKeys = [
  keys.SORT_SETTINGS,
  keys.VIEW_SETTINGS
]
if (window.location.pathname === routes.AUTH && !/error=([^&]+)/.exec(window.document.location.hash)) {
  CloudAPI.postCode()
} else {
  startSession(excludedSessionKeys).then(() => {
      ReactDOM.render(
        <Provider store={ store }>
          <App />
        </Provider>,
        document.getElementById('app')
      )
    }
  )
}
