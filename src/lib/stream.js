import Rx from 'rxjs'

const isObservable = o => o instanceof Rx.Observable
//const stateSubject = new Rx.BehaviorSubject({})
const applySideEffects = (...fns) => x => {
  for(let fn of fns) {
    if(typeof fn !== 'function') {
      throw new Error('Side effects must be functions!')
    }
    fn(x.action, x.state)
  }
}

const createActionStream = subject => fn => (...args) => {
  const actionObj = fn.call(null, ...args)

  if (
    typeof actionObj !== 'object'
    || Array.isArray(actionObj)
    || actionObj === null
  ) {
    throw new Error('Actions must be functions that return objects with a type property')
  }

  function stream(action) {
    isObservable(action)
      ? subject.next(action)
      : action.type
        ? subject.next(action)
        : subject.next({ type: 'MISSING_TYPE', payload: action })

    if(action.payload && isObservable(action.payload)) {
      stream(action.payload)
    }

    return action
  }

  return stream(actionObj)
}

const createStateStream = (subject, applyEffects) => (initialState, ...fns) => reducer => {
  const a$ = subject
    .startWith(initialState)
    .flatMap(a => isObservable(a) ? a : Rx.Observable.from([a]))

  const s$ = a$.scan(reducer)

  const m$ = a$
    .combineLatest(s$, (a, s) => ({ action: a, state: s }))
    .do(applyEffects(...fns))
    .pluck('state')

  const temp$ = (fns && fns.length > 0) ? m$ : s$

  let state$ = temp$.publishReplay(1)

  state$.connect()
  return state$
}

// function Model(rxSubject) {
//   this.subject = rxSubject
//   this.createState = createStateStream(this.subject, applySideEffects)
//   this.action = createActionStream(this.subject)
// }

const generateModel = stateSubject => ({
  createState: createStateStream(stateSubject, applySideEffects),
  action: createActionStream(stateSubject)
})

// const generateModel = function generateModel(subject) {
//   return new Model(subject)
// }

export default generateModel 
