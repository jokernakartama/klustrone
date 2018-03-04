// import { setKey, getKey } from '~/utils/session'
import { serviceMap } from '~/api/'

interface IActionPayload {
    id: string|null,
    path: string|null,
    service: string,
    copy: boolean
}

interface IAction {
  type?: string
  payload?: boolean|IActionPayload
}

// const BUFFER_KEY = 'fmanbuffer'
let initialState = {}
for (var service in serviceMap) {
 initialState[service] = {
   id: null,
   path: null, // to use in queries
   copy: true // to use the right method
 }
}

const BUFFER_COPY_FLAG_SET = 'buffer::copy_flag_set'
const BUFFER_UPDATE = 'buffer::update'

export function setServiceBuffer (id: string, path: string, service: string, copy: boolean): IAction {
  return {
    type: BUFFER_UPDATE,
    payload: {
      id,
      path,
      service,
      copy
    }
  }
}

export function setCopyFlag (serviceName: string, isCopy: boolean): IAction {
  return {
    type: BUFFER_COPY_FLAG_SET,
    payload: isCopy
  }
}

export function updateBuffer (id: string, path: string, service: string, copy: boolean = true) {
  return function (dispatch) {
    // some cross tab events
    dispatch(setServiceBuffer(id, path, service, copy))
  }
}

const actionsMap = {
  [BUFFER_UPDATE]: (state, action) => {
    let buffer = Object.assign({}, state)
    buffer[action.payload.service] = {
      id: action.payload.id,
      path: action.payload.path,
      copy: action.payload.copy
    }
    return buffer
  },
  [BUFFER_COPY_FLAG_SET]: (state, action) => {
    let buffer = Object.assign({}, state)
    buffer[action.payload.service] = {
      id: action.payload.id,
      path: action.payload.path,
      copy: action.payload.copy
    }
    return buffer
  }
}

export default function reducer (state = initialState, action: IAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
