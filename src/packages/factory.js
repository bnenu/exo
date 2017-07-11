import React from 'react'
import isFunctionalComponent from './isFunctionalComponent'

const factory = Wrapped => (props, children) => {
  if(isFunctionalComponent(Wrapped)) {
    return children
      ? Wrapped({ ...props, children })
      : Wrapped(props)
  }

  return children
    ? <Wrapped {...props}>{children}</Wrapped>
    : <Wrapped {...props}/>
}

export default factory
