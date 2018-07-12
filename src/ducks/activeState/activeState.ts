const initialState: IActiveState = {
  service: null,
  path: '',
  isTrash: false
}

export const ACTIVESTATE_CLEAR = 'activestate::clear'
export const ACTIVESTATE_UPDATE = 'activestate::update'

export function clearStates (): IActiveServiceAction {
  return {
    type: ACTIVESTATE_CLEAR
  }
}

export function updateStates (newState: IActiveState) {
  return {
    type: ACTIVESTATE_UPDATE,
    payload: newState
  }
}

const actionsMap = {
  [ACTIVESTATE_CLEAR]: (state, action: IActiveStateAction) => {
    return initialState
  },
  [ACTIVESTATE_UPDATE]: (state, action: IActiveStateAction) => {
    return {
      ...state,
      ...action.payload
    }
  }
}

export default function reducer (state: IActiveState = initialState, action: IActiveStateAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
