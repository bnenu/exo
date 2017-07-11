import factory from './factory'

const withDestructured = item => Wrapped => {
  const c = factory(Wrapped)

  return props => {
    return c({
      ...props,
      ...props[item]
    }, props.children)
  }
}

export default withDestructured
