import factory from './factory'
import map from '../utils/map'

const withStreamActions = dispatch => fnMap => Wrapped => {
  const c = factory(Wrapped)

  return props => {
    const fns = map(f => dispatch(f))(fnMap)

    return c({
      ...props,
      ...fns
    }, props.children)
  }
}

export default withStreamActions