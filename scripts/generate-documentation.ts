import { setSystemTime } from 'bun:test'
import { printEvaluationResult } from '~/domain/evaluation'
import * as dateFunctions from '~/domain/functions/date'
import * as logicFunctions from '~/domain/functions/logic'
import * as mathFunctions from '~/domain/functions/math'
import * as sequenceFunctions from '~/domain/functions/sequence'
import * as statisticsFunctions from '~/domain/functions/statistics'
import * as textFunctions from '~/domain/functions/text'
import * as typeFunctions from '~/domain/functions/types'
import { type Signature, TagKind, printSignature } from '~/domain/signature/parser'
import { Spreadsheet } from '~/domain/spreadsheet'

const collator = new Intl.Collator('en', { sensitivity: 'base' })

// Mock the current date/time, so that the examples are deterministic
setSystemTime(new Date(2013, 0, 21, 8, 15, 20))

const categories = [
  ['Date functions', dateFunctions],
  ['Logic functions', logicFunctions],
  ['Math functions', mathFunctions],
  ['Sequence functions', sequenceFunctions],
  ['Statistical functions', statisticsFunctions],
  ['Text functions', textFunctions],
  ['Type functions', typeFunctions],
] as const

const spreadsheet = new Spreadsheet()

const README = Bun.file('README.md')
const contents = await README.text()

const PLACEHOLDER = /<!-- start:functions -->([\s\S]*)<!-- end:functions -->/g

function generateDocs() {
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

    out += `### ${category} (${functionNames.length})\n\n`

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
      for (let tag of signature.tags) {
        if (tag.kind !== TagKind.EXAMPLE) continue

        spreadsheet.set('A1', `=${tag.value}`)

        out += '\n```ts\n'
        out += `=${tag.value}\n`
        out += `// ${printEvaluationResult(spreadsheet.evaluate('A1'))}`
        out += '\n```\n'
      }

      if (idx === functionNames.length - 1) {
        out += '\n'
      } else {
        out += '\n---\n\n'
      }
    }
  }

  return out.trim().replace(/\n{3,}/g, '\n\n')
}

Bun.write(
  README,
  contents.replace(
    PLACEHOLDER,
    `<!-- start:functions -->\n\n${generateDocs()}\n\n<!-- end:functions -->`,
  ),
)
