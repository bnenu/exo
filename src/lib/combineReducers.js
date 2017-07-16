const combineReducers = reducers => (state = {}, action) => {
  return Object.keys(reducers).reduce(
    (nextstate, key) => ({
      ...nextstate,
      [key]: reducers[key](state[key], action.type ? action : { type: 'ACTION_ERROR' })
    }),
    {}
  )
}

export default combineReducers
