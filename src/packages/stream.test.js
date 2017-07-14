import Rx from 'rxjs'
import createState from './stream'
import combineReducers from './combineReducers'

const app = (state = 'Empty', { type, payload }) => {
  switch(type) {
    case 'APP_INIT':
      return 'App state initiated'
    default:
      return state
  }
}

const reducer = combineReducers({
  app
})
test('Create stream', () => {
  const s$ = createState({})(reducer)
  console.log(s$)
})
