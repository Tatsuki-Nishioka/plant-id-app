export type Question = {
  category: string
  key: string
  text: string
}

export type Answer = {
  category: string
  key: string
  value: boolean | null
}

export type AnswerMap = Map<string, boolean | null>
