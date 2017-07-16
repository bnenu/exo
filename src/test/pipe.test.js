import pipe from '../utils/pipe'
import { K, I, V } from '../utils/combinators'

test('Pipe to return a function', () => {
  const received = pipe(I)
  expect(typeof received === 'function').toBeTruthy()
})


test('Pipe to apply given functions', () => {
  const received = pipe(I, I, K('TEST'))(I)
  expect(received).toBe('TEST')
})
