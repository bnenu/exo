
const K = x => y => x
const I = x => x
const V = x => y => z => z(x)(y)

test('K Combinator', () => {
  expect(K(true)(false)).toBe(true)
})

test('I Combinator', () => {
  expect(I(true)).toBe(true)
})

test('V Combinator', () => {
  expect(V(true)(false)(K)).toBe(true)
})
