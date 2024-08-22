import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

const json = String.raw

describe('value', () => {
  it('should be possible to set and read a static value', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '123')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┐
      │   │ A   │
      ├───┼─────┤
      │ 1 │ 123 │
      └───┴─────┘
      "
    `)
  })
})

describe('expressions', () => {
  describe('SUM', () => {
    it('should SUM a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=SUM(1, 2, 3)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬───┐
        │   │ A │
        ├───┼───┤
        │ 1 │ 6 │
        └───┴───┘
        "
      `)
    })

    it('should SUM a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=SUM(A1, A2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┐
        │   │ A   │
        ├───┼─────┤
        │ 1 │ 100 │
        ├───┼─────┤
        │ 2 │ 200 │
        ├───┼─────┤
        │ 3 │ 300 │
        └───┴─────┘
        "
      `)
    })

    it('should SUM a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=SUM(A1:A3)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┐
        │   │ A   │
        ├───┼─────┤
        │ 1 │ 100 │
        ├───┼─────┤
        │ 2 │ 200 │
        ├───┼─────┤
        │ 3 │ 300 │
        ├───┼─────┤
        │ 4 │ 600 │
        └───┴─────┘
        "
      `)
    })

    it('should SUM a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=SUM(A1:C1)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┬─────┬─────┐
        │   │ A   │ B   │ C   │
        ├───┼─────┼─────┼─────┤
        │ 1 │ 100 │ 200 │ 300 │
        ├───┼─────┼─────┼─────┤
        │ 2 │ 600 │     │     │
        └───┴─────┴─────┴─────┘
        "
      `)
    })

    it('should SUM a range of cells (block)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '400')
      spreadsheet.set('B2', '500')
      spreadsheet.set('C2', '600')

      spreadsheet.set('A3', '=SUM(A1:C2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬──────┬─────┬─────┐
        │   │ A    │ B   │ C   │
        ├───┼──────┼─────┼─────┤
        │ 1 │ 100  │ 200 │ 300 │
        ├───┼──────┼─────┼─────┤
        │ 2 │ 400  │ 500 │ 600 │
        ├───┼──────┼─────┼─────┤
        │ 3 │ 2100 │     │     │
        └───┴──────┴─────┴─────┘
        "
      `)
    })

    it('should SUM a range of cells (block, overlapping ranges)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '400')
      spreadsheet.set('A3', '500')
      spreadsheet.set('A4', '600')

      spreadsheet.set('C4', '=SUM(A1:C1, A1:A4)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┬─────┬──────┐
        │   │ A   │ B   │ C    │
        ├───┼─────┼─────┼──────┤
        │ 1 │ 100 │ 200 │ 300  │
        ├───┼─────┼─────┼──────┤
        │ 2 │ 400 │     │      │
        ├───┼─────┼─────┼──────┤
        │ 3 │ 500 │     │      │
        ├───┼─────┼─────┼──────┤
        │ 4 │ 600 │     │ 2200 │
        └───┴─────┴─────┴──────┘
        "
      `)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=SUM(A1, A2)')
      spreadsheet.set('A4', '=SUM(A1:A2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┐
        │   │ A   │
        ├───┼─────┤
        │ 1 │ 100 │
        ├───┼─────┤
        │ 2 │ 200 │
        ├───┼─────┤
        │ 3 │ 300 │
        ├───┼─────┤
        │ 4 │ 300 │
        └───┴─────┘
        "
      `)
    })
  })

  describe('PRODUCT', () => {
    it('should PRODUCT a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=PRODUCT(1, 2, 3)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬───┐
        │   │ A │
        ├───┼───┤
        │ 1 │ 6 │
        └───┴───┘
        "
      `)
    })

    it('should PRODUCT a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=PRODUCT(A1, A2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬───────┐
        │   │ A     │
        ├───┼───────┤
        │ 1 │ 100   │
        ├───┼───────┤
        │ 2 │ 200   │
        ├───┼───────┤
        │ 3 │ 20000 │
        └───┴───────┘
        "
      `)
    })

    it('should PRODUCT a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=PRODUCT(A1:A3)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────────┐
        │   │ A       │
        ├───┼─────────┤
        │ 1 │ 100     │
        ├───┼─────────┤
        │ 2 │ 200     │
        ├───┼─────────┤
        │ 3 │ 300     │
        ├───┼─────────┤
        │ 4 │ 6000000 │
        └───┴─────────┘
        "
      `)
    })

    it('should PRODUCT a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=PRODUCT(A1:C1)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────────┬─────┬─────┐
        │   │ A       │ B   │ C   │
        ├───┼─────────┼─────┼─────┤
        │ 1 │ 100     │ 200 │ 300 │
        ├───┼─────────┼─────┼─────┤
        │ 2 │ 6000000 │     │     │
        └───┴─────────┴─────┴─────┘
        "
      `)
    })

    it('should PRODUCT a range of cells (block)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '400')
      spreadsheet.set('B2', '500')
      spreadsheet.set('C2', '600')

      spreadsheet.set('A3', '=PRODUCT(A1:C2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────────────────┬─────┬─────┐
        │   │ A               │ B   │ C   │
        ├───┼─────────────────┼─────┼─────┤
        │ 1 │ 100             │ 200 │ 300 │
        ├───┼─────────────────┼─────┼─────┤
        │ 2 │ 400             │ 500 │ 600 │
        ├───┼─────────────────┼─────┼─────┤
        │ 3 │ 720000000000000 │     │     │
        └───┴─────────────────┴─────┴─────┘
        "
      `)
    })

    it('should PRODUCT a range of cells (block, overlapping ranges)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '400')
      spreadsheet.set('A3', '500')
      spreadsheet.set('A4', '600')

      spreadsheet.set('A5', '=PRODUCT(A1:C1, A1:A4)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬───────────────────┬─────┬─────┐
        │   │ A                 │ B   │ C   │
        ├───┼───────────────────┼─────┼─────┤
        │ 1 │ 100               │ 200 │ 300 │
        ├───┼───────────────────┼─────┼─────┤
        │ 2 │ 400               │     │     │
        ├───┼───────────────────┼─────┼─────┤
        │ 3 │ 500               │     │     │
        ├───┼───────────────────┼─────┼─────┤
        │ 4 │ 600               │     │     │
        ├───┼───────────────────┼─────┼─────┤
        │ 5 │ 72000000000000000 │     │     │
        └───┴───────────────────┴─────┴─────┘
        "
      `)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=PRODUCT(A1,A2)')
      spreadsheet.set('A4', '=PRODUCT(A1:A2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬───────┐
        │   │ A     │
        ├───┼───────┤
        │ 1 │ 100   │
        ├───┼───────┤
        │ 2 │ 200   │
        ├───┼───────┤
        │ 3 │ 20000 │
        ├───┼───────┤
        │ 4 │ 20000 │
        └───┴───────┘
        "
      `)
    })
  })

  describe('AVERAGE', () => {
    it('should AVERAGE a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=AVERAGE(1, 2, 3)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬───┐
        │   │ A │
        ├───┼───┤
        │ 1 │ 2 │
        └───┴───┘
        "
      `)
    })

    it('should AVERAGE a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=AVERAGE(A1, A2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┐
        │   │ A   │
        ├───┼─────┤
        │ 1 │ 100 │
        ├───┼─────┤
        │ 2 │ 200 │
        ├───┼─────┤
        │ 3 │ 150 │
        └───┴─────┘
        "
      `)
    })

    it('should AVERAGE a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=AVERAGE(A1:A3)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┐
        │   │ A   │
        ├───┼─────┤
        │ 1 │ 100 │
        ├───┼─────┤
        │ 2 │ 200 │
        ├───┼─────┤
        │ 3 │ 300 │
        ├───┼─────┤
        │ 4 │ 200 │
        └───┴─────┘
        "
      `)
    })

    it('should AVERAGE a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=AVERAGE(A1:C1)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┬─────┬─────┐
        │   │ A   │ B   │ C   │
        ├───┼─────┼─────┼─────┤
        │ 1 │ 100 │ 200 │ 300 │
        ├───┼─────┼─────┼─────┤
        │ 2 │ 200 │     │     │
        └───┴─────┴─────┴─────┘
        "
      `)
    })

    it('should AVERAGE a range of cells (block)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '400')
      spreadsheet.set('B2', '500')
      spreadsheet.set('C2', '600')

      spreadsheet.set('A3', '=AVERAGE(A1:C2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┬─────┬─────┐
        │   │ A   │ B   │ C   │
        ├───┼─────┼─────┼─────┤
        │ 1 │ 100 │ 200 │ 300 │
        ├───┼─────┼─────┼─────┤
        │ 2 │ 400 │ 500 │ 600 │
        ├───┼─────┼─────┼─────┤
        │ 3 │ 350 │     │     │
        └───┴─────┴─────┴─────┘
        "
      `)
    })

    it('should AVERAGE a range of cells (block, overlapping ranges)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '400')
      spreadsheet.set('A3', '500')
      spreadsheet.set('A4', '600')

      spreadsheet.set('A5', '=AVERAGE(A1:C1, A1:A4)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬───────────────────┬─────┬─────┐
        │   │ A                 │ B   │ C   │
        ├───┼───────────────────┼─────┼─────┤
        │ 1 │ 100               │ 200 │ 300 │
        ├───┼───────────────────┼─────┼─────┤
        │ 2 │ 400               │     │     │
        ├───┼───────────────────┼─────┼─────┤
        │ 3 │ 500               │     │     │
        ├───┼───────────────────┼─────┼─────┤
        │ 4 │ 600               │     │     │
        ├───┼───────────────────┼─────┼─────┤
        │ 5 │ 314.2857142857143 │     │     │
        └───┴───────────────────┴─────┴─────┘
        "
      `)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=AVERAGE(A1,A2)')
      spreadsheet.set('A4', '=AVERAGE(A1:A2)')

      expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
        "
        ┌───┬─────┐
        │   │ A   │
        ├───┼─────┤
        │ 1 │ 100 │
        ├───┼─────┤
        │ 2 │ 200 │
        ├───┼─────┤
        │ 3 │ 150 │
        ├───┼─────┤
        │ 4 │ 150 │
        └───┴─────┘
        "
      `)
    })
  })

  describe('PI()', () => {
    it('should be possible to use PI())', () => {
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
})

describe('errors', () => {
  it('should not be possible to reference yourself directly', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=A1')

    expect(spreadsheet.evaluate('A1')).toMatchInlineSnapshot(json`
      {
        "kind": "ERROR",
        "value": "Circular reference detected in cell A1",
      }
    `)
  })

  it('should not be possible to reference a range directly', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=B1:C3')

    expect(spreadsheet.evaluate('A1')).toMatchInlineSnapshot(json`
      {
        "kind": "ERROR",
        "value": "Cannot reference a range to a cell",
      }
    `)
  })

  it('should not be possible to reference yourself indirectly', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUM(A1, 1)')

    expect(spreadsheet.evaluate('A1')).toMatchInlineSnapshot(json`
      {
        "kind": "ERROR",
        "value": "Circular reference detected in cell A1",
      }
    `)
  })

  it('should not be possible to reference yourself indirectly via a range', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A2', '=SUM(A1:A3)')

    expect(spreadsheet.evaluate('A2')).toMatchInlineSnapshot(json`
      {
        "kind": "ERROR",
        "value": "Circular reference detected in cell A2",
      }
    `)
  })

  it('should not be possible to reference yourself indirectly via a range', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A2', '=SUM(A1:A3)')

    expect(spreadsheet.evaluate('A2')).toMatchInlineSnapshot(json`
      {
        "kind": "ERROR",
        "value": "Circular reference detected in cell A2",
      }
    `)
  })

  it('should not be possible to reference yourself via another cell', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUM(A2, 1)')
    spreadsheet.set('A2', '=SUM(A3, 1)')
    spreadsheet.set('A3', '=SUM(A1, 1)')

    expect(spreadsheet.evaluate('A1')).toMatchInlineSnapshot(json`
      {
        "kind": "ERROR",
        "value": "Circular reference detected in cell A3",
      }
    `)
  })
})
