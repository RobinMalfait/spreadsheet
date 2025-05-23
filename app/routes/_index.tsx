import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/16/solid'
import type { MetaFunction } from '@remix-run/node'
import clsx from 'clsx'
import { format } from 'date-fns'
import {
  type CSSProperties,
  type MutableRefObject,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { printEvaluationResult } from '~/domain/evaluation'
import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import {
  type Location,
  parse,
  parseLocation,
  printExpression,
  printLocation,
} from '~/domain/expression'
import * as functions from '~/domain/functions'
import { printSignature } from '~/domain/signature/parser'
import { Spreadsheet } from '~/domain/spreadsheet'
import { type Token, TokenKind, printTokens, tokenize } from '~/domain/tokenizer'
import { VersionControl } from '~/domain/version-control'

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
  let [error, setError] = useState(() => new Map<string, EvaluationResult>())
  let [debugView, setDebugView] = useState(false)
  let [historyView, setHistoryView] = useState(false)
  let [, forceRerender] = useReducer(() => ({}), {})

  let inputContainerRef = useRef<HTMLDivElement | null>(null)
  let inputRef = useRef<HTMLInputElement | null>(null)

  let editingExpression = value[0] === '=' && document.activeElement === inputRef.current

  useEffect(() => {
    let ac = new AbortController()
    let raf: ReturnType<typeof requestAnimationFrame>

    let container = inputContainerRef.current
    if (!container) return

    let input = inputRef.current
    if (!input) return

    function handle() {
      if (!container) return
      if (!input) return

      // Keep the scroll in sync
      raf = requestAnimationFrame(handle)

      // Update the offset of the scroll
      container.style.setProperty('--scroll-offset', `${-input.scrollLeft}px`)
    }

    // Input has the focus already, start syncing the scroll
    if (document.activeElement === input) {
      raf = requestAnimationFrame(handle)
      return () => cancelAnimationFrame(raf)
    }

    // Input doesn't have the focus, wait for it to get the focus
    input.addEventListener(
      'focus',
      () => {
        raf = requestAnimationFrame(handle)
      },
      { signal: ac.signal },
    )

    // Input lost the focus, stop syncing the scroll
    input.addEventListener(
      'blur',
      () => {
        cancelAnimationFrame(raf)

        // Reset the scroll offset
        container.style.setProperty('--scroll-offset', '0px')
      },
      { signal: ac.signal },
    )

    return () => {
      cancelAnimationFrame(raf)
      ac.abort()
    }
  }, [])

  let [spreadsheet] = useState(() => new Spreadsheet())
  let [vcs] = useState(() => {
    return new VersionControl((cell: string, value: string) => {
      let current = spreadsheet.get(cell)
      let error = spreadsheet.set(cell, value)
      if (error) {
        setError((errors) => new Map(errors).set(cell, error))
      } else {
        setError((errors) => (errors.delete(cell) ? new Map(errors) : errors))
      }
      forceRerender()
      return [cell, current]
    })
  })

  useEffect(() => {
    let ac = new AbortController()

    document.addEventListener(
      'keydown',
      (e) => {
        if (
          document.activeElement === inputRef.current &&
          inputRef.current?.value.length !== 0
        ) {
          return
        }

        if (e.key === 'z' && e.metaKey) {
          e.preventDefault()
          vcs.undo()
        } else if (e.key === 'y' && e.metaKey) {
          e.preventDefault()
          vcs.redo()
        }
      },
      { signal: ac.signal },
    )

    return () => ac.abort()
  }, [vcs])

  let functionNames = useMemo(() => spreadsheet.functions(), [spreadsheet])

  useEffect(() => {
    // @ts-expect-error
    window.spreadsheet = spreadsheet

    // Demo modes
    if (window.location.search === '?demo-lookups') {
      vcs.commit('A1', 'Name:')
      vcs.commit('B1', 'Age:')
      vcs.commit('A2', 'Alice')
      vcs.commit('B2', '25')
      vcs.commit('A3', 'Bob')
      vcs.commit('B3', '30')
      vcs.commit('A4', 'Charlie')
      vcs.commit('B4', '35')

      vcs.commit('D2', '=A2')
      vcs.commit('E2', '=LOOKUP(D2, A2:A4, B2:B4)')
    } else if (window.location.search === '?demo-python-ctf') {
      // See: https://x.com/chordbug/status/1834642829919781369
      vcs.commit('A1', '=AS_CHAR(SUM(RANGE(CHAR_CODE_AT(AS_STRING(TRUE()), 0))))')
    } else if (window.location.search === '?demo-lambda') {
      vcs.commit('A1', 'Digits:')
      vcs.commit('B1', '=DIGITS()')
      vcs.commit('A2', 'Copy:')
      vcs.commit('B2', '=MAP(B1, VALUE())')
      vcs.commit('A3', 'Double:')
      vcs.commit('B3', '=MAP(B1, VALUE() * 2)')
    } else if (window.location.search === '?demo-luhn-algorithm') {
      // See: https://x.com/cneuralnetwork/status/1831989042826629546
      vcs.commit('A1', "Luhn's Algorithm")
      vcs.commit('A2', 'Card number:')
      vcs.commit('B2', '4137 8947 1175 5904')
      vcs.commit('C2', 'Valid:')
      vcs.commit('D2', '=B9')
      vcs.commit('A4', 'Cleaning:')
      vcs.commit('B4', '=REPLACE_ALL(AS_STRING(B2), " ", "")')
      vcs.commit('A5', 'Split:')
      vcs.commit('B5', '=AS_NUMBERS(SPLIT(B4, ""))')
      vcs.commit('A6', 'Double odds:')
      vcs.commit('B6', '=MAP(B5, IF(MOD(OFFSET_COL(), 2) == 1, VALUE(), VALUE() * 2))')
      vcs.commit('A7', 'Single digits:')
      vcs.commit('B7', '=MAP(B6, IF(VALUE() > 9, MOD(VALUE(), 9), VALUE()))')
      vcs.commit('A8', 'Total:')
      vcs.commit('B8', '=SUM(MAP(B7, VALUE()))')
      vcs.commit('A9', 'Valid:')
      vcs.commit('B9', '=MOD(B8, 10) == 0')
    } else if (window.location.search === '?demo-spills') {
      vcs.commit('A1', 'Spills:')
      vcs.commit('B1', '=DIGITS()')
      vcs.commit('A2', 'Double:')
      vcs.commit('B2', '=B1 * 2')
      vcs.commit('C2:K2', '=INHERIT_FORMULA(B2)')

      vcs.commit('A5', 'Vertical spills:')
      vcs.commit('B5', '=TRANSPOSE(DIGITS())')
      vcs.commit('C4', 'Double:')
      vcs.commit('C5', '=B5 * 2')
      vcs.commit('C6:C14', '=INHERIT_FORMULA(C5)')
    } else if (window.location.search === '?demo-aoc-2023-01') {
      vcs.commit('A1', 'Advent of Code')
      vcs.commit('B1', '2023 - Day 01')

      vcs.commit('B3', 'Actual')
      vcs.commit('C3', 'Expected')
      vcs.commit('D3', 'Success?')

      vcs.commit('A4', 'Part 01')
      vcs.commit('B4', '0')
      vcs.commit('C4', '=142')
      vcs.commit('D4', '=IF(B4 == C4, "Pass", "Fail")')

      vcs.commit('A5', 'Part 02')
      vcs.commit('B5', '0')
      vcs.commit('C5', '=281')
      vcs.commit('D5', '=IF(B5 == C5, "Pass", "Fail")')

      vcs.commit('A7', 'Sample input 01:')
      vcs.commit('A9', '1abc2')
      vcs.commit('A10', 'pqr3stu8vwx')
      vcs.commit('A11', 'a1b2c3d4e5f')
      vcs.commit('A12', 'treb7uchet')

      vcs.commit(
        'B9',
        '=AS_NUMBER(FIND_FIRST(A9, INTO(DIGITS()))) * 10 + AS_NUMBER(FIND_LAST(A9, INTO(DIGITS())))',
      )
      vcs.commit('B10:B12', '=INHERIT_FORMULA(B9)')

      vcs.commit('B4', '=SUM(B9:B12)')

      vcs.commit('C7', 'Sample input 02:')
      vcs.commit('C9', 'two1nine')
      vcs.commit('C10', 'eightwothree')
      vcs.commit('C11', 'abcone2threexyz')
      vcs.commit('C12', 'xtwone3four')
      vcs.commit('C13', '4nineeightseven2')
      vcs.commit('C14', 'zoneight234')
      vcs.commit('C15', '7pqrstsixteen')

      vcs.commit(
        'D9',
        '=REPLACE_ALL(C9, "one", 1, "two", 2, "three", 3, "four", 4, "five", 5, "six", 6, "seven", 7, "eight", 8, "nine", 9)',
      )
      vcs.commit('D10:D15', '=INHERIT_FORMULA(D9)')

      vcs.commit(
        'E9',
        '=AS_NUMBER(FIND_FIRST(D9, INTO(DIGITS()))) * 10 + AS_NUMBER(FIND_LAST(D9, INTO(DIGITS())))',
      )
      vcs.commit('E10:E15', '=INHERIT_FORMULA(E9)')

      vcs.commit('B5', '=SUM(E9:E15)')
    } else if (window.location.search === '?demo-payroll') {
      vcs.commit('A1', 'Payroll')

      vcs.commit('A3', 'Employee')
      vcs.commit('B3', 'Hours')
      vcs.commit('C3', 'Total')
      vcs.commit('E3', 'Rate:')
      vcs.commit('F3', '=12.45')

      vcs.commit('A4', 'Alice')
      vcs.commit('B4', '40')

      vcs.commit('A5', 'Bob')
      vcs.commit('B5', '38')

      vcs.commit('A6', 'Charlie')
      vcs.commit('B6', '50')

      vcs.commit('A8', 'Total:')
      vcs.commit('B8', '=SUM(B4:B6)')
      vcs.commit('C4', '=ROUND(PRODUCT(B4, $F$3), 2)')
      vcs.commit('C5:C6', '=INHERIT_FORMULA(C4)')
      vcs.commit('C8', '=SUM(C4:C6)')
    } else if (window.location.search === '?demo-fat-burning-zone') {
      vcs.commit('A1', 'Fat Burning Zone')
      vcs.commit('A2', 'Age:')

      vcs.commit('A3', 'Max Heart Rate:')
      vcs.commit('B3', '=220 - B2')

      vcs.commit('A4', 'Lower End:')
      vcs.commit('B4', '=ROUND(PRODUCT(B3, 0.64))')
      vcs.commit('A5', 'Higher End:')
      vcs.commit('B5', '=ROUND(PRODUCT(B3, 0.76))')

      // Add some ages
      vcs.commit('B2', '20')
      vcs.commit('B2', '25')
      vcs.commit('B2', '30')
    } else if (window.location.search === '?demo-kitchen-sink') {
      vcs.commit('A1', 'Double it:')
      vcs.commit('B1', '2')
      vcs.commit('C1', '=PRODUCT(B1, 2)')
      vcs.commit('D1', '=PRODUCT(C1, 2)')
      vcs.commit('E1', '=PRODUCT(D1, 2)')
      vcs.commit('F1', 'Sum:')
      vcs.commit('G1', '=SUM(B1:E1)')
      vcs.commit('F2', 'Product:')
      vcs.commit('G2', '=PRODUCT(B1:E1)')
      vcs.commit('F3', 'Average:')
      vcs.commit('G3', '=AVERAGE(B1:E1)')

      vcs.commit('A2', 'Ref B1:')
      vcs.commit('B2', '=B1')

      vcs.commit('A3', 'Word 1:')
      vcs.commit('A4', 'Word 2:')
      vcs.commit('B3', 'Hello')
      vcs.commit('B4', 'World!')

      vcs.commit('A6', 'Concatenation:')
      vcs.commit('B6', '=CONCAT(B3, " ", B4)')
      vcs.commit('A7', 'Lowercase:')
      vcs.commit('B7', '=LOWER(B6)')
      vcs.commit('A8', 'Uppercase:')
      vcs.commit('B8', '=UPPER(B6)')

      vcs.commit('A10', 'Error handling:')
      vcs.commit('A11', 'Unknown fn:')
      vcs.commit('B11', '=FOOBAR(1, 2, 3)')

      vcs.commit('A12', 'Circular refs:')
      vcs.commit('B12', '=SUM(C12, 1)')
      vcs.commit('C12', '=SUM(C13, 1)')
      vcs.commit('C13', '=SUM(B13, 1)')
      vcs.commit('B13', '=SUM(B12, 1)')

      vcs.commit('D6', '\u03C0')
      vcs.commit('E6', '=PI()')

      vcs.commit('D7', '\u03C4')
      vcs.commit('E7', '=PRODUCT(PI(), 2)')

      vcs.commit('A14', 'Ref self')
      vcs.commit('B14', '=B14')
      vcs.commit('C14', '=SUM(C14, 1)')
      vcs.commit('D14', '=SUM(D13:D15)')

      vcs.commit('A15', 'Ref range B1:C1')
      vcs.commit('B15', '=B1:C1')

      vcs.commit('F5', 'Math:')
      vcs.commit('G5', '=1 + 2 * B2 / C1')

      vcs.commit('F9', 'Value:')
      vcs.commit('G9', 'Even or odd?')

      vcs.commit('F10', '5')
      vcs.commit('G10', '=IF(MOD(F10, 2) == 0, "Even", "Odd")')

      vcs.commit('F11', '8')
      vcs.commit('G11', '=IF(MOD(F11, 2) == 0, "Even", "Odd")')

      vcs.commit('F12', 'Date:')
      vcs.commit('G12', 'Today is:')
      vcs.commit('H12', '=TODAY()')

      vcs.commit('I12', 'Time:')
      vcs.commit('J12', '=TIME()')

      vcs.commit('G13', 'Now is:')
      vcs.commit('H13', '=NOW()')
      vcs.commit('G14', 'Day:')
      vcs.commit('H14', '=DAY(H12)')
      vcs.commit('G15', 'Month:')
      vcs.commit('H15', '=MONTH(H12)')
      vcs.commit('G16', 'Year:')
      vcs.commit('H16', '=YEAR(H12)')
      vcs.commit('G17', 'Hour:')
      vcs.commit('H17', '=HOUR(H13)')
      vcs.commit('G18', 'Minute:')
      vcs.commit('H18', '=MINUTE(H13)')
      vcs.commit('G19', 'Second:')
      vcs.commit('H19', '=SECOND(H13)')
      vcs.commit('I13', 'Tomorrow is:')
      vcs.commit('J13', '=ADD_DAYS(H12, 1)')
      vcs.commit('I14', 'Yesterday was:')
      vcs.commit('J14', '=SUB_DAYS(H12, 1)')
    }
  }, [vcs, spreadsheet])

  let move = useCallback((mutate: (location: Location) => void) => {
    return () => {
      setActiveCell((previous) => {
        // Parse the current cell
        let parsed = parseLocation(previous)

        // Mutate the location to the next cell
        mutate(parsed)

        // Print the new location
        let nextCell = printLocation(parsed)

        // Move focus to the corresponding button in the grid
        let btn = document.querySelector(`button[data-cell-button=${nextCell}]`)
        if (btn && btn.tagName === 'BUTTON') {
          ;(btn as HTMLButtonElement).focus()
        }

        // Update the active cell
        return nextCell
      })
    }
  }, [])

  // Move active cell
  let moveRight = move((loc) => {
    loc.col = Math.min(WIDTH, loc.col + 1)
  })
  let moveLeftFirst = move((loc) => {
    loc.col = 1
  })
  let moveLeft = move((loc) => {
    loc.col = Math.max(1, loc.col - 1)
  })
  let moveRightLast = move((loc) => {
    loc.col = WIDTH
  })
  let moveUp = move((loc) => {
    loc.row = Math.max(1, loc.row - 1)
  })
  let moveUpFirst = move((loc) => {
    loc.row = 1
  })
  let moveDown = move((loc) => {
    loc.row = Math.min(HEIGHT, loc.row + 1)
  })
  let moveDownLast = move((loc) => {
    loc.row = HEIGHT
  })

  // Update input value when cell value changes
  useEffect(() => {
    setValue(spreadsheet.get(cell))
  }, [cell, spreadsheet])

  // Generate grid
  let cells = useMemo(() => {
    return Array.from({
      length: (WIDTH + 1) * (HEIGHT + 1),
    }).fill(0)
  }, [])

  // Active cell location
  let location = useMemo(() => parseLocation(cell), [cell])

  // Evaluation of the current cell
  let out = error.get(cell) ?? spreadsheet.evaluate(cell, false)
  if (Array.isArray(out)) {
    out = {
      kind: EvaluationResultKind.ERROR,
      value: 'Current value did not result in a value',
    }
  }
  let tokens: Token[] = useMemo(() => {
    return value.length > 0
      ? tokenize(value[0] === '=' ? value.slice(1) : `"${value}"`)
      : []
  }, [value])

  // Cursor position
  let [cursor, setCursor] = useCursorPosition(inputRef)
  if (value[0] === '=') {
    cursor -= 1
  }

  // Figure out the token at the current position
  let tokenIdxAtPosition = useMemo(() => {
    return tokens.findIndex((token) => {
      return cursor >= token.span.start && cursor <= token.span.end
    })
  }, [tokens, cursor])

  // Autocomplete token at cursor position
  let identifierAtPosition = useMemo(() => {
    // We want an identifier
    if (tokens[tokenIdxAtPosition]?.kind !== TokenKind.IDENTIFIER) return null

    // It should be a function call, the open paren might not be there yet. We
    // do know that we definitely don't want a `:` right before it, because
    // that would be a cell range.
    if (tokens[tokenIdxAtPosition - 1]?.kind === TokenKind.COLON) return null

    return tokens[tokenIdxAtPosition]
  }, [tokens, tokenIdxAtPosition])

  // Active parentheses (and matching)
  let activeParens = useMemo(() => {
    if (
      tokens[tokenIdxAtPosition]?.kind !== TokenKind.OPEN_PAREN &&
      tokens[tokenIdxAtPosition]?.kind !== TokenKind.CLOSE_PAREN
    ) {
      return []
    }

    let paren = tokens[tokenIdxAtPosition]
    if (paren.kind === TokenKind.OPEN_PAREN) {
      let stack = 0

      // Find the matching closing paren
      for (let i = tokenIdxAtPosition + 1; i < tokens.length; i++) {
        if (tokens[i]?.kind === TokenKind.OPEN_PAREN) {
          stack++
        } else if (tokens[i]?.kind === TokenKind.CLOSE_PAREN && stack !== 0) {
          stack--
        } else if (tokens[i]?.kind === TokenKind.CLOSE_PAREN && stack === 0) {
          // biome-ignore lint/style/noNonNullAssertion: we just verified that the token at position `i` is an open paren.
          return [paren, tokens[i]!]
        }
      }
    } else if (paren.kind === TokenKind.CLOSE_PAREN) {
      let stack = 0

      // Find the matching opening paren
      for (let i = tokenIdxAtPosition - 1; i >= 0; i--) {
        if (tokens[i]?.kind === TokenKind.CLOSE_PAREN) {
          stack++
        } else if (tokens[i]?.kind === TokenKind.OPEN_PAREN && stack !== 0) {
          stack--
        } else if (tokens[i]?.kind === TokenKind.OPEN_PAREN && stack === 0) {
          // biome-ignore lint/style/noNonNullAssertion: we just verified that the token at position `i` is an open paren.
          return [paren, tokens[i]!]
        }
      }
    }

    return []
  }, [tokens, tokenIdxAtPosition])

  // Autocomplete suggestions
  let suggestions = useMemo(() => {
    if (identifierAtPosition === null) return []

    let prefix = identifierAtPosition.raw
    let matches = functionNames.filter((fn) => {
      return fn.toLowerCase().startsWith(prefix.toLowerCase())
    })

    return matches
  }, [functionNames, identifierAtPosition])

  // Dependencies of the current cell
  let dependencies = spreadsheet.dependencies(cell)
  let inheritedDependencies = spreadsheet.inheritedDependencies(cell)
  let spillDependencies = spreadsheet.spillDependencies(cell)

  // Drag and drop range selection
  let [rangeStartCell, setRangeStartCell] = useState<string | null>(null)
  let [rangeEndCell, setRangeEndCell] = useState<string | null>(null)
  let selectionRange = useMemo(() => {
    if (rangeStartCell === null || rangeEndCell === null) return new Set<string>()

    let start = parseLocation(rangeStartCell)
    let end = parseLocation(rangeEndCell)

    let cells = new Set<string>()

    let colStart = Math.min(start.col, end.col)
    let colEnd = Math.max(start.col, end.col)
    let rowStart = Math.min(start.row, end.row)
    let rowEnd = Math.max(start.row, end.row)

    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        cells.add(printLocation({ col, row, lock: 0 }))
      }
    }

    return cells
  }, [rangeStartCell, rangeEndCell])

  return (
    <div className="isolate flex h-screen w-screen flex-col overflow-hidden font-sans">
      <div className="flex items-center border-gray-300 border-b">
        <div className="w-16 shrink-0 py-1.5 text-center text-sm">{cell}</div>
        <div className="-ml-[2px] font-thin text-gray-300">|</div>
        <div
          ref={inputContainerRef}
          className="scrollbar-none has-data-unknown:ligatures-none has-focus:ligatures-none relative flex flex-1 overflow-auto"
        >
          <TokensOverlay
            tokens={tokens}
            activeParens={activeParens}
            enabled={value[0] === '='}
          />
          <Combobox
            virtual={{ options: suggestions }}
            immediate={suggestions.length > 0}
            value={value}
            onChange={(suggestion) => {
              if (suggestion === null) return
              if (identifierAtPosition === null) return

              // Replace the current token with the selected suggestion
              let prefix = identifierAtPosition
              let expression = value.slice(1)
              let cursorOffset = 0

              // Figure out if we need to add parentheses
              if (expression[prefix.span.end] !== '(') {
                // Add parentheses to the suggestion
                suggestion += '()'

                // Move over the cursor 1 position such that it's inside the
                // parentheses
                // TODO: Only do this if we know that the function takes arguments
                cursorOffset -= 1
              }

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
                prefix.span.start + suggestion.length + 1 + cursorOffset,
                prefix.span.start + suggestion.length + 1 + cursorOffset,
              )
            }}
          >
            {({ open }) => (
              <>
                <ComboboxInput
                  ref={inputRef}
                  className={clsx(
                    'flex-1 border-none px-2 py-1.5 focus:outline-hidden',
                    value[0] === '=' && 'font-mono',
                  )}
                  autoComplete="off"
                  value={value}
                  onChange={(e) => {
                    let value = e.target.value

                    // Auto-inject closing parentheses
                    let cursor = e.target.selectionStart ?? 0
                    let before = value.slice(0, cursor)
                    let after = value.slice(cursor)
                    let shouldInsertClosingParen =
                      // Typed a `(`
                      before[before.length - 1] === '(' &&
                      // Can only inject `)` if there is nothing after the
                      // cursor, or if there is a space after the cursor
                      (after === '' || after[0] === ' ')

                    if (shouldInsertClosingParen) {
                      // Insert the closing parentheses
                      value = `${before})${after}`

                      flushSync(() => {
                        setValue(value)
                      })

                      // Move the cursor back, such that it's inside the
                      // parentheses
                      e.target.setSelectionRange(cursor, cursor)
                    } else {
                      setValue(value)
                    }

                    // When the cell is empty, move focus back to the grid If you
                    // continue typing, the focus will be in the `input` again. But this
                    // allows us to immediately use arrow keys once you hit backspace
                    // (which cleared the input).
                    if (value === '') {
                      // Move focus back to the grid
                      let btn = document.querySelector(`button[data-cell-button=${cell}]`)
                      if (btn && btn.tagName === 'BUTTON') {
                        ;(btn as HTMLButtonElement).focus()
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // We can only submit the answer in 2 scenarios:
                      //
                      // 1. The combobox is closed
                      // 2. The combobox is open, but there are no suggestions
                      //
                      // Otherwise we want to select the suggestion and keep
                      // focus in the input.
                      if (open && suggestions.length > 0) return

                      let newValue = e.currentTarget.value

                      // Parse and pretty print the tokens (if it's a formula)
                      let prettyValue =
                        newValue[0] === '=' ? printTokens(tokenize(newValue)) : newValue

                      // Submit the new value
                      flushSync(() => {
                        vcs.commit(cell, prettyValue)
                        setValue(prettyValue)
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
                  onBlur={(e) => {
                    let newValue = e.currentTarget.value
                    let currentValue = spreadsheet.get(cell)

                    // Value hasn't changed
                    if (currentValue === newValue) return

                    // Parse and pretty print the tokens (if it's a formula)
                    let prettyValue =
                      newValue[0] === '=' ? printTokens(tokenize(newValue)) : newValue

                    // Value hasn't changed
                    if (currentValue === prettyValue) return

                    vcs.commit(cell, prettyValue)
                    setValue(prettyValue)
                  }}
                />
                <ComboboxOptions
                  modal={false}
                  anchor="bottom start"
                  className="inset-ring-1 inset-ring-black/10 z-20 w-96 overflow-auto rounded-md bg-white py-1.5 text-base shadow-lg [--anchor-gap:calc(var(--spacing)*2)] [--anchor-padding:calc(var(--spacing)*2)] empty:invisible focus:outline-hidden sm:text-sm"
                >
                  {({ option }: { option: keyof typeof functions }) => {
                    let signature = functions[option].signature

                    return (
                      <ComboboxOption
                        value={option}
                        className="group relative w-full cursor-default select-none px-3 py-2 text-gray-900 data-focus:bg-slate-100"
                      >
                        <span className="font-mono">{printSignature(signature)}</span>
                        <p className="not-group-data-focus:hidden text-xs">
                          {signature.description()}
                        </p>
                      </ComboboxOption>
                    )
                  }}
                </ComboboxOptions>
              </>
            )}
          </Combobox>
        </div>
        {out?.kind === EvaluationResultKind.ERROR && (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 font-medium text-red-700 text-xs ring-1 ring-red-600/10 ring-inset">
            <ExclamationTriangleIcon className="size-4 shrink-0 text-red-600" />
            <span className="tabular-nums">{out.value}</span>
          </span>
        )}
        <div className="flex gap-1 px-2">
          <button
            type="button"
            onClick={() => vcs.undo()}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-600 text-xs ring-1 ring-gray-500/10 ring-inset"
          >
            <ArrowUturnLeftIcon className="size-4 shrink-0 text-gray-400" />
          </button>
          <button
            type="button"
            onClick={() => vcs.redo()}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-600 text-xs ring-1 ring-gray-500/10 ring-inset"
          >
            <ArrowUturnRightIcon className="size-4 shrink-0 text-gray-400" />
          </button>
          <button
            type="button"
            onClick={() => setHistoryView((v) => !v)}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-600 text-xs ring-1 ring-gray-500/10 ring-inset"
          >
            <ClockIcon className="size-4 shrink-0 text-gray-400" />
          </button>
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
            '--row-header-width': 'calc(var(--spacing) * 16)',
            '--col-header-height': 'calc(var(--spacing) * 9)',
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
            }
          }}
        >
          {cells.map((_, idx) => {
            let row = Math.floor(idx / (WIDTH + 1))
            let col = idx % (WIDTH + 1)

            let id = printLocation({ col, row, lock: 0 })

            let [contents, alt] = (() => {
              // Top left corner
              if (row === 0 && col === 0) return [null, null]

              // Column labels
              if (row === 0) return [String.fromCharCode(64 + col), null]

              // Row labels
              if (col === 0) return [row, null]

              // Cell
              let out = error.get(id) ?? spreadsheet.evaluate(id)
              if (Array.isArray(out)) {
                out = {
                  kind: EvaluationResultKind.ERROR,
                  value: 'Current value did not result in a value',
                }
              }

              if (out.kind === EvaluationResultKind.ERROR) {
                return [
                  <span
                    key="error"
                    data-error=""
                    className="pointer-events-none inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 font-medium text-red-700 text-xs ring-1 ring-red-600/10 ring-inset"
                  >
                    <ExclamationTriangleIcon className="size-4 shrink-0 text-red-600" />
                    <span>Error</span>
                  </span>,
                  out.value,
                ]
              }

              return [
                <div
                  key="value"
                  className={clsx(
                    'pointer-events-none',
                    out.kind === EvaluationResultKind.NUMBER && 'truncate text-right',
                    out.kind === EvaluationResultKind.STRING && 'truncate text-left',
                    out.kind === EvaluationResultKind.BOOLEAN && 'text-center uppercase',
                    out.kind === EvaluationResultKind.DATETIME &&
                      'flex items-center justify-center gap-1 truncate text-left',
                    out.kind === EvaluationResultKind.DATETIME &&
                      out.date &&
                      out.time &&
                      'text-[8px]',
                  )}
                >
                  {out.kind === EvaluationResultKind.DATETIME && out.date ? (
                    <>
                      <CalendarIcon className="size-4 shrink-0 text-gray-400" />
                      {printEvaluationResult(out)}
                    </>
                  ) : out.kind === EvaluationResultKind.DATETIME &&
                    !out.date &&
                    out.time ? (
                    <>
                      <ClockIcon className="size-4 shrink-0 text-gray-400" />
                      {printEvaluationResult(out)}
                    </>
                  ) : (
                    printEvaluationResult(out)
                  )}
                </div>,
                printEvaluationResult(out),
              ] as const
            })()

            // Whether we are editing the current cell and can inject the
            // current cel as a reference or range or not.
            let isInjectable = row !== 0 && col !== 0 && cell !== id && editingExpression

            return (
              <div
                key={id}
                data-cell={id}
                className={clsx(
                  'group/cell relative grid',
                  'border-[0.5px] border-gray-200',

                  // Scrollable area offsets for sticky headers
                  '[--offset-padding:calc(var(--spacing)*2)]',
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

                  // Inherited dependency of the current cell
                  cell !== id &&
                    inheritedDependencies.has(id) &&
                    clsx(
                      'before:pointer-events-none before:absolute before:inset-0 before:border-emerald-500 before:border-dashed before:bg-emerald-200/20',
                      !inheritedDependencies.has(leftCell(id)) && 'before:border-l-2',
                      !inheritedDependencies.has(rightCell(id)) && 'before:border-r-2',
                      !inheritedDependencies.has(topCell(id)) && 'before:border-t-2',
                      !inheritedDependencies.has(bottomCell(id)) && 'before:border-b-2',
                    ),

                  // Inherited dependency of the current cell
                  cell !== id &&
                    spillDependencies.has(id) &&
                    clsx(
                      'before:pointer-events-none before:absolute before:inset-0 before:border-gray-500 before:border-dashed before:bg-gray-200/20',
                      !spillDependencies.has(leftCell(id)) && 'before:border-l-2',
                      !spillDependencies.has(rightCell(id)) && 'before:border-r-2',
                      !spillDependencies.has(topCell(id)) && 'before:border-t-2',
                      !spillDependencies.has(bottomCell(id)) && 'before:border-b-2',
                    ),

                  // Range selection
                  cell !== id &&
                    selectionRange.has(id) &&
                    clsx(
                      'before:pointer-events-none before:absolute before:inset-0 before:border-rose-500 before:border-dashed before:bg-rose-200/20',
                      !selectionRange.has(leftCell(id)) && 'before:border-l-2',
                      !selectionRange.has(rightCell(id)) && 'before:border-r-2',
                      !selectionRange.has(topCell(id)) && 'before:border-t-2',
                      !selectionRange.has(bottomCell(id)) && 'before:border-b-2',
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
                      behavior: 'auto',
                      block: 'nearest',
                      inline: 'nearest',
                    })
                  }
                }}
                onMouseEnter={isInjectable ? () => setRangeEndCell(id) : undefined}
                onMouseUp={
                  isInjectable
                    ? () => {
                        let start = inputRef.current?.selectionStart
                        if (start == null) return

                        let end = inputRef.current?.selectionEnd
                        if (end == null) return

                        // We do require a range
                        if (rangeStartCell === null) return

                        let rangeStart = rangeStartCell
                        let rangeEnd = id

                        // New contents to inject at the current cursor
                        // position.
                        let inject =
                          rangeStart === rangeEnd
                            ? id
                            : (() => {
                                let a = parseLocation(rangeStart)
                                let b = parseLocation(rangeEnd)

                                let min = {
                                  col: Math.min(a.col, b.col),
                                  row: Math.min(a.row, b.row),
                                  lock: 0,
                                }

                                let max = {
                                  col: Math.max(a.col, b.col),
                                  row: Math.max(a.row, b.row),
                                  lock: 0,
                                }

                                return `${printLocation(min)}:${printLocation(max)}`
                              })()

                        // SUM(A1|)
                        //       ^ Cursor position
                        if (tokens[tokenIdxAtPosition]?.kind === TokenKind.IDENTIFIER) {
                          // Before: SUM(B1|)
                          //               ^ Cursor position
                          //
                          // After:  SUM(B1, C1|)
                          //                   ^ Cursor position
                          //               ^^ Injected `, `, to start a new argument
                          inject = `, ${inject}`
                        }

                        // Set input value to the new value
                        flushSync(() => {
                          // Set new value
                          setValue((value) => {
                            let before = value.slice(0, start)
                            let after = value.slice(end)
                            let next = `${before}${inject}${after}`

                            // Ensure to evaluate the new value immediately
                            vcs.commit(cell, next)

                            return next
                          })
                        })

                        // Restore focus to the input
                        inputRef.current?.focus()

                        // Restore cursor position
                        inputRef.current?.setSelectionRange(
                          start + inject.length,
                          start + inject.length,
                        )

                        setCursor(start + inject.length)
                        setRangeStartCell(null)
                        setRangeEndCell(null)
                      }
                    : undefined
                }
              >
                <div className="absolute top-0 bottom-0 left-0 z-10 flex hidden group-hover/cell:block">
                  {isInjectable && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        // Prevent triggering the `onClick` and moving focus. We
                        // want to keep the focus in the input.
                        e.preventDefault()
                        e.stopPropagation()

                        // Remember the cell we started the drag from
                        setRangeStartCell(id)
                      }}
                      className="inset-ring inset-ring-gray-500/20 m-1 rounded-md rounded-md bg-white p-1"
                    >
                      <PlusIcon className="size-4 shrink-0 text-gray-400" />
                    </button>
                  )}
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
                    } else if (e.key === 'Enter' && spreadsheet.has(cell)) {
                      e.preventDefault()
                      // Move focus to the input, and start editing
                      inputRef.current?.focus()
                      inputRef.current?.select()
                    } else if (e.key === 'Enter' || e.key === 'Escape') {
                      e.preventDefault()
                    } else if (
                      e.key === 'ArrowUp' ||
                      e.key === 'ArrowDown' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight' ||
                      e.key === 'PageUp' ||
                      e.key === 'PageDown' ||
                      e.key === 'Home' ||
                      e.key === 'End'
                    ) {
                      // Already handled
                    } else {
                      // Move focus to the input, and start editing
                      inputRef.current?.focus()
                      inputRef.current?.select()
                    }
                  }}
                  className="min-w-0 px-2 py-1.5 focus:outline-hidden has-data-error:p-0"
                  title={alt ?? undefined}
                >
                  {contents}
                </button>
              </div>
            )
          })}
        </div>
        {historyView && (
          <div className="min-w-sm overflow-auto border-gray-200 border-l p-2">
            {vcs.history().map((commit, _, all) => {
              let cell = commit.undoArgs[0] as string

              return (
                <button
                  key={commit.id}
                  type="button"
                  onMouseMove={() => {
                    vcs.checkout(commit.id)

                    // Mark the cell as active
                    setActiveCell(cell)
                  }}
                  className={clsx(
                    'flex w-full items-center justify-between rounded-md bg-white p-2 hover:bg-gray-100',
                  )}
                >
                  <span className="font-mono text-xs">
                    {commit.id + 1}/{all.length}
                  </span>
                  <span className="font-mono">{cell}</span>
                  <div className="font-mono text-xs">
                    {format(commit.at, 'yyyy-MM-dd HH:mm:ss')}
                  </div>
                </button>
              )
            })}
          </div>
        )}
        {debugView && (
          <div className="min-w-sm overflow-auto border-gray-200 border-l">
            {(() => {
              if (!spreadsheet.has(cell)) {
                return (
                  <div className="flex items-center gap-2 p-2">
                    <span>Cell:</span>
                    <small>{cell}</small>
                  </div>
                )
              }

              let value = spreadsheet.get(cell)
              let expression = value[0] === '=' ? value.slice(1) : `"${value}"`
              let tokens = tokenize(expression)
              let ast = parse(tokens)
              let stringifiedAST = `=${printExpression(ast)}`
              let evaluation = spreadsheet.evaluate(cell)
              let result = error.get(cell) ?? evaluation
              if (Array.isArray(result)) {
                result = {
                  kind: EvaluationResultKind.ERROR,
                  value: 'Current value did not result in a value',
                }
              }

              return (
                <>
                  <div className="sticky top-0 flex h-(--col-header-height) justify-between border-gray-200 border-b bg-white">
                    <div className="flex items-center gap-2 px-2">
                      <span>Cell:</span>
                      <small>{cell}</small>
                    </div>
                    <div className="flex items-center gap-2 px-2">
                      <span>Result:</span>
                      <small className="whitespace-pre">
                        {printEvaluationResult(result)}
                      </small>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <span>Expression:</span>
                    <small className="whitespace-pre">{value}</small>
                  </div>
                  {value !== stringifiedAST && (
                    <div className="flex flex-col gap-2 p-2">
                      <span>Interpreted expression:</span>
                      <small className="whitespace-pre">{stringifiedAST}</small>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 p-2">
                    <span>Tokenization:</span>
                    <pre className="font-mono text-xs">
                      {JSON.stringify(tokens, null, 2)}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <span>AST:</span>
                    <pre className="font-mono text-xs">
                      {JSON.stringify(ast, null, 2)}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <span>Result:</span>
                    <pre className="font-mono text-xs">
                      {JSON.stringify(evaluation, null, 2)}
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

function topCell(cell: string) {
  let { col, row } = parseLocation(cell)
  return printLocation({ col, row: row - 1, lock: 0 })
}

function rightCell(cell: string) {
  let { col, row } = parseLocation(cell)
  return printLocation({ col: col + 1, row, lock: 0 })
}

function bottomCell(cell: string) {
  let { col, row } = parseLocation(cell)
  return printLocation({ col, row: row + 1, lock: 0 })
}

function leftCell(cell: string) {
  let { col, row } = parseLocation(cell)
  return printLocation({ col: col - 1, row, lock: 0 })
}

function useCursorPosition(input: MutableRefObject<HTMLInputElement | null>) {
  let [cursor, setCursor] = useState(0)

  useEffect(() => {
    let el = input.current
    if (!el) return

    let ac = new AbortController()

    function handle() {
      if (!el) return
      startTransition(() => {
        setCursor(el.selectionStart ?? 0)
      })
    }

    el.addEventListener('keydown', handle, { signal: ac.signal, passive: true })
    el.addEventListener('keyup', handle, { signal: ac.signal, passive: true })
    el.addEventListener('click', handle, { signal: ac.signal, passive: true })
    el.addEventListener('focus', handle, { signal: ac.signal, passive: true })
    el.addEventListener('blur', handle, { signal: ac.signal, passive: true })

    return () => ac.abort()
  }, [input])

  return [cursor, setCursor] as const
}

function TokensOverlay({
  enabled,
  tokens,
  activeParens,
}: {
  enabled: boolean
  tokens: Token[]
  activeParens: Token[]
}) {
  return (
    <div
      hidden={!enabled}
      className="pointer-events-none absolute top-1.5 left-2 font-mono"
    >
      {tokens.map((token, idx) => {
        let key = idx

        let color = (() => {
          // Parentheses
          if (
            (token.kind === TokenKind.OPEN_PAREN ||
              token.kind === TokenKind.CLOSE_PAREN) &&
            activeParens.includes(token)
          ) {
            return 'bg-gray-100 rounded text-black'
          }

          // Function
          if (
            token.kind === TokenKind.IDENTIFIER &&
            tokens[idx + 1]?.kind === TokenKind.OPEN_PAREN
          ) {
            return 'text-purple-500'
          }

          // Cell references
          {
            // Cell reference (without locks)
            //
            // Matches:        A1
            // Does not match: A1(
            //                   ^
            if (
              token.kind === TokenKind.IDENTIFIER &&
              tokens[idx + 1]?.kind !== TokenKind.OPEN_PAREN
            ) {
              return 'text-amber-500'
            }

            // Locked row, styling the `$` character
            //
            // Matches:        $A1
            // Does not match: $A1(
            //                    ^
            if (
              token.kind === TokenKind.DOLLAR &&
              tokens[idx + 1]?.kind === TokenKind.IDENTIFIER &&
              tokens[idx + 2]?.kind !== TokenKind.OPEN_PAREN
            ) {
              return 'text-amber-500'
            }

            // Locked row, styling the `$` character
            //
            // Matches:        A$1
            // Does not match: A$1(
            //                    ^
            if (
              token.kind === TokenKind.DOLLAR &&
              tokens[idx - 1]?.kind === TokenKind.IDENTIFIER &&
              tokens[idx + 1]?.kind === TokenKind.NUMBER_LITERAL &&
              tokens[idx + 2]?.kind !== TokenKind.OPEN_PAREN
            ) {
              return 'text-amber-500'
            }

            // Cell range, styling the `:` character
            //
            // Matches:         A1:B2
            //                 A$1:B$2
            // Does not match:  A1:B2(
            //                       ^
            if (
              token.kind === TokenKind.COLON &&
              //
              (tokens[idx - 1]?.kind === TokenKind.IDENTIFIER ||
                tokens[idx - 1]?.kind === TokenKind.NUMBER_LITERAL) &&
              //
              (tokens[idx + 1]?.kind === TokenKind.IDENTIFIER ||
                tokens[idx + 1]?.kind === TokenKind.DOLLAR)
            ) {
              return 'text-amber-500'
            }

            // Locked row, styling the `$` character
            //
            // Matches: A$1
            //            ^
            if (
              token.kind === TokenKind.NUMBER_LITERAL &&
              tokens[idx - 1]?.kind === TokenKind.DOLLAR
            ) {
              return 'text-amber-500'
            }
          }

          // Numbers
          if (token.kind === TokenKind.NUMBER_LITERAL) return 'text-blue-500'

          // Strings
          if (token.kind === TokenKind.STRING_LITERAL) return 'text-green-500'

          // Unknown
          if (token.kind === TokenKind.UNKNOWN) return 'text-red-500'

          // Parentheses
          if (
            token.kind === TokenKind.OPEN_PAREN ||
            token.kind === TokenKind.CLOSE_PAREN
          ) {
            return 'text-gray-500'
          }

          return ''
        })()

        return (
          <div
            key={key}
            data-unknown={token.kind === TokenKind.UNKNOWN ? '' : undefined}
            style={{ '--start': `${token.span.start}ch` } as CSSProperties}
            className={clsx(
              'absolute translate-x-[calc(1ch+var(--scroll-offset,0px)+var(--start))] whitespace-pre',
              color,
            )}
          >
            {token.raw}
          </div>
        )
      })}
    </div>
  )
}
