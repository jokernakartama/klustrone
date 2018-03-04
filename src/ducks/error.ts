type actionPayload = number|null

interface IAction {
    type?: string
    payload?: actionPayload
}

const initialState: actionPayload = null

export const ERROR_RECIEVE = 'error::recieve'
export const ERROR_CLEAR = 'error::clear'

export function throwError (code: number): IAction {
  return {
    type: ERROR_RECIEVE,
    payload: code
  }
}

export function clearError (): IAction {
  return {
    type: ERROR_CLEAR
  }
}

// REDUCER

const actionsMap = {
  [ERROR_RECIEVE]: (state, action) => {
    return action.payload
  },
  [ERROR_CLEAR]: (state, action) => {
    return null
  }
}

export default function reducer (state: actionPayload = initialState, action: IAction = {}): actionPayload {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
