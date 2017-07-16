import compose from '../utils/compose'
import { K, I, V } from '../utils/combinators'

test('Compose to return a function', () => {
  const received = compose(I)
  expect(typeof received === 'function').toBeTruthy()
})


test('Compose to apply given functions', () => {
  const received = compose(I, I, K('TEST'))(I)
  expect(received).toBe('TEST')
})
