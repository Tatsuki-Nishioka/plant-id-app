<template>
  <div class="progress-bar-container" @click="showModal">
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressWidth + '%' }" />
    </div>
    <div class="progress-info">
      <div class="left">
        <span>該当分類群: {{ filteredCount }}</span>
      </div>
      <div class="right">
        <span>ステップ: {{ displayStep }} / {{ totalSteps }}</span>
        <span class="info-icon">ⓘ</span>
      </div>
    </div>
  </div>
  <CharacterModal v-model:model-value="isModalVisible" :title="modalTitle" :content="modalContent" />
</template>

<script setup lang="ts">
import type { ModalContent } from './CharacterModal.vue';

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
  filteredCount: number;
}>();

const isModalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref<ModalContent[]>([]);

const displayStep = computed(() => {
  return Math.min(props.currentStep + 1, props.totalSteps);
});

const progressWidth = computed(() => {
  return (props.currentStep / props.totalSteps) * 100;
});

const showModal = () => {
  // 初期化
  modalContent.value = [];

  isModalVisible.value = true;
  modalTitle.value = "現在の回答";

  useAnswers().answers.value.forEach((answer, index) => {
    let answerText = "Unknown";
    if (answer === true) {
      answerText = "Yes";
    } else if (answer === false) {
      answerText = "No";
    }

    const content = {
      key: index,
      title: usePlantData().characterSet.value[index].characterJpn,
      answer: answerText,
    }

    modalContent.value.push(content);
  });
};
</script>

<style scoped>
.progress-bar-container {
  cursor: pointer;
}
.progress-bar {
  position: relative;
  height: 15px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #76c7c0;
  transition: width 0.3s;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8rem;
}

.left {
  flex: 1;
  text-align: left;
}

.right {
  flex: 1;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.info-icon {
  margin-left: 1rem;
  font-weight: bolder;
}
</style>