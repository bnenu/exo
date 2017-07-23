import React from 'react'
import factory from './factory'

const withState = (stateName, initialState) => Wrapped => {
  const c = factory(Wrapped)

  return class WithState extends React.Component {
    constructor(props) {
      super(props)
      this.state = { localState: initialState }
      this.updateLocalState = this.updateLocalState.bind(this)
    }

    updateLocalState(updater, cb) {
      this.setState(({ localState }, props) => {
        return typeof updater === 'function'
          ? { localState: updater(localState, props) }
          : { localState: updater }
      }, cb)
    }

    render() {
      const updaterFnName = `${stateName}Updater`
      return c({
        ...this.props,
        [stateName]: this.state.localState,
        [updaterFnName]: this.updateLocalState
      }, this.props.children)
    }
  }
}

export default withState
