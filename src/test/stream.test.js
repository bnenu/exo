import Rx from 'rxjs'
import generateModel from '../lib/stream'
import combineReducers from '../lib/combineReducers'

const app = (state = 'Empty', { type, payload }) => {
  switch(type) {
    case 'REQ':
      return { subst: payload }
    case 'SUCCESS':
      return { subst: payload }
    default:
      return state
  }
}

const reducer = combineReducers({
  app
})
// export const ROOTURL = 'http://app.chemrover.com/api'

// dev api url
//const ROOTURL = "http://188.215.51.53:8059/api"
// const ROOTURL = "http://localhost:8059/api"
// const getItems = (endpoint, body) => Rx.Observable.ajax({
//   method: 'POST',
//   requestType: 'json',
//   headers: Object.assign(
//     {},
//     { 'Authorization': '' },
//     { 'Content-Type': 'application/json' }
//   ),
//   url: `${ROOTURL}/${endpoint}`,
//   body: body
// })

test('Create stream without side effects', () => {
  const model = generateModel(new Rx.BehaviorSubject({}))
  //console.log(model)
  const s$ = model.createState({})(reducer)
  const end = s$.subscribe(data => expect(data.app).toBe('Empty'))
  end.unsubscribe()
})

test('Create stream with side effects', () => {
  const model = generateModel(new Rx.BehaviorSubject({}))
  const s$ = model.createState({}, (a, b) => {
    expect(a).toBeDefined()
  })(reducer)
  const end = s$.subscribe((data) => console.log(data))
  model.action(a => ({ type: 'REQ', payload: a }))('An action')
  end.unsubscribe()
})

// test('Stream async actions from streams',  () => {
//   const model = generateModel(new Rx.BehaviorSubject({}))
//   const s$ = model.createState({})(reducer)
//   const posts$ = Rx.Observable
//     .ajax('https://jsonplaceholder.typicode.com/posts/1')
//   //   .map(data => data.response)
//   //   .catch(err => console.log(err))
//   // posts$.subscribe(res => console.log(res))
//   const end = s$.subscribe((data) => console.log(data))
//   model.action(s => ({
//     type: 'REQ',
//     payload: posts$
//       .map(res => ({ type: 'SUCCESS', payload: res.response}))
//       .catch(err => console.log(err))
//   }))()
// })
