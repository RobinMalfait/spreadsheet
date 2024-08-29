export enum EvaluationResultKind {
  ERROR = 'ERROR',
  EMPTY = 'EMPTY',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  DATETIME = 'DATETIME',
}

export type EvaluationResult =
  | { kind: EvaluationResultKind.ERROR; value: string }
  | { kind: EvaluationResultKind.EMPTY; value: string }
  | { kind: EvaluationResultKind.NUMBER; value: number }
  | { kind: EvaluationResultKind.STRING; value: string }
  | { kind: EvaluationResultKind.BOOLEAN; value: boolean }
  | { kind: EvaluationResultKind.DATETIME; value: Date; date: boolean; time: boolean }
