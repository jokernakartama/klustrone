const initialState = ''

export const RESOURCES_PATH_UPDATE = 'resourcepath::update'

export function updateResourcePath (path: string): IResourcPathAction {
   return {
     type: RESOURCES_PATH_UPDATE,
     payload: path
   }
 }

const actionsMap = {
  [RESOURCES_PATH_UPDATE]: (state, action) => {
    return action.payload
  }
}

export default function reducer (state = initialState, action: IResourcPathAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
