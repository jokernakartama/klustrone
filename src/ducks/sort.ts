import { setKey, getKey } from '~/utils/session'

interface IActionPayload {
  field: string
  asc: boolean
}

interface IAction {
  type?: string
  payload?: IActionPayload
}

const SORTING_SETTINGS_KEY = 'sort'
const initialState = getKey(SORTING_SETTINGS_KEY) || { field: 'name', asc: true }

export const RESOURCES_SORT_CHANGE = 'resourcessort::change'

export function sortResourcesList(field = 'name', asc = true) {
  return function (dispatch) {
    setKey(SORTING_SETTINGS_KEY, {
      field,
      asc
    })
    dispatch({
      type: RESOURCES_SORT_CHANGE,
      payload: {
        field,
        asc
      }
    })
  }
}

const actionsMap = {
  [RESOURCES_SORT_CHANGE]: (state, action) => {
    return action.payload
  }
}

export default function reducer (state = initialState, action: IAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
