export enum EvaluationResultKind {
  ERROR = 'ERROR',
  EMPTY = 'EMPTY',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  DATETIME = 'DATETIME',
}

export const EvaluationResultKinds = [
  EvaluationResultKind.ERROR,
  EvaluationResultKind.EMPTY,
  EvaluationResultKind.NUMBER,
  EvaluationResultKind.STRING,
  EvaluationResultKind.BOOLEAN,
  EvaluationResultKind.DATETIME,
]

export type EvaluationResult =
  | { kind: EvaluationResultKind.ERROR; value: string }
  | { kind: EvaluationResultKind.EMPTY; value: string }
  | { kind: EvaluationResultKind.NUMBER; value: number }
  | { kind: EvaluationResultKind.STRING; value: string }
  | { kind: EvaluationResultKind.BOOLEAN; value: boolean }
  | { kind: EvaluationResultKind.DATETIME; value: Date; date: boolean; time: boolean }

export type EvaluationResultError = Extract<
  EvaluationResult,
  { kind: EvaluationResultKind.ERROR }
>
export type EvaluationResultEmpty = Extract<
  EvaluationResult,
  { kind: EvaluationResultKind.EMPTY }
>
export type EvaluationResultNumber = Extract<
  EvaluationResult,
  { kind: EvaluationResultKind.NUMBER }
>
export type EvaluationResultString = Extract<
  EvaluationResult,
  { kind: EvaluationResultKind.STRING }
>
export type EvaluationResultBoolean = Extract<
  EvaluationResult,
  { kind: EvaluationResultKind.BOOLEAN }
>
export type EvaluationResultDateTime = Extract<
  EvaluationResult,
  { kind: EvaluationResultKind.DATETIME }
>
