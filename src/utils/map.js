const _mapObject = (f, o) => {
  let r = {}
  for(let key in o) {
    if(o.hasOwnProperty(key)) {
      r[key] = f(o[key])
    }
  }
  return r
}

const map = f => source =>
  source.constructor === Array
    ? source.map(f)
    : _mapObject(f, source)

export default map
