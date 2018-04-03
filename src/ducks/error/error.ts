const initialState: errorActionPayload = null

export const ERROR_RECIEVE = 'error::recieve'
export const ERROR_CLEAR = 'error::clear'

export function throwError (code: number): IErrorAction {
  return {
    type: ERROR_RECIEVE,
    payload: code
  }
}

export function clearError (): IErrorAction {
  return {
    type: ERROR_CLEAR
  }
}

const actionsMap = {
  [ERROR_RECIEVE]: (state, action) => {
    return action.payload
  },
  [ERROR_CLEAR]: (state, action) => {
    return null
  }
}

export default function reducer (state: errorActionPayload = initialState, action: IErrorAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
