import { expect, it } from 'vitest'
import { visualizeSpreadsheet } from '~/test/utils'
import { Spreadsheet } from './spreadsheet'
import { VersionControl } from './version-control'

it('should be possible to commit a change', () => {
  let spreadsheet = new Spreadsheet()

  let vcs = new VersionControl((cell: string, value: string) => {
    let current = spreadsheet.get(cell)
    spreadsheet.set(cell, value)
    return [cell, current]
  })

  vcs.commit('A1', '1')
  vcs.commit('B1', '1')
  vcs.commit('C1', '1')
  vcs.commit('A2', '=SUM(A1:C1)')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┬───┐
    │   │ A │ B │ C │
    ├───┼───┼───┼───┤
    │ 1 │ 1 │ 1 │ 1 │
    ├───┼───┼───┼───┤
    │ 2 │ 3 │   │   │
    └───┴───┴───┴───┘
    "
  `)
})

it('should be possible to undo a change', () => {
  let spreadsheet = new Spreadsheet()

  let vcs = new VersionControl((cell: string, value: string) => {
    let current = spreadsheet.get(cell)
    spreadsheet.set(cell, value)
    return [cell, current]
  })

  vcs.commit('A1', '1')
  vcs.commit('B1', '1')
  vcs.commit('C1', '1')
  vcs.commit('A2', '=SUM(A1:C1)')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┬───┐
    │   │ A │ B │ C │
    ├───┼───┼───┼───┤
    │ 1 │ 1 │ 1 │ 1 │
    ├───┼───┼───┼───┤
    │ 2 │ 3 │   │   │
    └───┴───┴───┴───┘
    "
  `)

  vcs.undo()

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┬───┐
    │   │ A │ B │ C │
    ├───┼───┼───┼───┤
    │ 1 │ 1 │ 1 │ 1 │
    └───┴───┴───┴───┘
    "
  `)

  vcs.undo()

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┐
    │   │ A │ B │
    ├───┼───┼───┤
    │ 1 │ 1 │ 1 │
    └───┴───┴───┘
    "
  `)

  vcs.undo()
  vcs.undo()

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┐
    │   │ A │
    ├───┼───┤
    │ 1 │   │
    └───┴───┘
    "
  `)
})

it('should be possible to redo a change', () => {
  let spreadsheet = new Spreadsheet()

  let vcs = new VersionControl((cell: string, value: string) => {
    let current = spreadsheet.get(cell)
    spreadsheet.set(cell, value)
    return [cell, current]
  })

  vcs.commit('A2', '=SUM(A1:C1)')
  vcs.commit('A1', '1')
  vcs.commit('B1', '1')
  vcs.commit('C1', '1')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┬───┐
    │   │ A │ B │ C │
    ├───┼───┼───┼───┤
    │ 1 │ 1 │ 1 │ 1 │
    ├───┼───┼───┼───┤
    │ 2 │ 3 │   │   │
    └───┴───┴───┴───┘
    "
  `)

  vcs.undo()

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┐
    │   │ A │ B │
    ├───┼───┼───┤
    │ 1 │ 1 │ 1 │
    ├───┼───┼───┤
    │ 2 │ 2 │   │
    └───┴───┴───┘
    "
  `)

  vcs.undo()
  vcs.undo()
  vcs.undo()
  vcs.undo()
  vcs.undo()
  vcs.undo()

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┐
    │   │ A │
    ├───┼───┤
    │ 1 │   │
    └───┴───┘
    "
  `)

  vcs.redo()
  vcs.redo()
  vcs.redo()
  vcs.redo()
  vcs.redo()
  vcs.redo()
  vcs.redo()

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┬───┐
    │   │ A │ B │ C │
    ├───┼───┼───┼───┤
    │ 1 │ 1 │ 1 │ 1 │
    ├───┼───┼───┼───┤
    │ 2 │ 3 │   │   │
    └───┴───┴───┴───┘
    "
  `)
})

it('should be possible to checkout a specific commit', () => {
  let spreadsheet = new Spreadsheet()

  let vcs = new VersionControl((cell: string, value: string) => {
    let current = spreadsheet.get(cell)
    spreadsheet.set(cell, value)
    return [cell, current]
  })

  vcs.commit('A2', '=SUM(A1:C1)')
  let commit = vcs.commit('A1', '1')
  vcs.commit('B1', '1')
  vcs.commit('C1', '1')

  vcs.checkout(commit)

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┐
    │   │ A │
    ├───┼───┤
    │ 1 │ 1 │
    ├───┼───┤
    │ 2 │ 1 │
    └───┴───┘
    "
  `)
})

it('should be possible to checkout a specific commit, and return to the last commit', () => {
  let spreadsheet = new Spreadsheet()

  let vcs = new VersionControl((cell: string, value: string) => {
    let current = spreadsheet.get(cell)
    spreadsheet.set(cell, value)
    return [cell, current]
  })

  vcs.commit('A2', '=SUM(A1:C1)')
  let commit = vcs.commit('A1', '1')
  vcs.commit('B1', '1')
  vcs.commit('C1', '1')

  vcs.checkout(commit)

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┐
    │   │ A │
    ├───┼───┤
    │ 1 │ 1 │
    ├───┼───┤
    │ 2 │ 1 │
    └───┴───┘
    "
  `)

  vcs.head()

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┬───┐
    │   │ A │ B │ C │
    ├───┼───┼───┼───┤
    │ 1 │ 1 │ 1 │ 1 │
    ├───┼───┼───┼───┤
    │ 2 │ 3 │   │   │
    └───┴───┴───┴───┘
    "
  `)
})

it('should be possible to jump around commits', () => {
  let spreadsheet = new Spreadsheet()

  let vcs = new VersionControl((cell: string, value: string) => {
    let current = spreadsheet.get(cell)
    spreadsheet.set(cell, value)
    return [cell, current]
  })

  let commit1 = vcs.commit('A2', '=SUM(A1:C1)')
  let visual1 = visualizeSpreadsheet(spreadsheet)

  let commit2 = vcs.commit('A1', '1')
  let visual2 = visualizeSpreadsheet(spreadsheet)

  let commit3 = vcs.commit('B1', '1')
  let visual3 = visualizeSpreadsheet(spreadsheet)

  let commit4 = vcs.commit('C1', '1')
  let visual4 = visualizeSpreadsheet(spreadsheet)

  let commit5 = vcs.commit('C1', '2')
  let visual5 = visualizeSpreadsheet(spreadsheet)

  let commit6 = vcs.commit('C1', '3')
  let visual6 = visualizeSpreadsheet(spreadsheet)

  vcs.checkout(commit2)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual2)

  vcs.checkout(commit1)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual1)

  vcs.checkout(commit5)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual5)

  vcs.checkout(commit1)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual1)

  vcs.checkout(commit6)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual6)

  vcs.checkout(commit3)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual3)

  vcs.checkout(commit4)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual4)

  vcs.checkout(commit1)
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual1)

  vcs.head()
  expect(visualizeSpreadsheet(spreadsheet)).toEqual(visual6)
})
