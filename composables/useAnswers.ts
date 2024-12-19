import { useState } from '#app'
import type { Answer, AnswerMap } from '~/types/featureSearch'

/**
 * 回答の状態管理
 */
export function useAnswers() {
  const answers = useState<AnswerMap>('answers', () => new Map())

  const setAnswer = (key: string, value: boolean | null) => {
    answers.value.set(key, value)
  }

  const getAnswer = (key: string) => {
    return answers.value.get(key)
  }

  const skipRange = (rangeKeys: string[], answered: Answer[]) => {
    rangeKeys.forEach((key) => {
      if (!answered.some(a => a.key === key) && !answers.value.has(key)) {
        answers.value.set(key, null)
      }
    })
    answered.forEach((answered) => {
      answers.value.set(answered.key, answered.value)
    })
  }

  const resetAnswers = () => {
    answers.value.clear()
  }

  return { answers, setAnswer, getAnswer, skipRange, resetAnswers }
}
