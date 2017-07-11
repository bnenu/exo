const pipe = (f, ...fns) => (...args) =>
  fns.length === 0
    ? f(...args)
    : pipe(...fns)(f(...args))

export default pipe
