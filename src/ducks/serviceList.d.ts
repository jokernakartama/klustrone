interface IServiceListAction {
    type?: string
    payload?: any
}

interface IServiceListElementState {
  name: string
  mounted: false
}

interface IServiceListState {
  [serviceName: string]: IServiceListElementState
}
