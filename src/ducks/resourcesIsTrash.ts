const RESOURCES_TRASH_FLAG_UPDATE = 'resourcestrashflag::update'

const initialState = false

export function updateTrashFlag (isTrash: boolean) {
   return {
     type: RESOURCES_TRASH_FLAG_UPDATE,
     payload: isTrash
   }
 }

const actionsMap = {
  [RESOURCES_TRASH_FLAG_UPDATE]: (state, action) => {
    return action.payload
  }
}

export default function reducer (state = initialState, action: IResourceIsTrashAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
