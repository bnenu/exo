import Rx from 'rxjs'
import createState, { action } from '../lib/stream'
import combineReducers from '../lib/combineReducers'

const app = (state = 'Empty', { type, payload }) => {
  switch(type) {
    default:
      return state
  }
}

const reducer = combineReducers({
  app
})

test('Create stream without side effects', () => {
  const s$ = createState({})(reducer)
  const end = s$.subscribe(data => expect(data.app).toBe('Empty'))
  end.unsubscribe()
})

test('Create stream with side effects', () => {
  const s$ = createState({}, (a, b) => {
    expect(a).toBeDefined()
  })(reducer)
  //action(a => ({ type: 'TEST', payload: a }))('An action')
  const end = s$.subscribe((data) => data)
  end.unsubscribe()
})
