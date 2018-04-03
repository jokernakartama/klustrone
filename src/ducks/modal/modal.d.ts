type ModalType = 'info'|'error'|'warning'|'confirm'|'prompt'

interface IModalActionPayload {
  type: ModalType
  message?: string
  title?: string
  data?: any
  accept?: string
  decline?: string
  keep?: boolean
}

interface IModalAction {
  type?: string
  payload?: IModalActionPayload|false
}
