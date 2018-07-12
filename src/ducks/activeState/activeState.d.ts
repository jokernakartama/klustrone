type ActiveStateService = string|null
type ActiveStatePath = string
type ActiveStateTrashFlag = boolean

interface IActiveState {
  service: ActiveStateService
  path: ActiveStatePath
  isTrash: ActiveStateTrashFlag
}

interface IActiveStateAction {
  type?: string
  payload?: IActiveState
}
