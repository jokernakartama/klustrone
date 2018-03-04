interface IAction {
    type?: string
    payload?: IDirResource|null
}

const initialState = null

export const RESOURCE_DIRECTORY_UPDATE = 'resourcedirectory::update'

export function update (dir: IDirResource|null = initialState): IAction {
  return dir
}

const actionsMap = {
  [RESOURCE_DIRECTORY_UPDATE]: (state, action) => {
    return action.payload
  }
}

export default function reducer (state = initialState, action: IAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
