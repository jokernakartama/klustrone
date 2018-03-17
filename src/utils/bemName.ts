interface IBEMEntityObjectModifier {
  [modifier: string]: string|boolean
}

interface IBEMEntityObject {
  block: string
  elem?: string
  mod?: IBEMEntityObjectModifier
}
const ELEMENT_DELIMETER = '__'
const MODIFIER_DELIMETER = '_'
const MODIFIER_VALUE_DELIMETER = '_'

function bemModifier (block: string, mod: IBEMEntityObjectModifier): string {
  let modifier = ''
  const modifierKeys = Object.keys(mod)
  if (modifierKeys.length) {
    modifierKeys.forEach((name) => {
      const modifierValue = mod[name]
      if (typeof modifierValue === 'string') {
        modifier = modifier + ' ' + block + MODIFIER_DELIMETER + name + MODIFIER_VALUE_DELIMETER + modifierValue
      } else {
        modifier =  modifierValue ? modifier + ' ' + block + MODIFIER_DELIMETER + name : ''
      }
    })
    // because joining makes an extra space symbol if modifier's value is false
    modifier = modifier.slice(1)
  }
  return modifier
}

export default function bemName (o: IBEMEntityObject|IBEMEntityObject[]): string {
  let className = ''
  if (Array.isArray(o)) {
    return o.map((value) => {
      return className + bemName(value)
    }).join(' ')
  } else {
    className = o.block
    if (o.elem) className = className +  ELEMENT_DELIMETER + o.elem
    if (o.mod) className = className + ' ' + bemModifier(className, o.mod)
    return className
  }
}
