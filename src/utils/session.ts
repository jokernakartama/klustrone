import Promise from 'promise-polyfill'

export const DELAY_TIME: number = 1000

function forceUpdate (): void {
  const storage: string = JSON.stringify(window.sessionStorage)
  window.localStorage.setItem('windowSessionStorage', storage)
  window.localStorage.removeItem('windowSessionStorage')
}
/**
 * Initiates the session. As it adds event listeners,
 * it should be called once at the beginning.
 * Because of delay while reading changed localStorage data (about 0.2-0.5s, but sometimes for unknown reasons 0.1s is enough),
 * functions that use getKey and setKey should be called by timeout, so the function
 * wrapped in Promise. This way (timeout) is controversial but works.
 */
export const start = function (excludedKeys: string[] = []): Promise {
  return new Promise(function (resolve: () => void) {
    let lastRecievedData: string
    window.addEventListener('storage', function (event) {
      if (event.key === 'getWindowSessionStorage' && event.newValue !== null) {
        // another tab requests the current tab data
        const storage: {[s: string]: any} = {}
        for (const key in window.sessionStorage) {
          if (excludedKeys.indexOf(key) === -1) {
            storage[key] = window.sessionStorage[key]
          }
        }
        window.localStorage.setItem('windowSessionStorage', JSON.stringify(storage))
        window.localStorage.removeItem('windowSessionStorage')
      } else if (event.key === 'windowSessionStorage' && event.newValue !== null && lastRecievedData !== event.newValue) {
        // the current tab recieves other tab data
        // if sessionStorage is empty or replace existed
        const data = JSON.parse(event.newValue)
        for (const key in data) {
          if (excludedKeys.indexOf(key) === -1 && key !== 'length') window.sessionStorage.setItem(key, data[key])
        }
        lastRecievedData = event.newValue
      }
    })
    if (window.sessionStorage.length === 0) {
      window.localStorage.setItem('getWindowSessionStorage', Date.now().toString())
      window.localStorage.removeItem('getWindowSessionStorage')
    }

    window.setTimeout(() => {
      resolve()
    }, DELAY_TIME)
  })
}

export function getKey (key: string): any {
  let value = window.sessionStorage.getItem(key)
  try {
    value = JSON.parse(value)
  } catch (e) {
    value = e
  }
  return value
}

export function setKey (key: string, value: any): void {
  try {
    value = JSON.stringify(value)
  } catch (e) {
    // for Date objects and functions etc.
    value = value.toString()
  }
  window.sessionStorage.setItem(key, value)
  forceUpdate()
}

export function removeKey (key: string): void {
  delete window.sessionStorage[key]
  forceUpdate()
}
