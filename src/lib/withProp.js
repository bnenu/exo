import factory from './factory'

const withProp = propName => propValue => Wrapped => {
  const c = factory(Wrapped)

  return props =>
    c({
      ...props,
      [propName]: propValue
    }, props.children)
}

export default withProp
