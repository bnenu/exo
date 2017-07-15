import React, { Component } from 'react'
import connect from './connect.js'
import { action } from './stream.js'
import compose from './compose'
import withFunctions from './withFunctions'

const formActionCreator = type =>
  action(payload => ({ type, payload }))

// forms actions
export const formMount    = formActionCreator('@@EXO/FORM_MOUNTED')
export const formChange   = formActionCreator('@@EXO/FORM_CHANGED')
export const formError    = formActionCreator('@@EXO/FORM_ERROR')
export const formSubmit   = formActionCreator('@@EXO/FORM_SUBMITED')
export const formUnmount  = formActionCreator('@@EXO/FORM_UNMOUNTED')

// forms state reducer
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

const fStateSelector = formName => additionalSelector => state =>
  additionalSelector
    ? ({...additionalSelector(state), [formName]: state.forms[formName]})
    : ({[formName]: state.forms[formName]})

const fieldChange = (formName, validate) => props => event => {
  const { name, value } = event.target
  formChange({ formName, formField: { [name]: value }})
  validate && formError({ fromName, errors: validate(props[formName]) })
}

const fileFieldChange = (fromName, validate) => props => event => {
  const { name, files } = event.target
  formChange({ formName, formField: { [name]: files[0] } })
  validate && formError({ formName, errors: validate({ [name]: files[0] }) })
}

const submit = formName => props => cb => {
  formSubmit({ formName })
  cb()
}

// const formStateSelector = state =>
//   selector
//     ? Object.assign({}, selector(state), { [formName]: state.forms[formName] })
//     : { [formName]: state.forms[formName] }

const withFormState = (formName, validate) => (state$, selector) => Wrapped => {
  const enhance = compose(
    withFunctions({
      onFieldChange: fieldChange(formName, validate),
      onFileFieldChange: fileFieldChange(formName, validate),
      onSubmit: submit(formName)
    }),
    //connect(state$, formStateSelector)
    connect(state$, fStateSelector(formName)(selector))
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
