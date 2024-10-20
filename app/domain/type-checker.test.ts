import { expect, it } from 'vitest'
import { parse } from './signature/parser'
import { tokenize } from './signature/tokenizer'
import { Spreadsheet } from './spreadsheet'
import { matchesTypes } from './type-checker'

it.each([
  // Strings
  ['x(y: T)', 'string', true],
  ['x(y: STRING)', 'string', true],
  ['x(y: NUMBER)', 'string', false],
  ['x(y: BOOLEAN)', 'string', false],
  ['x(y: DATETIME)', 'string', false],
  ['x(y: STRING[])', 'string', false],
  ['x(y: STRING[][])', 'string', false],
  ['x(y: T[])', 'string', false],
  ['x(y: T[][])', 'string', false],

  // Strings — union type
  ['x(y: T | STRING)', 'string', true],
  ['x(y: NUMBER | STRING)', 'string', true],
  ['x(y: BOOLEAN | STRING)', 'string', true],
  ['x(y: DATETIME | STRING)', 'string', true],

  // Number
  ['x(y: T)', 123, true],
  ['x(y: STRING)', 123, false],
  ['x(y: NUMBER)', 123, true],
  ['x(y: BOOLEAN)', 123, false],
  ['x(y: DATETIME)', 123, false],
  ['x(y: STRING[])', 123, false],
  ['x(y: STRING[][])', 123, false],
  ['x(y: T[])', 123, false],
  ['x(y: T[][])', 123, false],

  // Number — union type
  ['x(y: T | NUMBER)', 123, true],
  ['x(y: STRING | NUMBER)', 123, true],
  ['x(y: BOOLEAN | NUMBER)', 123, true],
  ['x(y: DATETIME | NUMBER)', 123, true],

  // Boolean
  ['x(y: T)', '=TRUE()', true],
  ['x(y: STRING)', '=TRUE()', false],
  ['x(y: NUMBER)', '=TRUE()', false],
  ['x(y: BOOLEAN)', '=TRUE()', true],
  ['x(y: DATETIME)', '=TRUE()', false],
  ['x(y: STRING[])', '=TRUE()', false],
  ['x(y: STRING[][])', '=TRUE()', false],
  ['x(y: T[])', '=TRUE()', false],
  ['x(y: T[][])', '=TRUE()', false],

  // Boolean — union type
  ['x(y: T | BOOLEAN)', '=TRUE()', true],
  ['x(y: STRING | BOOLEAN)', '=TRUE()', true],
  ['x(y: DATETIME | BOOLEAN)', '=TRUE()', true],
])('should type check %s -> %j', (fn, expression, matches) => {
  // Evaluate the value of the expression
  let spreadsheet = new Spreadsheet()
  spreadsheet.set('A1', `${expression}`)
  let value = spreadsheet.evaluate('A1')

  // Figure out the types of the function
  let types = parse(tokenize(fn)).args.find((arg) => arg.name === 'y')?.types ?? []

  // Ensure everything matches as expected
  expect(matchesTypes(value, types)).toEqual(matches)
})
