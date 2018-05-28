import { serviceMap } from '~/api/'
import { keys } from '~/constants'
import { setKey, getKey } from '~/utils/session'

const initialState = {}
Object.keys(serviceMap).forEach((name) => {
  const saved = getKey(keys.BUFFER_PREFIX + name) || {}
  initialState[name] = Object.assign({
    id: null,
    path: null, // to use in queries
    copy: true // to use the right method
  }, saved)
})

export const BUFFER_UPDATE = 'buffer::update'

export function saveBuffer (id: string, path: string, service: string, copy: boolean): void {
  const data = {
    id,
    path,
    copy
  }
  setKey(keys.BUFFER_PREFIX + service, data)
}

export function updateBuffer (id: string, path: string, service: string, copy: boolean): IResourceBufferAction {
  return {
    type: BUFFER_UPDATE,
    meta: {
      crossTab: true
    },
    payload: {
      id,
      path,
      service,
      copy
    }
  }
}

export function copyResource (id: string, path: string, service: string) {
  return function (dispatch) {
    saveBuffer(id, path, service, true)
    dispatch(updateBuffer(id, path, service, true))
  }
}

export function cutResource (id: string, path: string, service: string) {
  return function (dispatch) {
    saveBuffer(id, path, service, true)
    dispatch(updateBuffer(id, path, service, false))
  }
}

const actionsMap = {
  [BUFFER_UPDATE]: (state, action) => {
    const buffer = Object.assign({}, state)
    buffer[action.payload.service] = {
      id: action.payload.id,
      path: action.payload.path,
      copy: action.payload.copy
    }
    return buffer
  }
}

export default function reducer (state = initialState, action: IResourceBufferAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
