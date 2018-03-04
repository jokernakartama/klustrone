import Promise from 'promise-polyfill'

interface IActionPayload {
  type: string
  message?: string
  title?: string
  data?: any
  accept?: string
  decline?: string
  keep?: boolean
}

interface IAction {
    type?: string
    payload?: IActionPayload|false
}

type gFunc = ((data: any) => any)|false

// Omit uncaught exceptions to use Promise.catch() only
// to handle dialog cancelling
Promise._unhandledRejectionFn = () => {}

const initialState = false

export const MODAL_OPEN: string = 'modal::open'
export const MODAL_CLOSED: string = 'modal::closed'

// Seems like there is no other way to pass the value of an argument of one function
// to another one as not an argument, except using global variables
let globalResolveFunction: gFunc = false
let globalRejectFunction: gFunc = false
let globalKeepOpen: boolean = false

const dialogDefaults = {
  accept: 'Ok',
  decline: 'Cancel',
  title: '',
  keep: false
}

export function openDialog (type, message = '', data?, opts = {}, resolve: gFunc = false, reject: gFunc = false) {
  return function (dispatch): void {
    const options = Object.assign({}, dialogDefaults, opts)
    globalResolveFunction = resolve
    globalRejectFunction = reject
    globalKeepOpen = options.keep
    dispatch(openModal(type, message, data, options.title, options.accept, options.decline))
  }
}

export function closeDialog (data?) {
  return function (dispatch): void {
    // when data is set (dialog rule is accepted) call resolve function
    if (globalResolveFunction && data !== undefined) {
      globalResolveFunction(data)
    }
    globalResolveFunction = false
    // if the dialog should not be replaced with other one
    // or dialog rule was declined close the dialog
    if (!globalKeepOpen || data === undefined) {
      if (globalRejectFunction) {
        globalRejectFunction(data)
        globalRejectFunction = false
      }
      globalKeepOpen = false
      dispatch(closeModal())
    }
  }
}

export function openModal (type: string, message: string = '', data: any = false, title: string, accept: string, decline: string): IAction {
  return {
    type: MODAL_OPEN,
    payload: {
      type,
      message,
      title,
      data,
      accept,
      decline
    }
  }
}

export function closeModal (): IAction {
  return {
    type: MODAL_CLOSED
  }
}

const actionsMap = {
  [MODAL_OPEN]: (state, action) => {
    return action.payload
  },
  [MODAL_CLOSED]: () => {
    return false
  },
}

// global functions

// Available options:
// * title - additional explanation
// * keep - keeps the dialog open, use it only if the dialog calls another dialog in chain
// * accept - sets a confirm button name
// * decline - sets a decline button name
// These functions return promises so they can be chained like this:
// appPrompt(dispatch)('Please, type your name', '', { accept: 'This one is mine' })
//   .then(name => {
//     return appConfirm(dispatch)('Are you\'re sure that you are ' + name + '?', { accept: 'Yeah', decline: 'No, I\'m not' })
//   })
//   .then(() => {
//     appInfo(dispatch)('Brilliant')
//   })
//   .catch(() => {
//     return appConfirm(dispatch)('You were about to confirm your name, but drop that. Is any chance to get it?', { accept: 'I\'ll try again', decline: 'No way!' })
//   })
//   .then(() => {
//     return appPrompt(dispatch)('So, what\'s your name?')
//   })
//   .then((name) => {
//     appInfo(dispatch)(name + '. Okay than.')
//   })
//   .catch(() => {
//     appWarning(dispatch)('Your life, your rules')
//   })

/**
 * Replaces window.alert
 * @param {string} message Message to be shown in the dialog
 * @param {object} option Additional parameters
 * @returns {Promise}
 */
export function appInfo (dispatch) {
  return function (message = '', opts = { decline: 'Ok'}, data = true): Promise {
    return new Promise((resolve) => {
      dispatch(openDialog('info', message, data, opts, resolve))
    })
  }
}

/**
 * @see appInfo
 */
export function appError (dispatch) {
  return function (message = '', opts = { decline: 'Ok'}, data = true) {
    return new Promise((resolve) => {
      dispatch(openDialog('error', message, data, opts, resolve))
    })
  }
}

/**
 * @see appInfo
 */
export function appWarning (dispatch) {
  return function (message = '', opts = { decline: 'Ok'}, data = true) {
    return new Promise((resolve) => {
      dispatch(openDialog('warning', message, data, opts, resolve))
    })
  }
}

/**
 * Replaces window.confirm
 * @param {string} message Message to be shown in the dialog
 * @param {object} option Additional parameters
 * @returns {Promise}
 */
export function appConfirm (dispatch) {
  return function (message = '', opts = { accept: 'Confirm' }) {
    return new Promise((resolve, reject) => {
      dispatch(openDialog('confirm', message, true, opts, resolve, reject))
    })
  }
}

/**
 * Replaces window.prompt
 * @param {string} message Message to be shown in the dialog
 * @param {object} option Additional parameters
 * @returns {Promise}
 */
export function appPrompt (dispatch) {
  return function (message = '', defautValue = '', opts = { accept: 'Done' }) {
    return new Promise((resolve, reject) => {
      dispatch(openDialog('prompt', message, defautValue, opts, resolve, reject))
    })
  }
}

export default function reducer (state = initialState, action: IAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
