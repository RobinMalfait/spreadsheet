import { describe, expect, it } from 'vitest'
import { Expression, Spreadsheet, Value } from './spreadsheet'

describe('value', () => {
  it('should be possible to set and read a static value', () => {
    const spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', Value.of(100))

    expect(spreadsheet.compute('A1')).toEqual(100)
  })
})

describe('expressions', () => {
  describe('SUM', () => {
    it('should SUM a list of numbers', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Expression.of('SUM(1,2,3)'))

      expect(spreadsheet.compute('A1')).toEqual(1 + 2 + 3)
    })

    it('should SUM a list of cells', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('A2', Value.of(200))
      spreadsheet.set('A3', Expression.of('SUM(A1,A2)'))

      expect(spreadsheet.compute('A3')).toEqual(100 + 200)
    })

    it('should SUM a range of cells (vertical)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('A2', Value.of(200))
      spreadsheet.set('A3', Value.of(300))
      spreadsheet.set('A4', Expression.of('SUM(A1:A3)'))

      expect(spreadsheet.compute('A4')).toEqual(100 + 200 + 300)
    })

    it('should SUM a range of cells (horizontal)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('B1', Value.of(200))
      spreadsheet.set('C1', Value.of(300))
      spreadsheet.set('A2', Expression.of('SUM(A1:C1)'))

      expect(spreadsheet.compute('A2')).toEqual(100 + 200 + 300)
    })

    it('should SUM a range of cells (block)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('B1', Value.of(200))
      spreadsheet.set('C1', Value.of(300))
      spreadsheet.set('A2', Value.of(400))
      spreadsheet.set('B2', Value.of(500))
      spreadsheet.set('C2', Value.of(600))

      spreadsheet.set('A3', Expression.of('SUM(A1:C2)'))

      expect(spreadsheet.compute('A3')).toEqual(100 + 200 + 300 + 400 + 500 + 600)
    })

    it('should SUM a range of cells (block, overlapping ranges)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('B1', Value.of(200))
      spreadsheet.set('C1', Value.of(300))
      spreadsheet.set('A2', Value.of(400))
      spreadsheet.set('A3', Value.of(500))
      spreadsheet.set('A4', Value.of(600))

      spreadsheet.set('A5', Expression.of('SUM(A1:C1,A1:A4)'))

      // A1:C1
      const horizontal = 100 + 200 + 300
      // A1:A4
      const vertical = 100 + 400 + 500 + 600

      expect(spreadsheet.compute('A5')).toEqual(horizontal + vertical)
    })

    it('should be possible to calculate a simple expression', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('A2', Value.of(200))
      spreadsheet.set('A3', Expression.of('SUM(A1,A2)'))
      spreadsheet.set('A4', Expression.of('SUM(A1:A2)'))

      expect(spreadsheet.compute('A3')).toEqual(300)
      expect(spreadsheet.compute('A4')).toEqual(300)
    })
  })

  describe('PRODUCT', () => {
    it('should PRODUCT a list of numbers', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Expression.of('PRODUCT(1,2,3)'))

      expect(spreadsheet.compute('A1')).toEqual(1 * 2 * 3)
    })

    it('should PRODUCT a list of cells', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('A2', Value.of(200))
      spreadsheet.set('A3', Expression.of('PRODUCT(A1,A2)'))

      expect(spreadsheet.compute('A3')).toEqual(100 * 200)
    })

    it('should PRODUCT a range of cells (vertical)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('A2', Value.of(200))
      spreadsheet.set('A3', Value.of(300))
      spreadsheet.set('A4', Expression.of('PRODUCT(A1:A3)'))

      expect(spreadsheet.compute('A4')).toEqual(100 * 200 * 300)
    })

    it('should PRODUCT a range of cells (horizontal)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('B1', Value.of(200))
      spreadsheet.set('C1', Value.of(300))
      spreadsheet.set('A2', Expression.of('PRODUCT(A1:C1)'))

      expect(spreadsheet.compute('A2')).toEqual(100 * 200 * 300)
    })

    it('should PRODUCT a range of cells (block)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('B1', Value.of(200))
      spreadsheet.set('C1', Value.of(300))
      spreadsheet.set('A2', Value.of(400))
      spreadsheet.set('B2', Value.of(500))
      spreadsheet.set('C2', Value.of(600))

      spreadsheet.set('A3', Expression.of('PRODUCT(A1:C2)'))

      expect(spreadsheet.compute('A3')).toEqual(100 * 200 * 300 * 400 * 500 * 600)
    })

    it('should PRODUCT a range of cells (block, overlapping ranges)', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('B1', Value.of(200))
      spreadsheet.set('C1', Value.of(300))
      spreadsheet.set('A2', Value.of(400))
      spreadsheet.set('A3', Value.of(500))
      spreadsheet.set('A4', Value.of(600))

      spreadsheet.set('A5', Expression.of('PRODUCT(A1:C1,A1:A4)'))

      // A1:C1
      const horizontal = 100 * 200 * 300
      // A1:A4
      const vertical = 100 * 400 * 500 * 600

      expect(spreadsheet.compute('A5')).toEqual(horizontal * vertical)
    })

    it('should be possible to calculate a simple expression', () => {
      const spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', Value.of(100))
      spreadsheet.set('A2', Value.of(200))
      spreadsheet.set('A3', Expression.of('PRODUCT(A1,A2)'))
      spreadsheet.set('A4', Expression.of('PRODUCT(A1:A2)'))

      expect(spreadsheet.compute('A3')).toEqual(100 * 200)
      expect(spreadsheet.compute('A4')).toEqual(100 * 200)
    })
  })
})
