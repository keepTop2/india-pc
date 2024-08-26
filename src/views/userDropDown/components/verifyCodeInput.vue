<template>
  <div class="verification-container">
    <input v-for="(code, index) in verificationCodes" :key="index" v-model="verificationCodes[index]"
      @input="handleInput(index, $event)" @keydown="handleKeyDown(index, $event)" maxlength="1"
      class="verification-input" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, nextTick } from 'vue';

const emits = defineEmits(['emailCode']);
const verificationCodes = ref(['', '', '', '', '', '']);

const handleInput = (index, event) => {
  const value = event.target.value;
  verificationCodes.value[index] = value;

  // 判断是否输入完成
  if (verificationCodes.value.join('').length === 6) {
    emits('emailCode', verificationCodes.value.join(''));
  }

  // 自动跳到下一个输入框
  if (value && index < verificationCodes.value.length - 1) {
    const nextInput = event.target.nextElementSibling;
    if (nextInput) {
      nextTick(() => {
        nextInput.focus();
      });
    }
  }
};
const handleKeyDown = (index, event) => {
  // 处理删除操作
  if (event.key === 'Backspace' && !event.target.value && index > 0) {
    const prevInput = event.target.previousElementSibling;
    if (prevInput) {
      nextTick(() => {
        prevInput.focus();
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import '../index';

.verification-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
}

input {
  width: 42px;
  height: 54px;
  //margin: 0 0.5em;
  font-size: 18px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid #2c2e33;

  @include themeify {
    background-color: themed('Bg2');
    border: 1px solid themed('Bg3');
    color: themed("Text1");
  }
}

input:focus {
  outline: none;
}

.code-active {
  border-color: #fff;
}
</style>
