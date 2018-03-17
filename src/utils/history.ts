import { createBrowserHistory, createHashHistory } from 'history'

export const APPLICATION_SERVER_DIRECTORY: string = '/'
export const USE_BROWSER_HISTORY: boolean = true

export const history = USE_BROWSER_HISTORY ? createBrowserHistory({ basename: APPLICATION_SERVER_DIRECTORY }) : createHashHistory()
