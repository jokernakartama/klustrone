import { serviceMap } from '~/api/'

const initialState = {}
Object.keys(serviceMap).forEach((name) => {
  initialState[name] = {
    id: null,
    path: null, // to use in queries
    copy: true // to use the right method
  }
})

export const BUFFER_COPY_FLAG_SET = 'buffer::copy_flag_set'
export const BUFFER_UPDATE = 'buffer::update'

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

export function setCopyFlag (serviceName: string, isCopy: boolean): IResourceBufferAction {
  return {
    type: BUFFER_COPY_FLAG_SET,
    meta: {
      crossTab: true
    },
    payload: isCopy
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
  },
  [BUFFER_COPY_FLAG_SET]: (state, action) => {
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
