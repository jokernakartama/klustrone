export = IStaticPageComponent
export as namespace IStaticPageComponent

declare namespace IStaticPageComponent {
  interface Props {
    pageName: string
    loadingActions: any
  }
  interface State {
    content: string|null
  }
}