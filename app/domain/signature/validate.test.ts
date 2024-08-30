import { expect, it } from 'vitest'
import { parse } from '~/domain/signature/parser'
import { tokenize } from '~/domain/signature/tokenizer'
import { validate } from '~/domain/signature/validate'
import { EvaluationResultKind } from '../evaluation-result'

const json = String.raw

it('should pass when signature does not expects arguments, and none are given', () => {
  expect(validate(parse(tokenize('PI()')), [])).toMatchInlineSnapshot(json`null`)
})

it('should error when argument is passed to function that does not expect arguments', () => {
  expect(
    validate(parse(tokenize('PI()')), [
      { kind: EvaluationResultKind.BOOLEAN, value: true },
    ]),
  ).toMatchInlineSnapshot(json`
    {
      "kind": "ERROR",
      "value": "PI() does not take any arguments",
    }
  `)
})

it('should error when argument is missing', () => {
  expect(validate(parse(tokenize('FOO(x: NUMBER)')), [])).toMatchInlineSnapshot(`
    {
      "kind": "ERROR",
      "value": "FOO(x: NUMBER) Argument \`x\` was not provided",
    }
  `)
})

it('should error when argument is provided, but of the wrong type', () => {
  expect(
    validate(parse(tokenize('FOO(x: NUMBER)')), [
      { kind: EvaluationResultKind.BOOLEAN, value: true },
    ]),
  ).toMatchInlineSnapshot(`
    {
      "kind": "ERROR",
      "value": "FOO(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`",
    }
  `)
})

it('should allow missing values for optional types', () => {
  expect(validate(parse(tokenize('FOO(x?: NUMBER)')), [])).toMatchInlineSnapshot(
    json`null`,
  )
})

it('should error if argument for optional type is incorrect', () => {
  expect(
    validate(parse(tokenize('FOO(x?: NUMBER)')), [
      { kind: EvaluationResultKind.BOOLEAN, value: true },
    ]),
  ).toMatchInlineSnapshot(`
    {
      "kind": "ERROR",
      "value": "FOO(x?: NUMBER) Argument \`x\` received a \`BOOLEAN\`",
    }
  `)
})

it('should allow arguments of a union type', () => {
  expect(
    validate(parse(tokenize('FOO(x: NUMBER | STRING)')), [
      { kind: EvaluationResultKind.NUMBER, value: 123 },
    ]),
  ).toMatchInlineSnapshot(json`null`)
  expect(
    validate(parse(tokenize('FOO(x: NUMBER | STRING)')), [
      { kind: EvaluationResultKind.STRING, value: 'hello world' },
    ]),
  ).toMatchInlineSnapshot(json`null`)
})

it('should error when argument does not match the union type', () => {
  expect(
    validate(parse(tokenize('FOO(x: NUMBER | STRING)')), [
      { kind: EvaluationResultKind.BOOLEAN, value: false },
    ]),
  ).toMatchInlineSnapshot(`
    {
      "kind": "ERROR",
      "value": "FOO(x: NUMBER | STRING) Argument \`x\` received a \`BOOLEAN\`",
    }
  `)
})

it('should error if required variadic type does not receive anything', () => {
  expect(validate(parse(tokenize('FOO(...values: NUMBER)')), [])).toMatchInlineSnapshot(`
    {
      "kind": "ERROR",
      "value": "FOO(...values: NUMBER) Argument \`values\` was not provided",
    }
  `)
})

it('should pass if required variadic type does receive a matching argument', () => {
  expect(
    validate(parse(tokenize('FOO(...values: NUMBER)')), [
      { kind: EvaluationResultKind.NUMBER, value: 123 },
    ]),
  ).toMatchInlineSnapshot(json`null`)
})

it('should pass if required variadic type receives many arguments of the correct type', () => {
  expect(
    validate(parse(tokenize('FOO(...values: NUMBER)')), [
      { kind: EvaluationResultKind.NUMBER, value: 123 },
      { kind: EvaluationResultKind.NUMBER, value: 456 },
      { kind: EvaluationResultKind.NUMBER, value: 789 },
    ]),
  ).toMatchInlineSnapshot(json`null`)
})

it('should error if any of the arguments for a variadic type is invalid', () => {
  expect(
    validate(parse(tokenize('FOO(...values: NUMBER)')), [
      { kind: EvaluationResultKind.NUMBER, value: 123 },
      { kind: EvaluationResultKind.NUMBER, value: 456 },
      { kind: EvaluationResultKind.NUMBER, value: 789 },
      { kind: EvaluationResultKind.BOOLEAN, value: true },
      { kind: EvaluationResultKind.NUMBER, value: 987 },
    ]),
  ).toMatchInlineSnapshot(`
    {
      "kind": "ERROR",
      "value": "FOO(...values: NUMBER) Argument \`values\` received a \`BOOLEAN\` as the 5th argument",
    }
  `)
})

it('should allow any argument for type T', () => {
  expect(
    validate(parse(tokenize('FOO(anything: T)')), [
      { kind: EvaluationResultKind.NUMBER, value: 123 },
    ]),
  ).toMatchInlineSnapshot(json`null`)
  expect(
    validate(parse(tokenize('FOO(anything: T)')), [
      { kind: EvaluationResultKind.STRING, value: 'hello world' },
    ]),
  ).toMatchInlineSnapshot(json`null`)
  expect(
    validate(parse(tokenize('FOO(anything: T)')), [
      { kind: EvaluationResultKind.BOOLEAN, value: true },
    ]),
  ).toMatchInlineSnapshot(json`null`)
})
