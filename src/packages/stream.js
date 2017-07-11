import Rx from 'rxjs'

const isObservble = o => o instanceof Rx.Observable
const stateSubject = new Rx.BehaviorSubject({})

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

const createStateStream = subject => initialState => reducer => {
  let state$ = subject
    .startWith(initialState)
    .flatMap(a => isObservable(a) ? a : Rx.Observable.from([a]))
    .scan(reducer)
    .publishReplay(1)

  state$.connect()

  return state$
}

export const createState = createStateStream(stateSubject)
export const action = createActionStream(stateSubject)
