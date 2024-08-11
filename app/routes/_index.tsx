import type { MetaFunction } from '@remix-run/node'
import clsx from 'clsx'
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import {
  parseExpression,
  parseLocation,
  printLocation,
  tokenizeExpression,
} from '~/domain/expression'
import { Spreadsheet } from '~/domain/spreadsheet'

export const meta: MetaFunction = () => {
  return [
    { title: 'My Spreadsheet' },
    { name: 'description', content: 'My own implementation of a spreadsheet' },
  ]
}

const WIDTH = 26
const HEIGHT = 26

export default function Index() {
  let [cell, setActiveCell] = useState('A1')
  let [value, setValue] = useState('')
  let [debugView, setDebugView] = useState(false)
  let [, forceRerender] = useReducer(() => ({}), {})
  let inputRef = useRef<HTMLInputElement | null>(null)

  let [spreadsheet] = useState(() => {
    let spreadsheet = new Spreadsheet()

    spreadsheet.set('A1', '2')
    spreadsheet.set('B1', '=SUM(A1, A1)')
    spreadsheet.set('C1', '=SUM(B1, A1)')
    spreadsheet.set('D1', '=SUM(C1, A1)')
    spreadsheet.set('E1', '=SUM(C1, PRODUCT(A1:D1))')
    spreadsheet.set('B2', '=CONCAT("2+2=", SUM(2, 2))')
    spreadsheet.set('A2', '=CONCAT(A1, "+", B1, "=", SUM(A1:B1))')
    spreadsheet.set('A3', '=CONCAT(A1, "*", B1, "=", PRODUCT(A1:B1))')
    spreadsheet.set('C3', '=CONCAT("Hello", " ", "World", "!")')
    spreadsheet.set('B3', '=AVERAGE(A1:E1)')

    spreadsheet.set('A4', '=PRODUCT(A1:E1)')

    return spreadsheet
  })

  // Move active cell
  let moveRight = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.col += 1
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveLeft = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.col = Math.max(1, parsed.col - 1)
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveUp = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.row = Math.max(1, parsed.row - 1)
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveDown = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.row += 1
    setActiveCell(printLocation(parsed))
  }, [cell])

  // Update input value when cell value changes
  useEffect(() => {
    setValue(spreadsheet.get(cell))
  }, [cell, spreadsheet])

  // Generate grid
  let cells = Array.from({
    length: (WIDTH + 1) * (HEIGHT + 1),
  }).fill(0)

  // Active cell location
  let location = useMemo(() => parseLocation(cell), [cell])

  return (
    <div className="overflow-hidden font-sans">
      <div className="flex items-center border-gray-300 border-b">
        <div className="w-16 py-1.5 text-center">{cell}</div>
        <div className="font-thin text-gray-300">|</div>
        <input
          ref={inputRef}
          className="flex-1 border-none px-2 py-1.5 focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              spreadsheet.set(cell, e.currentTarget.value)
              forceRerender()
            }
          }}
          onBlur={(e) => {
            spreadsheet.set(cell, e.target.value)
            forceRerender()
          }}
        />
        <button
          type="button"
          onClick={() => setDebugView((v) => !v)}
          className="px-2 py-1.5 text-sm"
        >
          DEBUG
        </button>
      </div>
      <div className="flex overflow-hidden">
        <div
          style={
            {
              '--columns': WIDTH,
              '--rows': HEIGHT,
            } as CSSProperties
          }
          className="grid w-full grid-cols-[var(--spacing-16)_repeat(var(--rows),minmax(var(--spacing-32),1fr))] grid-rows-[auto_repeat(var(--rows),minmax(0,1fr))] overflow-auto text-sm"
        >
          {cells.map((_, idx) => {
            let row = Math.floor(idx / (WIDTH + 1))
            let col = idx % (WIDTH + 1)

            let id = `${String.fromCharCode(64 + col)}${row}`

            let contents = (() => {
              // Top left corner
              if (row === 0 && col === 0) {
                return ''
              }

              // Column labels
              if (row === 0) {
                return String.fromCharCode(64 + col)
              }

              // Row labels
              if (col === 0) {
                return row
              }

              // Cell
              let out = spreadsheet.compute(id)
              if (out === null) return null

              return (
                <div
                  className={clsx(typeof out === 'number' ? 'text-right' : 'text-left')}
                >
                  {out}
                </div>
              )
            })()

            return (
              <button
                disabled={row === 0 || col === 0}
                key={id}
                type="button"
                onClick={() => setActiveCell(id)}
                onFocus={() => setActiveCell(id)}
                onDoubleClick={() => {
                  // Ensure the cell is active
                  flushSync(() => {
                    setActiveCell(id)
                  })

                  // Move focus to the input
                  inputRef.current?.focus()

                  // Move cursor to the end
                  inputRef.current?.setSelectionRange(value.length, value.length)
                }}
                ref={(e) => {
                  if (e && cell === id) {
                    e.scrollIntoView({
                      block: 'nearest',
                      inline: 'nearest',
                    })
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    moveRight()
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    moveLeft()
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    moveUp()
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    moveDown()
                  }
                }}
                className={clsx(
                  'focus:outline-none',
                  'px-2 py-1.5',
                  'border-0.5 border-gray-200',

                  // Top left corner
                  row === 0 && col === 0 && 'z-20 border-r-1 border-b-1',

                  // Column or row header
                  row === 0 || col === 0 ? 'bg-gray-100 text-center' : 'bg-white',

                  // Column header
                  col === 0 && 'sticky left-0',

                  // Row header
                  row === 0 && 'sticky top-0',

                  // Active row/column header
                  ((row === 0 && location.col === col) ||
                    (col === 0 && location.row === row)) &&
                    'force:bg-blue-500/20',

                  // Active cell
                  cell === id && 'z-10 ring-2 ring-blue-500',
                )}
              >
                {contents}
              </button>
            )
          })}
        </div>
        {debugView && (
          <div className="min-w-sm overflow-auto border-gray-200 border-l">
            {(() => {
              if (!spreadsheet.has(cell)) {
                return (
                  <div className="flex items-center gap-2 p-2">
                    <label>Cell:</label>
                    <small>{cell}</small>
                  </div>
                )
              }

              let value = spreadsheet.get(cell)
              let expression = value[0] === '=' ? value.slice(1) : `"${value}"`
              let tokens = tokenizeExpression(expression)
              let ast = parseExpression(tokens)
              let evaluation = spreadsheet.evaluate(cell)
              let result = spreadsheet.compute(cell)

              return (
                <>
                  <div className="flex items-center gap-2 p-2">
                    <label>Cell:</label>
                    <small>{cell}</small>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label>Expression:</label>
                    <small>{value}</small>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label>Tokenization:</label>
                    <pre className="font-mono text-xs">
                      {JSON.stringify(tokens, null, 2)}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label>AST:</label>
                    <pre className="font-mono text-xs">
                      {JSON.stringify(ast, null, 2)}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label>Evaluation:</label>
                    <pre className="font-mono text-xs">
                      {JSON.stringify(evaluation, null, 2)}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <label>Result:</label>
                    <pre className="font-mono text-xs">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
