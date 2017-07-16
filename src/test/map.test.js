import map from '../utils/map'
import { K, I, V } from '../utils/combinators'

test('Given an object it returns an object', () => {
  const received = map(I)({ dummy: 'test' })
  expect(typeof received === 'object').toBeTruthy()
})

test('Given an array it returns an array', () => {
  const received = map(I)(['test'])
  expect(Array.isArray(received)).toBeTruthy()
})

test('Given an object it returns an object with same properties', () => {
  const received = map(K(I))({ dummy: 'test' })
  const expected = { dummy: I }
  expect(received).toEqual(expected)
})
