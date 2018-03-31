const initialState = false

const LOADING_START = 'loading::start'
const LOADING_END = 'loading::end'

export function loadingStart (): ILoadingAction {
  return {
    type: LOADING_START
  }
}

export function loadingEnd (): ILoadingAction {
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

export default function reducer (state = initialState, action: ILoadingAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
