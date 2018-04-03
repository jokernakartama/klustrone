interface IServiceListAction {
    type?: string
    meta?: any
    payload?: any
}

interface IServiceListElementState {
  name: string
  mounted: false
}

interface IServiceListState {
  [serviceName: string]: IServiceListElementState
}
