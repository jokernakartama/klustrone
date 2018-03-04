 interface IAction {
    type?: string
}

const initialState = false

const LOADING_START = 'loading::start'
const LOADING_END = 'loading::end'

export function loadingStart (): IAction {
  return {
    type: LOADING_START
  }
}

export function loadingEnd (): IAction {
  return {
    type: LOADING_END
  }
}

const actionsMap = {
  [LOADING_START]: () => {
    return true
  },
  [LOADING_END]: () => {
    return false
  }
}

export default function reducer (state = initialState, action: IAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
