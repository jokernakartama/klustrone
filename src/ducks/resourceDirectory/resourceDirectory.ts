import Promise from 'promise-polyfill'

const initialState = null

export const RESOURCE_DIRECTORY_UPDATE = 'resourcedirectory::update'

export function updateDir (dir: IResourceDirData|null = initialState): IResourceDirectoryAction {
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
      if (path === null) {
        const state = getState()
        if (path === null && state.resources.dir !== null) path = state.resources.dir.path
      }
      const API = getAPI(getState)
      API.getResourceMeta(path, {
        success: (data) => {
          // when response is recieved after switching service
          // it should not update a directory of other service.
          if (getState().active.service === API.settings.stateName) {
            dispatch(updateDir(data))
          }
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
