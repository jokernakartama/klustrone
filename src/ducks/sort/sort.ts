import { setKey, getKey } from '~/utils/session'
import { keys } from '~/constants'

export const SORTING_SETTINGS_KEY = keys.SORT_SETTINGS
const initialState = getKey(SORTING_SETTINGS_KEY) || { field: 'name', asc: true }

export const RESOURCES_SORT_CHANGE = 'resourcessort::change'

export function sortResourcesList (field: string = 'name', asc: boolean = true) {
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

export default function reducer (state = initialState, action: ISortAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
