const initialState = null

export const SERVICE_SELECT = 'activeservice::select'
export const SERVICE_CLEAR = 'activeservice::clear'

export function selectService (service: activeServiceActionPayload): IActiveServiceAction {
  return {
    type: SERVICE_SELECT,
    payload: service
  }
}

export function clearServiceSelection (): IActiveServiceAction {
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

export default function reducer (state: activeServiceActionPayload = initialState, action: IActiveServiceAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
