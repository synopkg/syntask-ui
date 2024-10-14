import { isDefined } from '@prefecthq/prefect-design'
import { Simplify } from '@/types/utilities'
import { createTuple } from '@/utilities'

export const { values: schemaTypes, isValue: isSchemaType } = createTuple([
  'null',
  'string',
  'boolean',
  'integer',
  'number',
  'array',
  'object',
])

export type SchemaPropertyType = typeof schemaTypes[number]

export function isSchemaPropertyType<T extends SchemaPropertyType | undefined>(value: unknown, type: T): value is T {
  return value === type
}

export const { isValue: isSchemaPropertyPrimitiveType } = createTuple([
  'string',
  'boolean',
  'integer',
  'number',
])

export const { values: schemaStringFormat, isValue: isSchemaStringFormat } = createTuple([
  'date',
  'date-time',
  'password',
  'json-string',
])

export type SchemaStringFormat = typeof schemaStringFormat[number]
export type SchemaDefinition = `#/definitions/${string}`
export type SchemaProperties = Record<string, SchemaProperty>
export type SchemaDefinitions = Record<string, SchemaProperty>

export type SchemaProperty = {
  // prefect specific properties
  position?: number,
  blockTypeSlug?: string,

  // open api properties
  $ref?: SchemaDefinition,
  anyOf?: SchemaProperty[],
  allOf?: SchemaProperty[],
  example?: string,
  default?: unknown,
  const?: unknown,
  description?: string,
  enum?: unknown[],
  format?: SchemaStringFormat,
  // SchemaProperty[] isn't valid according to the json specification but pydantic v1 will produce this for enums
  items?: SchemaProperty | SchemaProperty[],
  prefixItems?: SchemaProperty[],
  properties?: SchemaProperties,
  required?: string[],
  title?: string,
  type?: SchemaPropertyType,
  minItems?: number,
  maxItems?: number,
}

export function isSchemaProperty(value: SchemaProperty | SchemaProperty[] | undefined): value is SchemaProperty {
  return isDefined(value) && !Array.isArray(value)
}

export function isPropertyWith<
  TKey extends keyof SchemaProperty
>(value: SchemaProperty, property: TKey): value is Simplify<SchemaProperty & Required<Pick<SchemaProperty, TKey>>> {
  return isDefined(value[property])
}

export type Schema = SchemaProperty & {
  definitions?: SchemaDefinitions,
}