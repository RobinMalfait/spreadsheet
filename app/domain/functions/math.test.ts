import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

describe('PI()', () => {
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: PI() does not take any arguments
      "
    `)
  })

  it('should result in the value of PI', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ 3.141592653589793 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('TAU()', () => {
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TAU(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TAU() does not take any arguments
      "
    `)
  })

  it('should result in the value of TAU', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TAU()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ 6.283185307179586 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('ABS', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ABS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ABS(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ABS(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ABS(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ABS(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ABS(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the absolute value of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=-12')
    spreadsheet.set('A2', '=ABS(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┐
      │   │ A   │
      ├───┼─────┤
      │ 1 │ -12 │
      ├───┼─────┤
      │ 2 │ 12  │
      └───┴─────┘
      "
    `)
  })
})

describe('ACOS', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ACOS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ACOS(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ACOS(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ACOS(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ACOS(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ACOS(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the inverse cosine (in radians) of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=-1')
    spreadsheet.set('A2', '=ACOS(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ -1                │
      ├───┼───────────────────┤
      │ 2 │ 3.141592653589793 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('ACOSH', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ACOSH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ACOSH(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ACOSH(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ACOSH(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ACOSH(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ACOSH(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the inverse hyperbolic cosine of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2.5')
    spreadsheet.set('A2', '=ACOSH(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ 2.5               │
      ├───┼───────────────────┤
      │ 2 │ 1.566799236972411 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('ASIN', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ASIN()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ASIN(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ASIN(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ASIN(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ASIN(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ASIN(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the inverse sine (in radians) of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=ASIN(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 1                  │
      ├───┼────────────────────┤
      │ 2 │ 1.5707963267948966 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('ASINH', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ASINH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ASINH(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ASINH(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ASINH(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ASINH(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ASINH(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the inverse hyperbolic sine of a number.', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('A2', '=ASINH(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 2                  │
      ├───┼────────────────────┤
      │ 2 │ 1.4436354751788103 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('ATAN', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the inverse tangent (in radians) of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=ATAN(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 1                  │
      ├───┼────────────────────┤
      │ 2 │ 0.7853981633974483 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('ATANH', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATANH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATANH(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATANH(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATANH(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATANH(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATANH(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the inverse hyperbolic tangent of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=ATANH(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────────┐
      │   │ A        │
      ├───┼──────────┤
      │ 1 │ 1        │
      ├───┼──────────┤
      │ 2 │ Infinity │
      └───┴──────────┘
      "
    `)
  })
})

describe('CBRT', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CBRT()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CBRT(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CBRT(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CBRT(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CBRT(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CBRT(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the cube root of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('A2', '=CBRT(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 2                  │
      ├───┼────────────────────┤
      │ 2 │ 1.2599210498948732 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('CLZ32', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CLZ32()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CLZ32(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CLZ32(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CLZ32(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CLZ32(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CLZ32(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the number of leading zero bits in the 32-bit binary representation of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2 ^ 24')
    spreadsheet.set('A2', '=CLZ32(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────────┐
      │   │ A        │
      ├───┼──────────┤
      │ 1 │ 16777216 │
      ├───┼──────────┤
      │ 2 │ 7        │
      └───┴──────────┘
      "
    `)
  })
})

describe('COS', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=COS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: COS(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=COS(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: COS(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=COS(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: COS(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the cosine of a number in radians', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('A2', '=COS(2 * A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ 3.141592653589793 │
      ├───┼───────────────────┤
      │ 2 │ 1                 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('COSH', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=COSH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: COSH(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=COSH(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: COSH(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=COSH(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: COSH(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the hyperbolic cosine of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=COSH(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 1                  │
      ├───┼────────────────────┤
      │ 2 │ 1.5430806348152437 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('EXP', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=EXP()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: EXP(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=EXP(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: EXP(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=EXP(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: EXP(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the `e` raised to the power of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('A2', '=EXP(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────────────────┐
      │   │ A                │
      ├───┼──────────────────┤
      │ 1 │ 2                │
      ├───┼──────────────────┤
      │ 2 │ 7.38905609893065 │
      └───┴──────────────────┘
      "
    `)
  })
})

describe('LOG', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOG()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOG(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOG(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOG(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOG(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOG(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the natural logarithm (base `e`) of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=10')
    spreadsheet.set('A2', '=LOG(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ 10                │
      ├───┼───────────────────┤
      │ 2 │ 2.302585092994046 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('LOG10', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOG10()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOG10(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOG10(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOG10(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOG10(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOG10(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the base 10 logarithm of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=100000')
    spreadsheet.set('A2', '=LOG10(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────┐
      │   │ A      │
      ├───┼────────┤
      │ 1 │ 100000 │
      ├───┼────────┤
      │ 2 │ 5      │
      └───┴────────┘
      "
    `)
  })
})

describe('SIN', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SIN()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SIN(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SIN(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SIN(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SIN(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SIN(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the sine of a number in radians', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=SIN(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 1                  │
      ├───┼────────────────────┤
      │ 2 │ 0.8414709848078965 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('SINH', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SINH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SINH(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SINH(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SINH(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SINH(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SINH(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the hyperbolic sine of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=SINH(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 1                  │
      ├───┼────────────────────┤
      │ 2 │ 1.1752011936438014 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('SQRT', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SQRT()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SQRT(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SQRT(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SQRT(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SQRT(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SQRT(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the square root of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=144')
    spreadsheet.set('A2', '=SQRT(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┐
      │   │ A   │
      ├───┼─────┤
      │ 1 │ 144 │
      ├───┼─────┤
      │ 2 │ 12  │
      └───┴─────┘
      "
    `)
  })
})

describe('TAN', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TAN()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TAN(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TAN(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TAN(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TAN(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TAN(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the tangent of a number in radians', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=TAN(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 1                  │
      ├───┼────────────────────┤
      │ 2 │ 1.5574077246549023 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('TANH', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TANH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TANH(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TANH(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TANH(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TANH(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TANH(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the hyperbolic tangent of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('A2', '=TANH(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┐
      │   │ A                  │
      ├───┼────────────────────┤
      │ 1 │ 1                  │
      ├───┼────────────────────┤
      │ 2 │ 0.7615941559557649 │
      └───┴────────────────────┘
      "
    `)
  })
})

describe('TRUNC', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRUNC()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TRUNC(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRUNC(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TRUNC(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRUNC(1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TRUNC(x: NUMBER) takes at most 1 argument, got 2
      "
    `)
  })

  it('should calculate the integer part of a number by removing any fractional digits', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=3.9')
    spreadsheet.set('A2', '=TRUNC(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┐
      │   │ A   │
      ├───┼─────┤
      │ 1 │ 3.9 │
      ├───┼─────┤
      │ 2 │ 3   │
      └───┴─────┘
      "
    `)
  })
})

describe('ATAN2', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN2()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN2(y: NUMBER, x: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN2(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN2(y: NUMBER, x: NUMBER) Argument \`y\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN2(90)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN2(y: NUMBER, x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type (but the second one is)', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN2(TRUE(), 90)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN2(y: NUMBER, x: NUMBER) Argument \`y\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN2(90, TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN2(y: NUMBER, x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ATAN2(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ATAN2(y: NUMBER, x: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should calculate the angle in the plane (in radians) between the positive x-axis and the ray from (0, 0) to the point (x, y)', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=90')
    spreadsheet.set('B1', '=15')
    spreadsheet.set('A2', '=ATAN2(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────────┬────┐
      │   │ A                  │ B  │
      ├───┼────────────────────┼────┤
      │ 1 │ 90                 │ 15 │
      ├───┼────────────────────┼────┤
      │ 2 │ 1.4056476493802699 │    │
      └───┴────────────────────┴────┘
      "
    `)
  })
})

describe('IMUL', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IMUL()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IMUL(x: NUMBER, y: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IMUL(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IMUL(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IMUL(90)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IMUL(x: NUMBER, y: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type (but the second one is)', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IMUL(TRUE(), 90)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IMUL(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IMUL(90, TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IMUL(x: NUMBER, y: NUMBER) Argument \`y\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IMUL(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IMUL(x: NUMBER, y: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should calculate the result of the C-like 32-bit multiplication of the two parameter', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2^32-2')
    spreadsheet.set('B1', '=5')
    spreadsheet.set('A2', '=IMUL(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────┬───┐
      │   │ A          │ B │
      ├───┼────────────┼───┤
      │ 1 │ 4294967294 │ 5 │
      ├───┼────────────┼───┤
      │ 2 │ -10        │   │
      └───┴────────────┴───┘
      "
    `)
  })
})

describe('SUM()', () => {
  it('should error when nothing is provided to the SUM() function', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUM()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUM(...values: T) Argument \`values\` was not provided
      "
    `)
  })

  it('should sum up all the numbers of empty cells', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUM(B1:D1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 0 │
      └───┴───┘
      "
    `)
  })

  it('should sum up all the numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=4')
    spreadsheet.set('C1', '=6')
    spreadsheet.set('A2', '=SUM(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┬───┐
      │   │ A  │ B │ C │
      ├───┼────┼───┼───┤
      │ 1 │ 2  │ 4 │ 6 │
      ├───┼────┼───┼───┤
      │ 2 │ 12 │   │   │
      └───┴────┴───┴───┘
      "
    `)
  })

  it('should ignore non-number types', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('A2', '=SUM(A1:C1, 4, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬──────┐
      │   │ A │ B │ C    │
      ├───┼───┼───┼──────┤
      │ 1 │ 2 │ 3 │ TRUE │
      ├───┼───┼───┼──────┤
      │ 2 │ 9 │   │      │
      └───┴───┴───┴──────┘
      "
    `)
  })
})

describe('ADD()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD(x: NUMBER, y: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD(x: NUMBER, y: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD(TRUE(), FALSE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD(x: NUMBER, y: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should add two numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=12')
    spreadsheet.set('B1', '=6')
    spreadsheet.set('A2', '=ADD(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┐
      │   │ A  │ B │
      ├───┼────┼───┤
      │ 1 │ 12 │ 6 │
      ├───┼────┼───┤
      │ 2 │ 18 │   │
      └───┴────┴───┘
      "
    `)
  })
})

describe('SUBTRACT()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUBTRACT()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUBTRACT(x: NUMBER, y: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUBTRACT(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUBTRACT(x: NUMBER, y: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUBTRACT(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUBTRACT(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUBTRACT(TRUE(), FALSE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUBTRACT(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUBTRACT(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUBTRACT(x: NUMBER, y: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should subtract two numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=12')
    spreadsheet.set('B1', '=6')
    spreadsheet.set('A2', '=SUBTRACT(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┐
      │   │ A  │ B │
      ├───┼────┼───┤
      │ 1 │ 12 │ 6 │
      ├───┼────┼───┤
      │ 2 │ 6  │   │
      └───┴────┴───┘
      "
    `)
  })
})

describe('MULTIPLY()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MULTIPLY()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MULTIPLY(x: NUMBER, y: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MULTIPLY(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MULTIPLY(x: NUMBER, y: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MULTIPLY(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MULTIPLY(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MULTIPLY(TRUE(), FALSE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MULTIPLY(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MULTIPLY(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MULTIPLY(x: NUMBER, y: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should multiply two numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('A2', '=MULTIPLY(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┐
      │   │ A │ B │
      ├───┼───┼───┤
      │ 1 │ 2 │ 3 │
      ├───┼───┼───┤
      │ 2 │ 6 │   │
      └───┴───┴───┘
      "
    `)
  })
})

describe('PRODUCT()', () => {
  it('should error when nothing is provided to the PRODUCT() function', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PRODUCT()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: PRODUCT(...values: T) Argument \`values\` was not provided
      "
    `)
  })

  it('should multiply all the numbers of empty cells', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PRODUCT(B1:D1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 0 │
      └───┴───┘
      "
    `)
  })

  it('should multiply all the numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=4')
    spreadsheet.set('A2', '=PRODUCT(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┬───┐
      │   │ A  │ B │ C │
      ├───┼────┼───┼───┤
      │ 1 │ 2  │ 3 │ 4 │
      ├───┼────┼───┼───┤
      │ 2 │ 24 │   │   │
      └───┴────┴───┴───┘
      "
    `)
  })

  it('should ignore non-number types', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('A2', '=PRODUCT(A1:C1, 4, NOW(), "foo")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┬──────┐
      │   │ A  │ B │ C    │
      ├───┼────┼───┼──────┤
      │ 1 │ 2  │ 3 │ TRUE │
      ├───┼────┼───┼──────┤
      │ 2 │ 24 │   │      │
      └───┴────┴───┴──────┘
      "
    `)
  })
})

describe('DIVIDE()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIVIDE()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DIVIDE(x: NUMBER, y: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIVIDE(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DIVIDE(x: NUMBER, y: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIVIDE(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DIVIDE(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIVIDE(TRUE(), FALSE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DIVIDE(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIVIDE(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DIVIDE(x: NUMBER, y: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should error when the divisor evaluates to 0', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIVIDE(1, 0)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DIVIDE() cannot divide by zero
      "
    `)
  })

  it('should divide two numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=12')
    spreadsheet.set('B1', '=2')
    spreadsheet.set('A2', '=DIVIDE(A1:B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┐
      │   │ A  │ B │
      ├───┼────┼───┤
      │ 1 │ 12 │ 2 │
      ├───┼────┼───┤
      │ 2 │ 6  │   │
      └───┴────┴───┘
      "
    `)
  })
})

describe('POWER()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=POWER()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: POWER(x: NUMBER, y: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=POWER(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: POWER(x: NUMBER, y: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=POWER(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: POWER(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=POWER(TRUE(), FALSE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: POWER(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=POWER(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: POWER(x: NUMBER, y: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should calculate the power of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=12')
    spreadsheet.set('B1', '=2')
    spreadsheet.set('A2', '=POWER(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┬───┐
      │   │ A   │ B │
      ├───┼─────┼───┤
      │ 1 │ 12  │ 2 │
      ├───┼─────┼───┤
      │ 2 │ 144 │   │
      └───┴─────┴───┘
      "
    `)
  })
})

describe('MOD()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MOD()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MOD(x: NUMBER, y: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the second required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MOD(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MOD(x: NUMBER, y: NUMBER) Argument \`y\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MOD(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MOD(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MOD(TRUE(), FALSE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MOD(x: NUMBER, y: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the second required argument is not the right type (but the first one is)', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MOD(1234, FALSE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MOD(x: NUMBER, y: NUMBER) Argument \`y\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MOD(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MOD(x: NUMBER, y: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should error when the divisor evaluates to 0', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MOD(1, 0)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MOD() cannot mod by zero
      "
    `)
  })

  it('should compute the modulo', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=13')
    spreadsheet.set('B1', '=10')
    spreadsheet.set('A2', '=MOD(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬────┐
      │   │ A  │ B  │
      ├───┼────┼────┤
      │ 1 │ 13 │ 10 │
      ├───┼────┼────┤
      │ 2 │ 3  │    │
      └───┴────┴────┘
      "
    `)
  })
})

describe('FLOOR()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FLOOR()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FLOOR(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FLOOR(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FLOOR(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FLOOR(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FLOOR(x: NUMBER) takes at most 1 argument, got 3
      "
    `)
  })

  it('should floor a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=FLOOR(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬───┐
      │   │ A                 │ B │
      ├───┼───────────────────┼───┤
      │ 1 │ 3.141592653589793 │ 3 │
      └───┴───────────────────┴───┘
      "
    `)
  })
})

describe('CEIL()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CEIL()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CEIL(x: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CEIL(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CEIL(x: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=CEIL(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: CEIL(x: NUMBER) takes at most 1 argument, got 3
      "
    `)
  })

  it('should ceil a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=CEIL(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬───┐
      │   │ A                 │ B │
      ├───┼───────────────────┼───┤
      │ 1 │ 3.141592653589793 │ 4 │
      └───┴───────────────────┴───┘
      "
    `)
  })
})

describe('ROUND()', () => {
  it('should error when the first required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ROUND()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ROUND(x: NUMBER, places?: NUMBER) Argument \`x\` was not provided
      "
    `)
  })

  it('should error when the first required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ROUND(TRUE())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ROUND(x: NUMBER, places?: NUMBER) Argument \`x\` received a \`BOOLEAN\`
      "
    `)
  })

  it('should error when the optional second argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ROUND(12.34, "what")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ROUND(x: NUMBER, places?: NUMBER) Argument \`places\` received a \`STRING\`
      "
    `)
  })

  it('should error when passing too many arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ROUND(1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ROUND(x: NUMBER, places?: NUMBER) takes at most 2 arguments, got 3
      "
    `)
  })

  it('should round a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=ROUND(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬───┐
      │   │ A                 │ B │
      ├───┼───────────────────┼───┤
      │ 1 │ 3.141592653589793 │ 3 │
      └───┴───────────────────┴───┘
      "
    `)
  })

  it('should round a number with 1 decimal of precision', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=ROUND(A1, 1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬─────┐
      │   │ A                 │ B   │
      ├───┼───────────────────┼─────┤
      │ 1 │ 3.141592653589793 │ 3.1 │
      └───┴───────────────────┴─────┘
      "
    `)
  })

  it('should round a number with 2 decimals of precision', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=ROUND(A1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬──────┐
      │   │ A                 │ B    │
      ├───┼───────────────────┼──────┤
      │ 1 │ 3.141592653589793 │ 3.14 │
      └───┴───────────────────┴──────┘
      "
    `)
  })
})
