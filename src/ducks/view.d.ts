type ViewActionPayload = 'tile'|'list'

interface IViewAction {
  type?: string
  payload?: ViewActionPayload
}
