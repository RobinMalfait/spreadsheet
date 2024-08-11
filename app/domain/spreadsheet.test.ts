import { describe, expect, it } from 'vitest'
import { Spreadsheet } from './spreadsheet'

const json = String.raw

describe('value', () => {
  it('should be possible to set and read a static value', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '123')

    expect(spreadsheet.compute('A1')).toMatchInlineSnapshot(json`
      {
        "kind": "VALUE",
        "value": {
          "kind": "NUMBER",
          "value": 123,
        },
      }
    `)
  })
})

describe('expressions', () => {
  describe('SUM', () => {
    it('should SUM a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=SUM(1, 2, 3)')

      expect(spreadsheet.compute('A1')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 6,
          },
        }
      `)
    })

    it('should SUM a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=SUM(A1, A2)')

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 300,
          },
        }
      `)
    })

    it('should SUM a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=SUM(A1:A3)')

      expect(spreadsheet.compute('A4')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 600,
          },
        }
      `)
    })

    it('should SUM a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=SUM(A1:C1)')

      expect(spreadsheet.compute('A2')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 600,
          },
        }
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

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 2100,
          },
        }
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

      spreadsheet.set('A5', '=SUM(A1:C1, A1:A4)')

      expect(spreadsheet.compute('A5')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 2200,
          },
        }
      `)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=SUM(A1, A2)')
      spreadsheet.set('A4', '=SUM(A1:A2)')

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 300,
          },
        }
      `)
      expect(spreadsheet.compute('A4')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 300,
          },
        }
      `)
    })
  })

  describe('PRODUCT', () => {
    it('should PRODUCT a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=PRODUCT(1, 2, 3)')

      expect(spreadsheet.compute('A1')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 6,
          },
        }
      `)
    })

    it('should PRODUCT a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=PRODUCT(A1, A2)')

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 20000,
          },
        }
      `)
    })

    it('should PRODUCT a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=PRODUCT(A1:A3)')

      expect(spreadsheet.compute('A4')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 6000000,
          },
        }
      `)
    })

    it('should PRODUCT a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=PRODUCT(A1:C1)')

      expect(spreadsheet.compute('A2')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 6000000,
          },
        }
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

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 720000000000000,
          },
        }
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

      expect(spreadsheet.compute('A5')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 72000000000000000,
          },
        }
      `)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=PRODUCT(A1,A2)')
      spreadsheet.set('A4', '=PRODUCT(A1:A2)')

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 20000,
          },
        }
      `)
      expect(spreadsheet.compute('A4')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 20000,
          },
        }
      `)
    })
  })

  describe('AVERAGE', () => {
    it('should AVERAGE a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=AVERAGE(1, 2, 3)')

      expect(spreadsheet.compute('A1')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 2,
          },
        }
      `)
    })

    it('should AVERAGE a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=AVERAGE(A1, A2)')

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 150,
          },
        }
      `)
    })

    it('should AVERAGE a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=AVERAGE(A1:A3)')

      expect(spreadsheet.compute('A4')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 200,
          },
        }
      `)
    })

    it('should AVERAGE a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=AVERAGE(A1:C1)')

      expect(spreadsheet.compute('A2')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 200,
          },
        }
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

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 350,
          },
        }
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

      expect(spreadsheet.compute('A5')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 314.2857142857143,
          },
        }
      `)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=AVERAGE(A1,A2)')
      spreadsheet.set('A4', '=AVERAGE(A1:A2)')

      expect(spreadsheet.compute('A3')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 150,
          },
        }
      `)
      expect(spreadsheet.compute('A4')).toMatchInlineSnapshot(json`
        {
          "kind": "VALUE",
          "value": {
            "kind": "NUMBER",
            "value": 150,
          },
        }
      `)
    })
  })
})
