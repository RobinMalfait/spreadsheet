import * as dateFunctions from '~/domain/functions/date'
import * as logicFunctions from '~/domain/functions/logic'
import * as mathFunctions from '~/domain/functions/math'
import * as sequenceFunctions from '~/domain/functions/sequence'
import * as statisticsFunctions from '~/domain/functions/statistics'
import * as textFunctions from '~/domain/functions/text'
import * as typeFunctions from '~/domain/functions/types'
import { type Signature, TagKind, printSignature } from '~/domain/signature/parser'

const collator = new Intl.Collator('en', { sensitivity: 'base' })

const categories = [
  ['Date functions', dateFunctions],
  ['Logic functions', logicFunctions],
  ['Math functions', mathFunctions],
  ['Sequence functions', sequenceFunctions],
  ['Statistical functions', statisticsFunctions],
  ['Text functions', textFunctions],
  ['Type functions', typeFunctions],
] as const

const README = Bun.file('README.md')
const contents = await README.text()

const PLACEHOLDER = /<!-- start:functions -->([\s\S]*)<!-- end:functions -->/g

function generateDocs() {
  let out = ''
  for (let [category, fns] of categories) {
    let functionNames = Array.from(Object.keys(fns).sort(collator.compare).entries())

    out += `## ${category} (${functionNames.length})\n\n`

    for (let [idx, name] of functionNames) {
      // @ts-expect-error
      let signature = fns[name as keyof typeof fns].signature as Signature

      out += `#### ${idx + 1}. \`${printSignature(signature)}\`\n\n`
      out += `${signature.description()}\n\n`

      // Param information
      for (let tag of signature.tags) {
        if (tag.kind !== TagKind.PARAM) continue

        out += `- \`${tag.name}\`: ${tag.value}\n`
      }

      out += '\n'
    }
  }

  return out.trim()
}

Bun.write(
  README,
  contents.replace(
    PLACEHOLDER,
    `<!-- start:functions -->\n\n${generateDocs()}\n\n<!-- end:functions -->`,
  ),
)
