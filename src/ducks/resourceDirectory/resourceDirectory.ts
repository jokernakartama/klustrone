import Promise from 'promise-polyfill'

const initialState = null

export const RESOURCE_DIRECTORY_UPDATE = 'resourcedirectory::update'

export function updateDir (dir: IDirResource|null = initialState): IResourceDirectoryAction {
  return {
    type: RESOURCE_DIRECTORY_UPDATE,
    payload: dir
  }
}

/**
 * @param {string} path - Resource path
 */
export function getMeta (path: string|null = null): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      API.getResourceMeta(path, {
        success: (data) => {
          dispatch(updateDir(data))
        },
        error: () => {
        },
        fail: () => {
        },
        anyway: (body, resp) => {
          resolve(body, resp)
        }
      })
    })
  }
}

const actionsMap = {
  [RESOURCE_DIRECTORY_UPDATE]: (state, action) => {
    return action.payload
  }
}

export default function reducer (state = initialState, action: IResourceDirectoryAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
