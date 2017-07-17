import React, { Component } from 'react'
import connect from './connect.js'
//import { action } from './stream.js'
import compose from '../utils/compose'
import withFunctions from './withFunctions'

const formActionCreator = type => dispatch =>
  dispatch(payload => ({ type, payload }))

// forms actions
const formMount    = formActionCreator('@@EXO/FORM_MOUNTED')
const formChange   = formActionCreator('@@EXO/FORM_CHANGED')
const formError    = formActionCreator('@@EXO/FORM_ERROR')
const formSubmit   = formActionCreator('@@EXO/FORM_SUBMITED')
const formUnmount  = formActionCreator('@@EXO/FORM_UNMOUNTED')

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

const fieldChange = dispatch => (formName, validate) => props => event => {
  const { name, value } = event.target
  formChange(dispatch)({ formName, formField: { [name]: value }})
  validate && formError(dispatch)({ formName, errors: validate(props[formName]) })
}

const fileFieldChange = dispatch => (formName, validate) => props => event => {
  const { name, files } = event.target
  formChange(dispatch)({ formName, formField: { [name]: files[0] } })
  validate && formError(dispatch)({ formName, errors: validate({ [name]: files[0] }) })
}

const submit = dispatch => formName => props => cb => {
  formSubmit(dispatch)({ formName })
  cb()
}

// const formStateSelector = state =>
//   selector
//     ? Object.assign({}, selector(state), { [formName]: state.forms[formName] })
//     : { [formName]: state.forms[formName] }

const withFormState = (formName, validate) => (state$, dispatch, selector) => Wrapped => {
  const enhance = compose(
    withFunctions({
      onFieldChange: fieldChange(dispatch)(formName, validate),
      onFileFieldChange: fileFieldChange(dispatch)(formName, validate),
      onSubmit: submit(dispatch)(formName)
    }),
    //connect(state$, formStateSelector)
    connect(state$, fStateSelector(formName)(selector))
  )

  class WFormState extends Component {
    componentWillMount() {
      formMount(dispatch)({ formName })
    }
    componentWillUnmount() {
      formUnmount(dispatch)({ formName })
    }
    render() {
      return <Wrapped { ...this.props }/>
    }
  }

  return enhance(WFormState)
}

export default withFormState
