interface IResourceBufferActionPayload {
    id: string|null,
    path: string|null,
    service: string,
    copy: boolean
}

interface IResourceBufferAction {
  type?: string
  payload?: boolean|IResourceBufferActionPayload
} 
