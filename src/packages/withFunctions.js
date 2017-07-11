import factory from './factory'

const withFunctions = fnMap => Wrapped => {
  const c = factory(Wrapped)

  return props => {
    const fns = map(f => f(props))(fnMap)

    return c({
      ...props,
      ...fns
    }, props.children)
  }
}

export default withFunctions
