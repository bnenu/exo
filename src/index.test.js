import { K, I, V } from './utils/combinators'


test('K Combinator', () => {
  expect(K(true)(false)).toBe(true)
})

test('I Combinator', () => {
  expect(I(true)).toBe(true)
})

test('V Combinator', () => {
  expect(V(true)(false)(K)).toBe(true)
})
