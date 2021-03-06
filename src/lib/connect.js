import React from 'react'
import factory from './factory'

const connect = (state$, selector = s => s) => Wrapped => {
  const c = factory(Wrapped)
  return class Connect extends React.Component {
    componentWillMount() {
      this.subscription = state$.map(selector).subscribe(
        model => this.setState((prevState, props) => model),
        err => console.log('State stream error: ', err)
      )
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }

    render() {
      return c({
        ...this.state,
        ...this.props
      }, this.props.children)
    }
  }
}

export default connect
