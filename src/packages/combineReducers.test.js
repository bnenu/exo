import combineReducers from './combineReducers'

const testReducers = {
  dummy: (state = 'DUMMY INIT', action) => {
    switch(action.type) {
      case 'TEST':
        return 'DUMMY TEST'
      default:
        return state
    }
  },
  some: (state, action) => state
}

test('combine reducers', () => (
  expect(combineReducers(testReducers)({ dummy: 'PREV DUMMY', some: 'ELSE'}, { type: 'TEST' }))
    .toEqual({ dummy: 'DUMMY TEST', some: 'ELSE' })
))
