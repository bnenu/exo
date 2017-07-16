const isClassComponent = Component =>
  Boolean(
    Component
    && Component.prototype
    && typeof Component.prototype.isReactComponent === 'object'
  )

const isFunctionalComponent = Component =>
  Boolean(
    typeof Component === 'function'
    && !isClassComponent(Component)
    && !Component.defaultProps
    && !Component.contextTypes
    && (process.env.NODE_ENV === 'production' || !Component.propTypes)
  )

export default isFunctionalComponent
