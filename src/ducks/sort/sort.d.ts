interface ISortActionPayload {
  field: string
  asc: boolean
}

interface ISortAction {
  type?: string
  payload?: ISortActionPayload
} 
