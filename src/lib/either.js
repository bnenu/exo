import factory from './factory'

const either = test => (Left, Right = C => C) => Wrapped =>
  props =>
    test(props)
      ? factory(Right(Wrapped))({ ...props }, props.children)
      : factory(Left(Wrapped))({ ...props }, props.children)

export default either
