import { type Token, TokenKind } from '~/domain/signature/tokenizer'

interface Argument {
  name: string
  types: string[]

  optional: boolean
  variadic: boolean
}

export interface Signature {
  name: string
  args: Argument[]
}

export function parse(tokens: Token[]): Signature {
  // FOO()
  // ^^^
  let name = tokens.shift()
  if (name?.kind !== TokenKind.IDENTIFIER) {
    throw new Error('Expected a function name')
  }

  // FOO(…)
  //    ^
  let openParen = tokens.shift()
  if (openParen?.kind !== TokenKind.OPEN_PAREN) {
    throw new Error('Expected an open parenthesis')
  }

  // FOO(…)
  //      ^
  let closeParen = tokens[tokens.length - 1]
  if (closeParen?.kind !== TokenKind.CLOSE_PAREN) {
    throw new Error('Expected a close parenthesis')
  }

  // FOO(…)
  //     ^
  let args: Argument[] = []

  while (tokens.length > 0) {
    // FOO(x: NUMBER)
    //     ^
    let next = tokens.shift()
    if (next?.kind === TokenKind.CLOSE_PAREN) break

    let arg: Argument = {
      name: '',
      types: [],
      optional: false,
      variadic: false,
    }

    // FOO(...values: NUMBER)
    //     ^^^
    if (next?.kind === TokenKind.VARIADIC_MARKER) {
      arg.variadic = true
      next = tokens.shift()
    }

    // FOO(x: NUMBER)
    //     ^
    if (next?.kind !== TokenKind.IDENTIFIER) {
      throw new Error('Expected a variable name')
    }

    arg.name = next.value
    next = tokens.shift()

    // FOO(x?: NUMBER)
    //      ^
    if (next?.kind === TokenKind.QUESTION_MARK) {
      arg.optional = true
      next = tokens.shift()
    }

    // FOO(x: NUMBER)
    //      ^
    if (next?.kind !== TokenKind.COLON) {
      throw new Error('Expected a colon and a type, e.g.: `: NUMBER`')
    }

    next = tokens.shift() // Skip the colon

    // FOO(x: NUMBER)
    //        ^^^^^^
    if (next?.kind !== TokenKind.IDENTIFIER) {
      throw new Error('Expected a type, e.g.: `NUMBER`')
    }

    arg.types.push(next.value)
    next = tokens.shift()

    // FOO(x: NUMBER, y: NUMBER, z: NUMBER)
    //     ^^^^^^^^^  ^^^^^^^^^  ^^^^^^^^^
    while (next?.kind !== TokenKind.COMMA && next?.kind !== TokenKind.CLOSE_PAREN) {
      // FOO(x: NUMBER | STRING)
      //               ^
      if (next?.kind !== TokenKind.OR) {
        throw new Error(
          `Expected a \`|\`, \`,\` or \`)\`, got ${next ? `\`${next.kind}(${next.raw})\`` : '<nothing>'}`,
        )
      }

      next = tokens.shift()

      // FOO(x: NUMBER | STRING)
      //                 ^^^^^^
      if (next?.kind !== TokenKind.IDENTIFIER) {
        throw new Error('Expected a type after the `|`')
      }

      arg.types.push(next.value)
      next = tokens.shift()
    }

    args.push(arg)
  }

  return {
    name: name.value,
    args,
  } satisfies Signature
}

export function printSignature(signature: Signature): string {
  return `${signature.name}(${signature.args
    .map((arg) => {
      let types = arg.types.join(' | ')
      return `${arg.variadic ? '...' : ''}${arg.name}${arg.optional ? '?' : ''}: ${types}`
    })
    .join(', ')})`
}
