import factory from './factory'

const nest = (...components) => ({...props, children}) =>
  components
    .map(c => factory(c))
    .reduceRight((child, parent) => parent(props, child), children)

export default nest
