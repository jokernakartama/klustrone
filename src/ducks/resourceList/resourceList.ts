import Promise from 'promise-polyfill'
import { appWarning, appConfirm } from '~/ducks/modal'
import { loc } from '~/constants'

const initialState = null

export const RESOURCE_LIST_UPDATE = 'resourcelist::update_list'
export const RESOURCE_UPDATE = 'resourcelist::update_resource'

export function updateList (list: IResourceListActionPayload|null = initialState): IResourceListAction {
  return {
    type: RESOURCE_LIST_UPDATE,
    payload: list
  }
}

export function updateResource (data: IResourceActionPayload): IResourceAction {
  return {
    type: RESOURCE_UPDATE,
    payload: data
  }
}

export function getList (path: string|null = null, isTrash: boolean|null = null): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      if (path === null || isTrash === null) {
        const state = getState()
        if (path === null && state.resources.dir !== null) path = state.resources.dir.path
        if (isTrash === null) isTrash = state.resources.isTrash
      }
      const API = getAPI(getState)
      API.getResourceList(path, {
        success: (data) => {
          // when response is recieved after switching service
          // it should not update resource list of other service.
          if (getState().services.active === API.settings.stateName) {
            dispatch(updateList(data))
          }
        },
        error: () => {
        },
        fail: () => {
        },
        anyway: (body, resp) => {
          resolve(body, resp)
        }
      }, isTrash)
    })
  }
}

export function removeResource (path: string, permanently: boolean = false): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const action = permanently ? 'deleteResource' : 'removeResource'
      const API = getAPI(getState)
      API[action](path, {
        success: () => {
          dispatch(getList()).then((body, resp) => resolve(body, resp))
        },
        error: (body, resp) => {
          resolve(body, resp)
        },
        fail: (body, resp) => {
          resolve(body, resp)
        }
      })
    })
  }
}

export function deleteResource (path: string) {
  return (dispatch, getState, getAPI): Promise => {
    return dispatch(removeResource(path, true))
  }
}

export function restoreResource (path: string, overwrite: boolean = false): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      API.restoreResource(path, {
        success: (data) => {
          dispatch(getList()).then((body, resp) => resolve(body, resp))
        },
        exist: (body, resp) => {
          appConfirm(dispatch)(loc.DIALOG_RESOURCE_TO_OVERWRITE)
          .then(() => {
            restoreResource(path, true)
          })
          resolve(body, resp)
        },
        error: (body, resp) => {
          resolve(body, resp)
        },
        fail: (body, resp) => {
          resolve(body, resp)
        }
      }, overwrite)
    })
  }
}

export function purgeTrash (): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      API.purgeTrash({
        success: (data) => {
          dispatch(getList()).then((body, resp) => resolve(body, resp))
        },
        error: (body, resp) => {
          resolve(body, resp)
        },
        fail: (body, resp) => {
          resolve(body, resp)
        }
      })
    })
  }
}

export function downloadResource (path: string): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      API.getDownloadLink(path, {
        success: (href) => {
          window.location.href = href
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

export function publishResource (path: string): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      API.publishResource(path, {
        success: (url) => {
          const resourceId = getState().resources.selected
          dispatch(updateResource({
            id: resourceId,
            value: { publicLink: url }
          }))
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

export function unpublishResource (path: string): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      API.unpublishResource(path, {
        success: (url) => {
          const resourceId = getState().resources.selected
          dispatch(updateResource({
            id: resourceId,
            value: { publicLink: url }
          }))
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

export function renameResource (path: string, value: string): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      API.renameResource(path, value, {
        success: (data) => {
          const resourceId = getState().resources.selected
          dispatch(updateResource({
            id: resourceId,
            value: data
          }))
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

export function pasteResource (path: string, destination: string, isCopy: boolean = true): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const API = getAPI(getState)
      const action = isCopy ? 'copyResourceTo' : 'moveResourceTo'
      API[action](path, destination, {
        success: (data, resp) => {
          dispatch(getList()).then(() => resolve(data, resp))
        },
        error: (body, resp) => {
          resolve(body, resp)
        },
        exist: (body, resp) => {
          appWarning(dispatch)(loc.DIALOG_RESOURCE_EXISTS)
          resolve(body, resp)
        },
        fail: (body, resp) => {
          resolve(body, resp)
        }
      })
    })
  }
}

export function makeDir (dirName: string): (...args) => Promise {
  return (dispatch, getState, getAPI): Promise => {
    return new Promise ((resolve) => {
      const destination = getState().resources.dir.path
      const API = getAPI(getState)
      API.makeDir(destination, dirName, {
        success: (data) => {
          dispatch(updateResource({
            id: data.id,
            value: data
          }))
        },
        error: () => {
        },
        exist: () => {
          appWarning(dispatch)(loc.DIALOG_DIRECTORY_EXISTS)
        },
        fail: () => {},
        anyway: (body, resp) => {
          resolve(body, resp)
        }
      })
    })
  }
}

const actionsMap = {
  [RESOURCE_LIST_UPDATE]: (state, action) => {
    return action.payload
  },
  [RESOURCE_UPDATE]: (state, action) => {
    // copy resources list to modify
    const list = Object.assign({}, state)
    const resource = list[action.payload.id] || {}
    // modify the resource
    if (action.payload.value !== null) {
      list[action.payload.id] = Object.assign({}, resource, action.payload.value)
    } else {
      delete list[action.payload.id]
    }
    return list
  }
}

export default function reducer (state = initialState, action: IResourceListAction|IResourceAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
