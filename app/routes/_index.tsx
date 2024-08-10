import type { MetaFunction } from '@remix-run/node'
import clsx from 'clsx'
import { type CSSProperties, useState } from 'react'
import { Expression, Spreadsheet, Value } from '~/domain/spreadsheet'

export const meta: MetaFunction = () => {
  return [
    { title: 'My Spreadsheet' },
    { name: 'description', content: 'My own implementation of a spreadsheet' },
  ]
}

const WIDTH = 26
const HEIGHT = 26

export default function Index() {
  let [spreadsheet] = useState(() => new Spreadsheet())

  spreadsheet.set('A1', Value.of(2))
  spreadsheet.set('B1', Expression.of('SUM(A1,A1)'))
  spreadsheet.set('C1', Expression.of('SUM(B1,A1)'))
  spreadsheet.set('D1', Expression.of('SUM(C1,A1)'))

  spreadsheet.set('A2', Expression.of('PRODUCT(A1:D1)'))

  let cells = Array.from({
    length: (WIDTH + 1) * (HEIGHT + 1),
  }).fill(0)

  return (
    <div className="font-sans">
      <div
        style={
          {
            '--columns': WIDTH,
            '--rows': HEIGHT,
          } as CSSProperties
        }
        className="text-sm grid border border-gray-300 w-full grid-rows-[auto_repeat(var(--rows),minmax(0,1fr))] grid-cols-[var(--spacing-16)_repeat(var(--rows),minmax(var(--spacing-32),1fr))]"
      >
        {cells.map((_, idx) => {
          let row = Math.floor(idx / (WIDTH + 1))
          let col = idx % (WIDTH + 1)

          let id = `${String.fromCharCode(64 + col)}${row}`

          let contents = (() => {
            if (row === 0 && col === 0) {
              return ''
            }

            if (row === 0) {
              return String.fromCharCode(64 + col)
            }

            if (col === 0) {
              return row
            }

            let out = spreadsheet.compute(id)
            if (out) {
              return (
                <div>
                  <div>{out}</div>
                  <small className="text-gray-500 font-mono">
                    ={spreadsheet.get(id)}
                  </small>
                </div>
              )
            }
          })()

          return (
            <div
              key={idx}
              className={clsx(
                'px-2 py-1.5',
                'border-0.5 border-gray-200',
                row === 0 && col === 0 && 'z-20 border-2',
                row === 0 || col === 0 ? 'bg-gray-100 text-center' : 'bg-white',
                row === 0 && 'sticky top-0',
                col === 0 && 'sticky left-0',
              )}
            >
              {contents}
            </div>
          )
        })}
      </div>
    </div>
  )
}
