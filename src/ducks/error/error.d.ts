type errorActionPayload = number|null

interface IErrorAction {
  type?: string
  payload?: errorActionPayload
}
