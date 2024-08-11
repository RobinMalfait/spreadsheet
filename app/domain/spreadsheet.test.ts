import { describe, expect, it } from 'vitest'
import { Spreadsheet } from './spreadsheet'

describe('value', () => {
  it('should be possible to set and read a static value', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '123')

    expect(spreadsheet.compute('A1')).toEqual(123)
  })
})

describe('expressions', () => {
  describe('SUM', () => {
    it('should SUM a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=SUM(1, 2, 3)')

      expect(spreadsheet.compute('A1')).toEqual(1 + 2 + 3)
    })

    it('should SUM a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=SUM(A1, A2)')

      expect(spreadsheet.compute('A3')).toEqual(100 + 200)
    })

    it('should SUM a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=SUM(A1:A3)')

      expect(spreadsheet.compute('A4')).toEqual(100 + 200 + 300)
    })

    it('should SUM a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=SUM(A1:C1)')

      expect(spreadsheet.compute('A2')).toEqual(100 + 200 + 300)
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

      expect(spreadsheet.compute('A3')).toEqual(100 + 200 + 300 + 400 + 500 + 600)
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

      // A1:C1
      let horizontal = 100 + 200 + 300
      // A1:A4
      let vertical = 100 + 400 + 500 + 600

      expect(spreadsheet.compute('A5')).toEqual(horizontal + vertical)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=SUM(A1, A2)')
      spreadsheet.set('A4', '=SUM(A1:A2)')

      expect(spreadsheet.compute('A3')).toEqual(300)
      expect(spreadsheet.compute('A4')).toEqual(300)
    })
  })

  describe('PRODUCT', () => {
    it('should PRODUCT a list of numbers', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '=PRODUCT(1, 2, 3)')

      expect(spreadsheet.compute('A1')).toEqual(1 * 2 * 3)
    })

    it('should PRODUCT a list of cells', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=PRODUCT(A1, A2)')

      expect(spreadsheet.compute('A3')).toEqual(100 * 200)
    })

    it('should PRODUCT a range of cells (vertical)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '300')
      spreadsheet.set('A4', '=PRODUCT(A1:A3)')

      expect(spreadsheet.compute('A4')).toEqual(100 * 200 * 300)
    })

    it('should PRODUCT a range of cells (horizontal)', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('B1', '200')
      spreadsheet.set('C1', '300')
      spreadsheet.set('A2', '=PRODUCT(A1:C1)')

      expect(spreadsheet.compute('A2')).toEqual(100 * 200 * 300)
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

      expect(spreadsheet.compute('A3')).toEqual(100 * 200 * 300 * 400 * 500 * 600)
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

      // A1:C1
      let horizontal = 100 * 200 * 300
      // A1:A4
      let vertical = 100 * 400 * 500 * 600

      expect(spreadsheet.compute('A5')).toEqual(horizontal * vertical)
    })

    it('should be possible to calculate a simple expression', () => {
      let spreadsheet = new Spreadsheet()
      spreadsheet.set('A1', '100')
      spreadsheet.set('A2', '200')
      spreadsheet.set('A3', '=PRODUCT(A1,A2)')
      spreadsheet.set('A4', '=PRODUCT(A1:A2)')

      expect(spreadsheet.compute('A3')).toEqual(100 * 200)
      expect(spreadsheet.compute('A4')).toEqual(100 * 200)
    })
  })
})
