<template>
  <div class="filter-panel">
    <div class="category-container">
      <h2 class="category">
        {{ category }} <br><span class="step-count">（{{ stepCount }} ステップ）</span>
      </h2>
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          :key="question.key"
          class="question-nav-container"
        >
          <button
            class="nav-button prev"
            @click="prevQuestion"
          >
            <span class="nav-button-text">▲</span>
          </button>
          <div class="question-container">
            <h3 class="question">
              {{ question.text }}
            </h3>
            <div class="options">
              <button
                v-for="option in options"
                :key="option.label"
                class="option-card"
                :class="{ selected: selectedOption?.value === option.value }"
                @click="selectOption(option.value)"
              >
                <span class="icon">{{ option.icon }}</span>
                <span class="label">{{ option.label }}</span>
              </button>
            </div>
          </div>
          <button
            class="nav-button next"
            @click="nextQuestion"
          >
            <span class="nav-button-text">▲</span>
          </button>
        </div>
      </transition>
      <button
        class="skip-button"
        @click="skipCategory"
      >
        {{ skipButtonText }}
      </button>
      <button
        class="result-button"
        @click="showResults"
      >
        結果を見る
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question, Answer } from '~/types/featureSearch'

const props = defineProps<{
  category: string
  question: Question
  stepCount: number
  firstCategory: string
}>()

const emit = defineEmits<{
  (e: 'select', value: Answer): void
  (e: 'skip', value: Answer[]): void
  (e: 'show-results' | 'prev' | 'next'): void
}>()

// 質問の回答（選択肢）
const selectedOption = ref<Answer | null>(null)
// カテゴリスキップ用の回答配列
const answersByCurrentCategory = ref<Answer[]>([])
// カテゴリの最初の質問かどうか
const isFirstQuestionInCategory = ref(true)
// 前のカテゴリ
const previousCategory = ref(props.firstCategory)

const options = [
  { label: 'Yes', value: true, icon: '✔️' },
  { label: 'No', value: false, icon: '❌' },
  { label: 'Unknown', value: null, icon: '❔' },
]

// 初期化時に前回の回答を取得
if (useAnswers().answers.value.size > 0) {
  const answerBool = useAnswers().getAnswer(props.question.key)
  if (answerBool !== undefined) {
    selectedOption.value = {
      key: props.question.key,
      value: answerBool,
      category: props.category,
    }
  }
}

const selectOption = (value: boolean | null) => {
  selectedOption.value = {
    key: props.question.key,
    value,
    category: props.category,
  }
  answersByCurrentCategory.value.push(selectedOption.value)
  emit('select', selectedOption.value)
}

const skipCategory = () => {
  emit('skip', answersByCurrentCategory.value)
}

const showResults = () => {
  emit('show-results')
}

const prevQuestion = () => {
  emit('prev')
}

const nextQuestion = () => {
  emit('next')
}

const skipButtonText = computed(() => {
  return isFirstQuestionInCategory.value ? 'カテゴリをスキップ' : 'カテゴリの残りをスキップ'
})

watch(() => isFirstQuestionInCategory.value, (newValue) => {
  if (newValue) {
    answersByCurrentCategory.value = []
  }
})

// 質問が変わったらselectedOptionを更新
watch(() => props.question, (newQuestion) => {
  const answerBool = useAnswers().getAnswer(newQuestion.key)
  if (answerBool !== undefined) {
    selectedOption.value = {
      key: newQuestion.key,
      value: answerBool,
      category: props.category,
    }
  }
  else {
    selectedOption.value = null
  }
})

// カテゴリと質問が変わったらisFirstQuestionInCategoryを計算し、answersByCurrentCategoryを初期化
watch([() => props.category, () => props.question], ([newCategory]) => {
  if (newCategory !== previousCategory.value) {
    isFirstQuestionInCategory.value = true
    answersByCurrentCategory.value = []
    previousCategory.value = newCategory
  }
  else {
    isFirstQuestionInCategory.value = false
  }
})
</script>

<style scoped>
.filter-panel {
    text-align: center;
}

.category-container {
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.category {
    font-size: 1.25rem;
    margin: 0;
}

.question-container {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
}

.options {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
    /* レスポンシブ対応のために追加 */
}

.option-card {
    flex: 1 1 calc(33.333% - 1rem);
    /* 各ボタンが均等に並ぶように設定 */
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    /* パディングとボーダーを含めてサイズを計算 */
}

.option-card.selected {
    background-color: #66bb6a;
    color: white;
}

.question-nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 0.15rem;
    border-radius: 8px;
    margin-top: 1rem;
    position: relative;
    height: 100%;
}

.nav-button {
    padding: 7.5em 0.25rem;
    border: none;
    background-color: #ffffff;
    cursor: pointer;
    border-radius: 4px;
    height: 100%;
}

.nav-button:hover {
    background-color: #e0e0e0;
}

.nav-button-text {
    display: inline-block;
}

.nav-button.prev .nav-button-text {
    transform: rotate(270deg);
}

.nav-button.next .nav-button-text {
    transform: rotate(90deg);
}

.skip-button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #ffffff;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 1rem;
    margin-right: 1rem;
    /* ボタン間のマージンを追加 */
}

.skip-button:hover {
    background-color: #e0e0e0;
}

.result-button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 1rem;
}

.result-button:hover {
    background-color: #66bb6a;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0.7;
}

.step-count {
    font-size: 0.8rem;
    color: #666;
}
</style>
