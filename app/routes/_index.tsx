import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import {
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/16/solid'
import type { MetaFunction } from '@remix-run/node'
import clsx from 'clsx'
import {
  type CSSProperties,
  type MutableRefObject,
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
  printExpression,
  printLocation,
} from '~/domain/expression'
import {
  ComputationResultKind,
  type EvaluationResult,
  EvaluationResultKind,
  Spreadsheet,
  printEvaluationResult,
} from '~/domain/spreadsheet'
import { type Token, TokenKind, tokenize } from '~/domain/tokenizer'

export const meta: MetaFunction = () => {
  return [
    { title: 'My Spreadsheet' },
    { name: 'description', content: 'My own implementation of a spreadsheet' },
  ]
}

const WIDTH = 26
const HEIGHT = 50

export default function Index() {
  let [cell, setActiveCell] = useState('A1')
  let [value, setValue] = useState('')
  let [debugView, setDebugView] = useState(false)
  let [, forceRerender] = useReducer(() => ({}), {})
  let inputRef = useRef<HTMLInputElement | null>(null)
  let [editingExpression, setEditingExpression] = useState(false)

  let [spreadsheet] = useState(() => new Spreadsheet())
  let functions = useMemo(() => spreadsheet.functions(), [spreadsheet])

  useEffect(() => {
    // @ts-expect-error
    window.spreadsheet = spreadsheet

    if (window.location.search !== '?demo') return

    // Demo mode
    spreadsheet.set('A1', 'Double it:')
    spreadsheet.set('B1', '2')
    spreadsheet.set('C1', '=PRODUCT(B1, 2)')
    spreadsheet.set('D1', '=PRODUCT(C1, 2)')
    spreadsheet.set('E1', '=PRODUCT(D1, 2)')
    spreadsheet.set('F1', 'Sum:')
    spreadsheet.set('G1', '=SUM(B1:E1)')
    spreadsheet.set('F2', 'Product:')
    spreadsheet.set('G2', '=PRODUCT(B1:E1)')
    spreadsheet.set('F3', 'Average:')
    spreadsheet.set('G3', '=AVERAGE(B1:E1)')

    spreadsheet.set('A2', 'Ref B1:')
    spreadsheet.set('B2', '=B1')

    spreadsheet.set('A3', 'Word 1:')
    spreadsheet.set('A4', 'Word 2:')
    spreadsheet.set('B3', 'Hello')
    spreadsheet.set('B4', 'World!')

    spreadsheet.set('A6', 'Concatenation:')
    spreadsheet.set('B6', '=CONCAT(B3, " ", B4)')
    spreadsheet.set('A7', 'Lowercase:')
    spreadsheet.set('B7', '=LOWER(B6)')
    spreadsheet.set('A8', 'Uppercase:')
    spreadsheet.set('B8', '=UPPER(B6)')

    spreadsheet.set('A10', 'Error handling:')
    spreadsheet.set('A11', 'Unknown fn:')
    spreadsheet.set('B11', '=FOOBAR(1, 2, 3)')

    spreadsheet.set('A12', 'Circular refs:')
    spreadsheet.set('B12', '=SUM(C12, 1)')
    spreadsheet.set('C12', '=SUM(C13, 1)')
    spreadsheet.set('C13', '=SUM(B13, 1)')
    spreadsheet.set('B13', '=SUM(B12, 1)')

    spreadsheet.set('D6', '\u03C0')
    spreadsheet.set('E6', '=PI()')

    spreadsheet.set('D7', '\u03C4')
    spreadsheet.set('E7', '=PRODUCT(PI(), 2)')

    spreadsheet.set('A14', 'Ref self')
    spreadsheet.set('B14', '=B14')
    spreadsheet.set('C14', '=SUM(C14, 1)')
    spreadsheet.set('D14', '=SUM(D13:D15)')

    spreadsheet.set('A15', 'Ref range B1:C1')
    spreadsheet.set('B15', '=B1:C1')

    spreadsheet.set('F5', 'Math:')
    spreadsheet.set('G5', '=1 + 2 * B2 / C1')

    spreadsheet.set('F9', 'Value:')
    spreadsheet.set('G9', 'Even or odd?')

    spreadsheet.set('F10', '5')
    spreadsheet.set('G10', '=IF(MOD(F10, 2) = 0, "Even", "Odd")')

    spreadsheet.set('F11', '8')
    spreadsheet.set('G11', '=IF(MOD(F11, 2) = 0, "Even", "Odd")')

    spreadsheet.set('F12', 'Date:')
    spreadsheet.set('G12', 'Today is:')
    spreadsheet.set('H12', '=TODAY()')
    spreadsheet.set('G13', 'Now is:')
    spreadsheet.set('H13', '=NOW()')
    spreadsheet.set('G14', 'Day:')
    spreadsheet.set('H14', '=DAY(H12)')
    spreadsheet.set('G15', 'Month:')
    spreadsheet.set('H15', '=MONTH(H12)')
    spreadsheet.set('G16', 'Year:')
    spreadsheet.set('H16', '=YEAR(H12)')
    spreadsheet.set('G17', 'Hour:')
    spreadsheet.set('H17', '=HOUR(H13)')
    spreadsheet.set('G18', 'Minute:')
    spreadsheet.set('H18', '=MINUTE(H13)')
    spreadsheet.set('G19', 'Second:')
    spreadsheet.set('H19', '=SECOND(H13)')
    spreadsheet.set('I13', 'Tomorrow is:')
    spreadsheet.set('J13', '=ADD_DAYS(H12, 1)')
    spreadsheet.set('I14', 'Yesterday was:')
    spreadsheet.set('J14', '=SUB_DAYS(H12, 1)')
  }, [spreadsheet])

  // Move active cell
  let moveRight = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.col = Math.min(WIDTH, parsed.col + 1)
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveLeftFirst = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.col = 1
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveLeft = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.col = Math.max(1, parsed.col - 1)
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveRightLast = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.col = WIDTH
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveUp = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.row = Math.max(1, parsed.row - 1)
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveUpFirst = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.row = 1
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveDown = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.row = Math.min(HEIGHT, parsed.row + 1)
    setActiveCell(printLocation(parsed))
  }, [cell])
  let moveDownLast = useCallback(() => {
    let parsed = parseLocation(cell)
    parsed.row = HEIGHT
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

  // Evaluation of the current cell
  let out = spreadsheet.compute(cell)
  let tokens: Token[] = useMemo(() => {
    return value.length > 0
      ? tokenize(value[0] === '=' ? value.slice(1) : `"${value}"`)
      : []
  }, [value])

  // Cursor position
  let cursor = useCursorPosition(inputRef)
  if (value[0] === '=') {
    cursor -= 1
  }

  // Autocomplete token at cursor position
  let tokenAtPosition = useMemo(() => {
    return (
      tokens.find(
        (token, idx) =>
          // We want an identifier
          token.kind === TokenKind.IDENTIFIER &&
          // It should be a function call, the open paren might not be there
          // yet. We do know that we definitely don't want a `:` right before
          // it, because that would be a cell range.
          tokens[idx - 1]?.kind !== TokenKind.COLON &&
          // The cursor is within the token's span
          cursor >= token.span.start &&
          cursor <= token.span.end,
      ) ?? null
    )
  }, [tokens, cursor])

  // Autocomplete suggestions
  let suggestions = useMemo(() => {
    if (tokenAtPosition === null) return []

    let prefix = tokenAtPosition.raw
    let matches = functions.filter((fn) => {
      return fn.toLowerCase().startsWith(prefix.toLowerCase())
    })

    return matches
  }, [functions, tokenAtPosition])

  // Dependencies of the current cell
  let dependencies = spreadsheet.dependencies(cell)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden font-sans">
      <div className="flex items-center border-gray-300 border-b">
        <div className="w-16 shrink-0 py-1.5 text-center text-sm">{cell}</div>
        <div className="-ml-[2px] font-thin text-gray-300">|</div>
        <div className="relative flex flex-1">
          <div
            hidden={value[0] !== '='}
            className="pointer-events-none absolute top-1.5 left-2 font-mono"
          >
            {tokens.map((token, idx) => {
              let key = idx

              let color = (() => {
                // Function
                if (
                  token.kind === TokenKind.IDENTIFIER &&
                  tokens[idx + 1]?.kind === TokenKind.OPEN_PAREN
                ) {
                  return 'text-purple-500'
                }

                // Cell / Cell range
                if (
                  // Cell
                  (token.kind === TokenKind.IDENTIFIER &&
                    // Next token is an open paren. This means that the identifier
                    // is a function call, not a cell reference.
                    tokens[idx + 1]?.kind !== TokenKind.OPEN_PAREN) ||
                  // Cell range, the identifiers are highlighted already, but the
                  // colon is not yet.
                  (token.kind === TokenKind.COLON &&
                    tokens[idx - 1]?.kind === TokenKind.IDENTIFIER &&
                    tokens[idx + 1]?.kind === TokenKind.IDENTIFIER)
                ) {
                  return 'text-amber-500'
                }

                // Numbers
                if (token.kind === TokenKind.NUMBER_LITERAL) return 'text-blue-500'

                // Strings
                if (token.kind === TokenKind.STRING_LITERAL) return 'text-green-500'

                // Unknown
                if (token.kind === TokenKind.UNKNOWN) return 'text-red-500'

                return ''
              })()

              return (
                <div
                  key={key}
                  style={{ '--start': `${token.span.start}ch` } as CSSProperties}
                  className={clsx(
                    'absolute translate-x-[calc(1ch+var(--start))] whitespace-pre',
                    color,
                  )}
                >
                  {token.raw}
                </div>
              )
            })}
          </div>
          <Combobox
            virtual={{ options: suggestions }}
            immediate
            value={value}
            onChange={(suggestion) => {
              if (suggestion === null) return
              if (tokenAtPosition === null) return

              // Replace the current token with the selected suggestion
              let prefix = tokenAtPosition
              let expression = value.slice(1)
              let newExpression =
                expression.slice(0, prefix.span.start) +
                suggestion +
                expression.slice(prefix.span.end)

              // Update the value
              flushSync(() => {
                setValue(`=${newExpression}`)
              })

              // Move cursor to the end of the suggestion
              inputRef.current?.setSelectionRange(
                prefix.span.start + suggestion.length + 1,
                prefix.span.start + suggestion.length + 1,
              )
            }}
          >
            <ComboboxInput
              ref={inputRef}
              className={clsx(
                'flex-1 border-none px-2 py-1.5 focus:outline-none',
                value[0] === '=' && 'font-mono',
              )}
              autoComplete="off"
              value={value}
              onChange={(e) => {
                flushSync(() => {
                  setValue(e.target.value)
                  setEditingExpression(e.target.value[0] === '=')
                })

                // When the cell is empty, move focus back to the grid If you
                // continue typing, the focus will be in the `input` again. But this
                // allows us to immediately use arrow keys once you hit backspace
                // (which cleared the input).
                if (e.target.value === '') {
                  // Move focus back to the grid
                  let btn = document.querySelector(`button[data-cell-button=${cell}]`)
                  if (btn && btn.tagName === 'BUTTON') {
                    ;(btn as HTMLButtonElement).focus()
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Prevent submission when accepting a suggestion
                  if (suggestions.length > 0) return

                  // Submit the new value
                  flushSync(() => {
                    spreadsheet.set(cell, e.currentTarget.value)
                    forceRerender()
                  })

                  // Move focus back to the grid
                  let btn = document.querySelector(`button[data-cell-button=${cell}]`)
                  if (btn && btn.tagName === 'BUTTON') {
                    ;(btn as HTMLButtonElement).focus()
                  }
                } else if (e.key === 'Escape') {
                  // Reset the value
                  flushSync(() => setValue(spreadsheet.get(cell)))

                  // Move focus back to the grid
                  let btn = document.querySelector(`button[data-cell-button=${cell}]`)
                  if (btn && btn.tagName === 'BUTTON') {
                    ;(btn as HTMLButtonElement).focus()
                  }
                }
              }}
              onFocus={(e) => {
                setEditingExpression(e.currentTarget.value[0] === '=')
              }}
              onBlur={(e) => {
                setEditingExpression(false)
                spreadsheet.set(cell, e.target.value)
                forceRerender()
              }}
            />
            <ComboboxOptions
              modal={false}
              anchor="bottom start"
              className="inset-ring-1 inset-ring-black/10 z-20 w-96 overflow-auto rounded-md bg-white py-1.5 text-base shadow-lg [--anchor-gap:var(--spacing-2)] [--anchor-padding:var(--spacing-2)] empty:invisible focus:outline-none sm:text-sm"
            >
              {({ option }) => (
                <ComboboxOption
                  value={option}
                  className="group relative w-full cursor-default select-none px-3 py-2 text-gray-900 data-focus:bg-slate-100"
                >
                  <span className="font-mono">{option}()</span>
                </ComboboxOption>
              )}
            </ComboboxOptions>
          </Combobox>
        </div>
        {out?.kind === ComputationResultKind.ERROR && (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 font-medium text-red-700 text-xs ring-1 ring-red-600/10 ring-inset">
            <ExclamationTriangleIcon className="size-4 shrink-0 text-red-600" />
            <span>{out.message}</span>
          </span>
        )}
        <div className="px-2">
          <button
            type="button"
            onClick={() => setDebugView((v) => !v)}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-600 text-xs ring-1 ring-gray-500/10 ring-inset"
          >
            <span>DEBUG</span>
          </button>
        </div>
      </div>
      <div
        className="flex overflow-hidden"
        style={
          {
            '--columns': WIDTH,
            '--rows': HEIGHT,
            '--row-header-width': 'var(--spacing-16)',
            '--col-header-height': 'var(--spacing-9)',
          } as CSSProperties
        }
      >
        <div
          className={clsx(
            'grid',
            'grid-cols-[var(--row-header-width)_repeat(var(--columns),minmax(calc(var(--row-header-width)*2),1fr))]',
            'grid-rows-[var(--col-header-height)_repeat(var(--rows),minmax(var(--col-header-height),1fr))]',
            'w-full overflow-auto text-sm',
          )}
        >
          {cells.map((_, idx) => {
            let row = Math.floor(idx / (WIDTH + 1))
            let col = idx % (WIDTH + 1)

            let id = `${String.fromCharCode(64 + col)}${row}`

            let [contents, alt] = (() => {
              // Top left corner
              if (row === 0 && col === 0) return [null, null]

              // Column labels
              if (row === 0) return [String.fromCharCode(64 + col), null]

              // Row labels
              if (col === 0) return [row, null]

              // Cell
              let out = spreadsheet.compute(id)
              if (out === null) return [null, null]

              if (out.kind === ComputationResultKind.ERROR) {
                return [
                  <span
                    key="error"
                    data-error=""
                    className="inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 font-medium text-red-700 text-xs ring-1 ring-red-600/10 ring-inset"
                  >
                    <ExclamationTriangleIcon className="size-4 shrink-0 text-red-600" />
                    <span>{out.short}</span>
                  </span>,
                  out.message,
                ]
              }

              if (out.kind === ComputationResultKind.VALUE) {
                return [
                  <div
                    key="value"
                    className={clsx(
                      'pointer-events-none',
                      out.value.kind === EvaluationResultKind.NUMBER &&
                        'truncate text-right',
                      out.value.kind === EvaluationResultKind.STRING &&
                        'truncate text-left',
                      out.value.kind === EvaluationResultKind.BOOLEAN &&
                        'text-center uppercase',
                      (out.value.kind === EvaluationResultKind.DATETIME ||
                        out.value.kind === EvaluationResultKind.DATE ||
                        out.value.kind === EvaluationResultKind.TIME) &&
                        'flex items-center justify-center gap-1 truncate text-left',
                    )}
                  >
                    {out.value.kind === EvaluationResultKind.DATETIME ||
                    out.value.kind === EvaluationResultKind.DATE ? (
                      <>
                        <CalendarIcon className="size-4 shrink-0 text-gray-400" />
                        {printEvaluationResult(out.value)}
                      </>
                    ) : out.value.kind === EvaluationResultKind.TIME ? (
                      <>
                        <ClockIcon className="size-4 shrink-0 text-gray-400" />
                        {printEvaluationResult(out.value)}
                      </>
                    ) : (
                      printEvaluationResult(out.value)
                    )}
                  </div>,
                  printEvaluationResult(out.value),
                ] as const
              }

              return [null, null]
            })()

            return (
              <div
                key={id}
                data-cell={id}
                className={clsx(
                  'group/cell relative grid',
                  'border-0.5 border-gray-200',

                  // Scrollable area offsets for sticky headers
                  '[--offset-padding:var(--spacing-2)]',
                  'scroll-mt-[calc(var(--col-header-height)+var(--offset-padding))]',
                  'scroll-ml-[calc(var(--row-header-width)+var(--offset-padding))]',

                  // Top left corner
                  row === 0 && col === 0 && 'z-30 border-r-1 border-b-1',

                  // Column or row header
                  row === 0 || col === 0 ? 'z-20 bg-gray-100 text-center' : 'bg-white',

                  // Column header
                  col === 0 && 'sticky left-0',

                  // Row header
                  row === 0 && 'sticky top-0',

                  // Active row/column header
                  ((row === 0 && location.col === col) ||
                    (col === 0 && location.row === row)) &&
                    'force:bg-blue-100',

                  // Active cell
                  cell === id && 'inset-ring-2 inset-ring-blue-500 force:border-blue-500',

                  // Dependency of the current cell
                  cell !== id &&
                    dependencies.has(id) &&
                    clsx(
                      'before:pointer-events-none before:absolute before:inset-0 before:border-yellow-500 before:border-dashed before:bg-yellow-200/20',
                      !dependencies.has(leftCell(id)) && 'before:border-l-2',
                      !dependencies.has(rightCell(id)) && 'before:border-r-2',
                      !dependencies.has(topCell(id)) && 'before:border-t-2',
                      !dependencies.has(bottomCell(id)) && 'before:border-b-2',
                    ),
                )}
                ref={(e) => {
                  if (e && cell === id) {
                    // Ensure the cell is focused (buttons don't receive focus
                    // on Safari by default)
                    if (document.activeElement?.tagName === 'BODY') {
                      let btn = document.querySelector(`button[data-cell-button=${cell}]`)
                      if (btn && btn.tagName === 'BUTTON') {
                        ;(btn as HTMLButtonElement).focus()
                      }
                    }

                    // Ensure it's visible
                    e.scrollIntoView({
                      behavior: 'instant',
                      block: 'nearest',
                      inline: 'nearest',
                    })
                  }
                }}
              >
                <div className="absolute top-0 bottom-0 left-0 z-10 flex group-not-hover/cell:hidden">
                  <button
                    type="button"
                    hidden={row === 0 || col === 0 || !editingExpression || cell === id}
                    onMouseDown={(e) => {
                      // Inject current cell into the input at the cursor
                      // position or instead of the selection.
                      e.preventDefault()
                      e.stopPropagation()

                      let start = inputRef.current?.selectionStart
                      if (start == null) return

                      let end = inputRef.current?.selectionEnd
                      if (end == null) return

                      // Set input value to the new value
                      flushSync(() => {
                        setValue((value) => {
                          let before = value.slice(0, start)
                          let after = value.slice(end)
                          let next = `${before}${id}${after}`
                          return next
                        })
                      })

                      // Restore focus to the input
                      inputRef.current?.focus()

                      // Restore cursor position
                      inputRef.current?.setSelectionRange(
                        start + id.length,
                        start + id.length,
                      )
                    }}
                    className="inset-ring inset-ring-gray-500/20 m-1 rounded-md rounded-md bg-white p-1"
                  >
                    <PlusIcon className="size-4 shrink-0 text-gray-400" />
                  </button>
                </div>
                <button
                  disabled={row === 0 || col === 0}
                  data-cell-button={id}
                  type="button"
                  onClick={(e) => {
                    // Move focus to the button, otherwise the button won't
                    // receive focus on Safari
                    e.currentTarget.focus()
                  }}
                  onFocus={() => {
                    setActiveCell(id)
                  }}
                  onDoubleClick={() => {
                    // Ensure the cell is active
                    flushSync(() => setActiveCell(id))

                    // Move focus to the input
                    inputRef.current?.focus()

                    // Move cursor to the end
                    inputRef.current?.setSelectionRange(value.length, value.length)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' || e.key === 'Shift') {
                      // Default browser behavior
                    } else if (e.key === 'ArrowRight') {
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
                    } else if (e.key === 'PageUp') {
                      e.preventDefault()
                      moveUpFirst()
                    } else if (e.key === 'PageDown') {
                      e.preventDefault()
                      moveDownLast()
                    } else if (e.key === 'Home') {
                      e.preventDefault()
                      moveLeftFirst()
                    } else if (e.key === 'End') {
                      e.preventDefault()
                      moveRightLast()
                    } else if (e.key === 'Enter' && spreadsheet.has(cell)) {
                      e.preventDefault()
                      // Move focus to the input, and start editing
                      inputRef.current?.focus()
                      inputRef.current?.select()
                    } else if (e.key === 'Enter' || e.key === 'Escape') {
                      e.preventDefault()
                    } else {
                      // Move focus to the input, and start editing
                      inputRef.current?.focus()
                      inputRef.current?.select()
                    }
                  }}
                  className="min-w-0 px-2 py-1.5 focus:outline-none has-data-error:p-0"
                  title={alt ?? undefined}
                >
                  {contents}
                </button>
              </div>
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
              let tokens = tokenize(expression)
              let ast = parseExpression(tokens)
              let stringifiedAST = `=${printExpression(ast)}`
              let evaluation: EvaluationResult[] | null = null
              try {
                evaluation = spreadsheet.evaluate(cell)
              } catch {}
              let result = spreadsheet.compute(cell)

              return (
                <>
                  <div className="sticky top-0 grid h-[var(--col-header-height)] grid-cols-2 border-gray-200 border-b bg-white">
                    <div className="flex items-center gap-2 px-2">
                      <label>Cell:</label>
                      <small>{cell}</small>
                    </div>
                    {(result === null || result.kind === ComputationResultKind.VALUE) && (
                      <div className="flex items-center gap-2 px-2">
                        <label>Result:</label>
                        {result === null ? (
                          <small>N/A</small>
                        ) : (
                          <small>{printEvaluationResult(result.value)}</small>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label>Expression:</label>
                    <small className="whitespace-pre">{value}</small>
                  </div>
                  {value !== stringifiedAST && (
                    <div className="flex flex-col gap-2 p-2">
                      <label>Interpreted expression:</label>
                      <small className="whitespace-pre">{stringifiedAST}</small>
                    </div>
                  )}
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
                  {evaluation !== null && (
                    <div className="flex flex-col gap-2 p-2">
                      <label>Evaluation:</label>
                      <pre className="font-mono text-xs">
                        {JSON.stringify(evaluation, null, 2)}
                      </pre>
                    </div>
                  )}
                  {result?.kind !== ComputationResultKind.ERROR && (
                    <div className="flex items-center gap-2 p-2">
                      <label>Result:</label>
                      {result === null ? (
                        <small>N/A</small>
                      ) : (
                        <small>{printEvaluationResult(result.value)}</small>
                      )}
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

function topCell(cell: string) {
  let { col, row } = parseLocation(cell)
  return printLocation({ col, row: row - 1 })
}

function rightCell(cell: string) {
  let { col, row } = parseLocation(cell)
  return printLocation({ col: col + 1, row })
}

function bottomCell(cell: string) {
  let { col, row } = parseLocation(cell)
  return printLocation({ col, row: row + 1 })
}

function leftCell(cell: string) {
  let { col, row } = parseLocation(cell)
  let out = printLocation({ col: col - 1, row })
  console.log(cell, out)
  return out
}

function useCursorPosition(input: MutableRefObject<HTMLInputElement | null>) {
  let [cursor, setCursor] = useState(0)

  useEffect(() => {
    let el = input.current
    if (!el) return

    let ac = new AbortController()

    function handle() {
      if (!el) return
      setCursor(el.selectionStart ?? 0)
    }

    // el.addEventListener('input', handle, { signal: ac.signal, passive: true })
    el.addEventListener('keydown', handle, { signal: ac.signal, passive: true })
    el.addEventListener('keyup', handle, { signal: ac.signal, passive: true })
    el.addEventListener('click', handle, { signal: ac.signal, passive: true })
    el.addEventListener('focus', handle, { signal: ac.signal, passive: true })
    el.addEventListener('blur', handle, { signal: ac.signal, passive: true })

    return () => ac.abort()
  }, [input])

  return cursor
}
