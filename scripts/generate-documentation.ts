import { setSystemTime } from 'bun:test'
import { AstKind } from '~/domain/ast'
import { printEvaluationResult } from '~/domain/evaluation'
import { EvaluationResultKind } from '~/domain/evaluation-result'
import { parse, printExpression } from '~/domain/expression'
import * as dateFunctions from '~/domain/functions/date'
import * as engineeringFunctions from '~/domain/functions/engineering'
import * as logicFunctions from '~/domain/functions/logic'
import * as lookupFunctions from '~/domain/functions/lookup'
import * as mathFunctions from '~/domain/functions/math'
import * as privilegedFunctions from '~/domain/functions/privileged'
import * as sequenceFunctions from '~/domain/functions/sequence'
import * as statisticsFunctions from '~/domain/functions/statistics'
import * as textFunctions from '~/domain/functions/text'
import * as typeFunctions from '~/domain/functions/types'
import { type Signature, TagKind, printSignature } from '~/domain/signature/parser'
import { Spreadsheet } from '~/domain/spreadsheet'
import { tokenize } from '~/domain/tokenizer'
import { WalkAction, walk } from '~/domain/walk-ast'
import { visualizeSpreadsheet } from '~/test/utils'

const collator = new Intl.Collator('en', { sensitivity: 'base' })

// Mock the current date/time, so that the examples are deterministic
setSystemTime(new Date(2013, 0, 21, 8, 15, 20))

const categories = [
  ['Date functions', dateFunctions],
  ['Engineering functions', engineeringFunctions],
  ['Logic functions', logicFunctions],
  ['Lookup functions', lookupFunctions],
  ['Math functions', mathFunctions],
  ['Sequence functions', sequenceFunctions],
  ['Statistical functions', statisticsFunctions],
  ['Text functions', textFunctions],
  ['Type functions', typeFunctions],
  ['Privileged functions', privilegedFunctions],
] as const
const ALL_FUNCTION_NAMES = new Map(categories.flatMap(([_, fns]) => Object.entries(fns)))

const README = Bun.file('README.md')
const contents = await README.text()

const PLACEHOLDER = /<!-- start:functions -->([\s\S]*)<!-- end:functions -->/g

function generateDocs() {
  let totalFns = 0
  let out = ''

  out += categories
    .flatMap(([category, fns]) => {
      return [
        `- [${category}](#${category.toLowerCase().replace(/ /g, '-')})`,
        ...Object.keys(fns).map((name) => {
          // @ts-expect-error
          let signature = fns[name as keyof typeof fns].signature as Signature

          return `   - [${printSignature(signature)}](#${signature.name.toLowerCase()})`
        }),
      ]
    })
    .join('\n')

  out += '\n\n'

  for (let [category, fns] of categories) {
    let functionNames = Array.from(Object.keys(fns).sort(collator.compare).entries())

    totalFns += functionNames.length

    out += `### ${category}\n\n`

    for (let [idx, name] of functionNames) {
      // @ts-expect-error
      let signature = fns[name as keyof typeof fns].signature as Signature

      // Custom header link
      out += `<a name="${signature.name.toLowerCase()}"></a>\n`

      // Header
      out += `#### ${printSignature(signature)}\n\n`

      // Link back to the top
      out += '[Back to top](#functions)\n\n'

      // Description
      out += `${signature.description()}\n\n`

      // Param information
      for (let tag of signature.tags) {
        if (tag.kind !== TagKind.PARAM) continue

        out += `- \`${tag.name}\`: ${tag.value}\n`
      }

      // Evaluate examples
      {
        let examples = signature.tags.filter((tag) => tag.kind === TagKind.EXAMPLE)
        if (examples.length > 0) {
          out += `\n#### ${examples.length === 1 ? 'Example' : 'Examples'}:\n\n`
        }

        for (let tag of examples) {
          // Start of the example block
          out += '\n```ts\n'

          // Figure out the functions that we rely on
          let dependencies = new Set()
          let tokens = tokenize(tag.value)
          let ast = parse(tokens)
          walk([ast], (node) => {
            if (node.kind !== AstKind.FUNCTION) return WalkAction.Continue
            if (ast === node) return WalkAction.Continue

            // Skip unknown functions
            if (!ALL_FUNCTION_NAMES.has(node.name)) return WalkAction.Continue

            let signature = ALL_FUNCTION_NAMES.get(node.name)?.signature as Signature

            // Skip internal functions
            if (signature.internal) return WalkAction.Skip

            dependencies.add(printExpression(node))
            return WalkAction.Continue
          })

          if (dependencies.size > 0) {
            out += '// Dependencies:\n'
            for (let dep of dependencies) {
              let spreadsheet = new Spreadsheet()
              spreadsheet.set('A1', `=${dep}`)
              let result = spreadsheet.evaluate('A1')
              if (spreadsheet.spillDependencies('A1').size > 0) {
                out += `=${dep}\n`
                out += `${visualizeSpreadsheet(spreadsheet)
                  .trim()
                  .split('\n')
                  .map((line) => `// ${line}`)
                  .join('\n')}\n`
              } else {
                out += `=${dep} // ${
                  result?.kind === EvaluationResultKind.STRING
                    ? `"${printEvaluationResult(result)}"`
                    : printEvaluationResult(result)
                }\n`
              }
            }
            out += '\n'
          }

          // Prepare the spreadsheet
          let spreadsheet = new Spreadsheet()
          spreadsheet.set('A1', `=${tag.value}`)

          out += `=${tag.value}\n`
          let result = spreadsheet.evaluate('A1')
          if (spreadsheet.spillDependencies('A1').size > 0) {
            out += visualizeSpreadsheet(spreadsheet)
              .trim()
              .split('\n')
              .map((line) => `// ${line}`)
              .join('\n')
          } else {
            if (result?.kind === EvaluationResultKind.STRING) {
              out += `// "${printEvaluationResult(result)}"`
            } else {
              out += `// ${printEvaluationResult(result)}`
            }
          }

          // End of the example block
          out += '\n```\n'
        }
      }

      // Separator
      if (idx === functionNames.length - 1) {
        out += '\n'
      } else {
        out += '\n---\n\n'
      }
    }
  }

  out = `There are **${totalFns}** built-in functions available.\n\n${out}`

  return out.trim().replace(/\n{3,}/g, '\n\n')
}

Bun.write(
  README,
  contents.replace(
    PLACEHOLDER,
    `<!-- start:functions -->\n\n${generateDocs()}\n\n<!-- end:functions -->`,
  ),
)
