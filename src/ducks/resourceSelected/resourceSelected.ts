const initialState = null

export const RESOURCE_SELECT = 'resource::select'

export function select (id: string|null = initialState): IResourceSelectedAction {
  return {
    type: RESOURCE_SELECT,
    payload: id
  }
}

export function deselect () {
  return function (dispatch): void {
    dispatch(select(null))
  }
}

const actionsMap = {
  [RESOURCE_SELECT]: (state, action) => {
    return action.payload
  }
}

export default function reducer (state = initialState, action: IResourceSelectedAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
