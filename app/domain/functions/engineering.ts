import {
  EvaluationResultKind,
  type EvaluationResultNumber,
  type EvaluationResultString,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const BIN2DEC = expose(
  `
    @description Convert a binary number to decimal
    @example BIN2DEC(1101)
    BIN2DEC(value: STRING | NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    let binary = value.value.toString()
    if (!/^[01]+$/.test(binary)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'BIN2DEC() Invalid binary number',
      }
    }

    return {
      kind: EvaluationResultKind.NUMBER,
      value: Number.parseInt(binary, 2),
    }
  },
)

export const BIN2HEX = expose(
  `
    @description Convert a binary number to hexadecimal
    @example BIN2HEX(1101)
    BIN2HEX(value: STRING | NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    let binary = value.value.toString()
    if (!/^[01]+$/.test(binary)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'BIN2HEX() Invalid binary number',
      }
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: Number.parseInt(binary, 2).toString(16),
    }
  },
)

export const BIN2OCT = expose(
  `
    @description Convert a binary number to octal
    @example BIN2OCT(111111111)
    BIN2OCT(value: STRING | NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    let binary = value.value.toString()
    if (!/^[01]+$/.test(binary)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'BIN2OCT() Invalid binary number',
      }
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: Number.parseInt(binary, 2).toString(8),
    }
  },
)

export const DEC2BIN = expose(
  `
    @description Convert a decimal number to binary
    @example DEC2BIN(13)
    DEC2BIN(value: STRING | NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: value.value.toString(2),
    }
  },
)

export const DEC2OCT = expose(
  `
    @description Convert a decimal number to binary
    @example DEC2OCT(13)
    DEC2OCT(value: NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: value.value.toString(8),
    }
  },
)

export const DEC2HEX = expose(
  `
    @description Convert a decimal number to binary
    @example DEC2HEX(13)
    DEC2HEX(value: NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: value.value.toString(16),
    }
  },
)

export const HEX2BIN = expose(
  `
    @description Convert a decimal number to binary
    @example HEX2BIN("FF")
    @example HEX2BIN("1234")
    HEX2BIN(value: STRING | NUMBER)
  `,
  (value: EvaluationResultString | EvaluationResultNumber) => {
    let hex = value.value.toString()
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'HEX2BIN() Invalid hexadecimal number',
      }
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: Number.parseInt(hex, 16).toString(2),
    }
  },
)

export const HEX2DEC = expose(
  `
    @description Convert a decimal number to binary
    @example HEX2DEC("FF")
    @example HEX2DEC("1234")
    HEX2DEC(value: STRING | NUMBER)
  `,
  (value: EvaluationResultString | EvaluationResultNumber) => {
    let hex = value.value.toString()
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'HEX2DEC() Invalid hexadecimal number',
      }
    }

    return {
      kind: EvaluationResultKind.NUMBER,
      value: Number.parseInt(hex, 16),
    }
  },
)

export const HEX2OCT = expose(
  `
    @description Convert a decimal number to binary
    @example HEX2OCT("FF")
    @example HEX2OCT("1234")
    HEX2OCT(value: STRING | NUMBER)
  `,
  (value: EvaluationResultString | EvaluationResultNumber) => {
    let hex = value.value.toString()
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'HEX2OCT() Invalid hexadecimal number',
      }
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: Number.parseInt(hex, 16).toString(8),
    }
  },
)

export const OCT2BIN = expose(
  `
    @description Convert a decimal number to binary
    @example OCT2BIN(777)
    OCT2BIN(value: STRING | NUMBER)
  `,
  (value: EvaluationResultString | EvaluationResultNumber) => {
    let oct = value.value.toString()
    if (!/^[0-7]+$/.test(oct)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'OCT2BIN() Invalid octal number',
      }
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: Number.parseInt(oct, 8).toString(2),
    }
  },
)

export const OCT2DEC = expose(
  `
    @description Convert an octal number to hexadecimal
    @example OCT2DEC(777)
    OCT2DEC(value: STRING | NUMBER)
  `,
  (value: EvaluationResultString | EvaluationResultNumber) => {
    let oct = value.value.toString()
    if (!/^[0-7]+$/.test(oct)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'OCT2DEC() Invalid octal number',
      }
    }

    return {
      kind: EvaluationResultKind.NUMBER,
      value: Number.parseInt(oct, 8),
    }
  },
)

export const OCT2HEX = expose(
  `
    @description Convert an octal number to hexadecimal
    @example OCT2HEX(777)
    OCT2HEX(value: STRING | NUMBER)
  `,
  (value: EvaluationResultString | EvaluationResultNumber) => {
    let oct = value.value.toString()
    if (!/^[0-7]+$/.test(oct)) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'OCT2HEX() Invalid octal number',
      }
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: Number.parseInt(oct, 8).toString(16),
    }
  },
)
