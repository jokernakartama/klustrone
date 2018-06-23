interface IBEMEntityObjectModifier {
  [modifier: string]: string|boolean
}

interface IBEMEntityObject {
  block: string
  elem?: string
  mod?: IBEMEntityObjectModifier
}
