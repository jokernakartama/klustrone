interface IServiceListAction {
    type?: string
    meta?: any
    payload?: any
}

interface IServiceListElementState {
  name: string
  mounted: boolean
  expiresPerc?: number
  timerId?: number 
}

interface IServiceListState {
  [serviceName: string]: IServiceListElementState
}
