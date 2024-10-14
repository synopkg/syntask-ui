import { State } from '@prefecthq/prefect-design'
import { SchemaValueError, isNotStringError, isSchemaValueIndexError, isSchemaValuePropertyError } from '@/schemas/types/schemaValuesValidationResponse'
import { isString } from '@/utilities/strings'

export function getSchemaPropertyErrors(propertyKeyOrIndex: string | number, errors: SchemaValueError[]): SchemaValueError[] {
  if (isString(propertyKeyOrIndex)) {
    return errors.filter(isSchemaValuePropertyError).filter(error => error.property === propertyKeyOrIndex).flatMap(error => error.errors)
  }

  return errors.filter(isSchemaValueIndexError).filter(error => error.index == propertyKeyOrIndex).flatMap(error => error.errors)
}

export type SchemaPropertyError = {
  state: State,
  message: string | undefined,
}

export function getSchemaPropertyError(errors: SchemaValueError[]): SchemaPropertyError {
  const propertyErrors = errors.filter(isString)
  const state: State = { pending: false, valid: true, validated: true }

  if (propertyErrors.length) {
    state.valid = false
    return {
      state,
      message: propertyErrors.join(' and '),
    }
  }

  return {
    state,
    message: undefined,
  }
}

export function getAllSchemaPropertyErrors(errors: SchemaValueError[]): SchemaValueError[] {
  const propertyErrors = getAllRootSchemaPropertyErrors(errors)
  const childErrors = getAllChildSchemaPropertyErrors(errors)

  return [...propertyErrors, ...childErrors]
}

export function getAllRootSchemaPropertyErrors(errors: SchemaValueError[]): SchemaValueError[] {
  return errors.filter(isString)
}

export function getAllChildSchemaPropertyErrors(errors: SchemaValueError[]): SchemaValueError[] {
  return errors.filter(isNotStringError)
}