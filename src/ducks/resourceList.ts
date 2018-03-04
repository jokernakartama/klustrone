import Promise from 'promise-polyfill'
// import { loadingStart, loadingEnd } from './loading'
import { appWarning/*, appConfirm*/ } from './modal'

interface IActionListPayload {
  [resourceId: string]: IDirResource|IFileResource
}

interface IActionResourcePayload {
  id: string,
  value: object
}

interface IListAction {
    type?: string
    payload?: IActionListPayload
}

interface IResourceAction {
    type?: string
    payload?: IActionResourcePayload
}

const initialState = {}

const RESOURCE_LIST_UPDATE = 'resourcelist::update_list'
const RESOURCE_UPDATE = 'resourcelist::update_resource'

export function updateList (list: IActionListPayload = initialState): IListAction {
  return {
    type: RESOURCE_LIST_UPDATE,
    payload: list
  }
}

export function updateResource (data: IActionResourcePayload): IResourceAction {
  return {
    type: RESOURCE_UPDATE,
    payload: data
  }
}

export function getList (Service: ICloudAPI, path: string|null = null, isTrash: boolean|null = null): (...args) => Promise {
  return (dispatch, getState): Promise => {
    return new Promise ((resolve) => {
      if (path === null || isTrash === null) {
        const state = getState()
        if (path === null && state.resources.dir !== null) path = state.resources.dir.path
        if (isTrash === null) isTrash = state.resources.isTrash
      }
      Service.getResourceList(path, {
        success: (data) => {
          updateList(data)
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

export function removeResource (Service: ICloudAPI, path: string, permanently: boolean = false): (...args) => Promise {
  return (dispatch): Promise => {
    return new Promise ((resolve) => {
      const action = permanently ? 'deleteResource' : 'removeResource'
      Service[action](path, {
        success: () => {
          dispatch(getList(Service)).then((body, resp) => resolve(body, resp))
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

export function deleteResource (Service: ICloudAPI, path: string) {
  return (dispatch, getState): Promise => {
    return dispatch(removeResource(Service, path, true))
  }
}

export function restoreResource (Service: ICloudAPI, path: string, permanently: boolean = false): (...args) => Promise {
  return (dispatch): Promise => {
    return new Promise ((resolve) => {
      Service.restoreResource(path, {
        success: (data) => {
          dispatch(getList(Service)).then((body, resp) => resolve(body, resp))
        },
        exist: (body, resp) => {
          resolve(body, resp)
        },
        error: (body, resp) => {
          resolve(body, resp)
        },
        fail: (body, resp) => {
          resolve(body, resp)
        }
      }, permanently)
    })
  }
}

export function purgeTrash (Service: ICloudAPI): (...args) => Promise {
  return (dispatch): Promise => {
    return new Promise ((resolve) => {
      Service.purgeTrash({
        success: (data) => {
          dispatch(getList(Service)).then((body, resp) => resolve(body, resp))
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

export function downloadResource (Service: ICloudAPI, path: string): (...args) => Promise {
  return (dispatch): Promise => {
    return new Promise ((resolve) => {
      Service.purgeTrash({
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

export function publishResource (Service: ICloudAPI, path: string): (...args) => Promise {
  return (dispatch, getState): Promise => {
    return new Promise ((resolve) => {
      Service.publishResource(path, {
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

export function unpublishResource (Service: ICloudAPI, path: string): (...args) => Promise {
  return (dispatch, getState): Promise => {
    return new Promise ((resolve) => {
      Service.unpublishResource(path, {
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

export function renameResource (Service: ICloudAPI, path: string, value: string): (...args) => Promise {
  return (dispatch, getState): Promise => {
    return new Promise ((resolve) => {
      Service.renameResource(path, value, {
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

export function pasteResource (Service: ICloudAPI, path: string, destination: string): (...args) => Promise {
  return (dispatch, getState): Promise => {
    return new Promise ((resolve) => {
      const isCopy = getState().buffer.isCopy
      const action = isCopy ? 'copyResourceTo' : 'moveResourceTo'
      Service[action](path, destination, {
        success: (data, resp) => {
          // в этом резоолве надо убрать флаг загрузки
          // поменять флаг на isCopy в буфере
          // if (!buffer.copy) dispatch(updateBuffer(data.id, data.path, 'disk', true))
          dispatch(getList(Service)).then(() => resolve(data, resp))
        },
        error: (body, resp) => {
          resolve(body, resp)
        },
        exist: (body, resp) => {
          // тут надо вызвать алерт. Как? я хз
          appWarning(dispatch)('Resource with the same path already exists in current directory.')
          resolve(body, resp)
        },
        fail: (body, resp) => {
          resolve(body, resp)
        }
      })
    })
  }
}

export function makeDir (Service: ICloudAPI, dirName: string): (...args) => Promise {
  return (dispatch, getState): Promise => {
    return new Promise ((resolve) => {
      const destination = getState().resources.dir.path
      Service.makeDir(destination, dirName, {
        success: (data) => {
          dispatch(updateResource({
            id: data.id,
            value: data
          }))
        },
        error: () => {},
        exist: () => {
          appWarning(dispatch)('The directory "' + dirName + '" already exists')
        },
        fail: () => {},
        anyway: (body, resp) => {
          resolve(body, resp)
        }
      })
    })
  }
}
/*
export function removeResource (Service: ICloudAPI, path: string, permanently: boolean = false) {
  return (dispatch): Promise => {
    return new Promise ((resolve) => {
      Service.getResourceList(path, {
        success: (data) => {
          dispatch(getList(Service)).then(() => resolve())
        },
        error: () => {
        },
        fail: () => {
        },
        anyway: () => {
        }
      })
    })
  }
}*/

const actionsMap = {
  [RESOURCE_LIST_UPDATE]: (state, action) => {
    return action.payload
  },
  [RESOURCE_UPDATE]: (state, action) => {
    // copy resources list to modify
    const list = Object.assign({}, state.resources.list)
    const resource = list[action.payload.id] || {}
    // modify the resource
    if (action.payload.value !== null) {
      list[action.payload.id] = Object.assign({}, resource, action.payload.value)
    } else {
      delete list[action.payload.id]
    }
    return {
      ...state,
      resources: list
    }
  }
}

export default function reducer (state = initialState, action: IListAction|IResourceAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
