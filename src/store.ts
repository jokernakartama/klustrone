import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import crossTabMiddleware from 'cross-tab-middleware'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { serviceMap } from '~/api'

import modal from '~/ducks/modal'
import activeState from '~/ducks/activeState'
import serviceList from '~/ducks/serviceList'
import resourceList from '~/ducks/resourceList'
import resourceDirectory from '~/ducks/resourceDirectory'
import resourceSelected from '~/ducks/resourceSelected'
import loading from '~/ducks/loading'
import sort from '~/ducks/sort'
import view from '~/ducks/view'
import buffer from '~/ducks/resourceBuffer'

const composeEnhancers = composeWithDevTools({}) || compose

const rootReducer = combineReducers({
  resources: combineReducers({
    list: resourceList,
    dir: resourceDirectory,
    selected: resourceSelected,
  }),
  services: serviceList,
  active: activeState,
  buffer,
  sort,
  view,
  modal,
  loading
})

function getAPI (getState: () => any) {
  const state = getState()
  return serviceMap[state.active.service]
}

export function configureStore (initialState?: object) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunk.withExtraArgument(getAPI),
        // v5 UUID
        crossTabMiddleware('ca5b664c-780a-5a86-9f75-b4a664b85d40')
      )
    )
  )
}

const store = configureStore()

export function dispatch (action) {
  store.dispatch(action)
}

export default store
