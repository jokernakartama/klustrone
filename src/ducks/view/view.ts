import { setKey, getKey } from '~/utils/session'

export const VIEW_SETTINGS_KEY = 'view'

const initialState = getKey(VIEW_SETTINGS_KEY) || 'tile'

export enum viewType {
  TILE = 'tile',
  LIST = 'list'
}

export const VIEW_CHANGE = 'listview::change'

export function setView (view: viewType): IViewAction {
  return {
    type: VIEW_CHANGE,
    payload: view
  }
}

export function changeView (view: viewType): (...args) => void {
  return function (dispatch) {
    setKey(VIEW_SETTINGS_KEY, view)
    dispatch(setView(view))
  }
}

const actionsMap = {
  [VIEW_CHANGE]: (state, action) => {
    return action.payload
  }
}

export default function reducer (state = initialState, action: IViewAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
