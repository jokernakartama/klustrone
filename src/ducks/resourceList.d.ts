interface IResourceListActionPayload {
  [resourceId: string]: IDirResource|IFileResource
}

interface IResourceActionPayload {
  id: string,
  value: object
}

interface IResourceListAction {
    type?: string
    payload?: IResourceListActionPayload
}

interface IResourceAction {
    type?: string
    payload?: IResourceActionPayload
} 
