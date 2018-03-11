type actionPayload = string|null

interface IAction {
    type?: string
    payload?: actionPayload
}

const initialState = null

const SERVICE_SELECT = 'activeservice::select'
const SERVICE_CLEAR = 'activeservice::clear'

export function selectService (service: actionPayload): IAction {
  return {
    type: SERVICE_SELECT,
    payload: service
  }
}

export function clearServiceSelection (): IAction {
  return {
    type: SERVICE_CLEAR
  }
}

const actionsMap = {
  [SERVICE_SELECT ]: (state, action) => {
    return action.payload
  },
  [SERVICE_CLEAR]: () => {
    return null
  }
}

export default function reducer (state: actionPayload = initialState, action: IAction = {}): actionPayload {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
