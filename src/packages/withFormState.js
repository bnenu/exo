import React, { Component } from 'react'
import connect from './connect.js'
import { action } from './stream.js'
import compose from './compose'
import withFunctions from './withFunctions'

const formActionCreator = type =>
  action(payload => ({ type, payload }))

export const formMount    = formActionCreator('@@EXO/FORM_MOUNTED')
export const formChange   = formActionCreator('@@EXO/FORM_CHANGED')
export const formError    = formActionCreator('@@EXO/FORM_ERROR')
export const formSubmit   = formActionCreator('@@EXO/FORM_SUBMITED')
export const formUnmount  = formActionCreator('@@EXO/FORM_UNMOUNTED')

export const forms = (state = {}, { type, payload }) => {
  switch(type) {
    case '@@EXO/FORM_MOUNTED':
      return { ...state, [payload.formName]: { errors: {} }}
    case '@@EXO/FORM_CHANGED':
      return { ...state, [payload.formName]: Object.assign({}, state[payload.formName], payload.formField) }
    case '@@EXO/FORM_ERROR':
      return { ...state, [payload.formName]: Object.assign({}, state[payload.formName], { errors: payload.errors }) }
    case '@@EXO/FORM_SUBMITED':
      return { ...state, [payload.formName]: Object.assign({}, state[payload.formName], { submited: true }) }
    case '@@EXO/FORM_UNMOUNTED':
      return { ...state, [payload.formName]: {} }
    default:
      return state
  }
}

const withFormState = (state$, selector) => (formName, validate) => Wrapped => {
  const formStateSelector = state =>
    selector
      ? Object.assign({}, selector(state), { [formName]: state.forms[formName] })
      : { [formName]: state.forms[formName] }

  const enhance = compose(
    withFunctions({
      onFieldChange: props => e => {
        formChange({ formName: name, formField: { [e.target.name]: e.target.value } })
        formError({ formName: name, errors: validate(this.props[name]) })
      },
      onFileFieldChange: props => e => {
        formChange({ formName: name, formField: { [e.target.name]: e.target.files[0] } })
        formError({ formName: name, errors: validate({ [e.target.name]: e.target.files[0] }) })
      },
      onSubmit(fn) {
        formSubmit({ formName })
        fn()
      }
    }),
    connect(state$, formStateSelector)
  )

  class WFormState extends Component {
    componentWillMount() {
      formMount({ formName })
    }
    componentWillUnmount() {
      formUnmount({ formName })
    }
    render() {
      return <Wrapped { ...this.props }/>
    }
  }

  return enhance(WFormState)
}

export default withFormState
