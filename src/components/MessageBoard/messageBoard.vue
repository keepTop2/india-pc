<template>
	<div class="board">
		<div ref="editableDiv" class="message" type="text" contenteditable="true" @input="limitCharacters()"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

/**
 * @name 苏秦
 * @params maxLength 字符长度
 */
const props = withDefaults(
	defineProps<{
		maxLength?: number;
		modelValue?: string | number;
	}>(),
	{ maxLength: 500, modelValue: '' }
);

const editableDiv: Ref<HTMLElement | null> = ref(null);

const emit = defineEmits(['update:modelValue']);

// 处理字符
function limitCharacters() {
	const text = editableDiv.value?.textContent;
	const selection = window.getSelection();

	if (text && text.length > props.maxLength) {
		const startPos = selection?.focusOffset;
		if (editableDiv.value) {
			editableDiv.value.textContent = text.slice(0, props.maxLength);
			const newOffset = Math.min(startPos ?? 0, props.maxLength);
			setCursorPosition(editableDiv.value, newOffset);
		}
	}
	emit('update:modelValue', editableDiv.value?.textContent);
}

// 处理截取之后光标位置
function setCursorPosition(element: HTMLElement, offset: number) {
	const range = document.createRange();
	const selection = window.getSelection();
	if (element && element.firstChild && selection) {
		range.setStart(element.firstChild, offset);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}
</script>

<style scoped lang="scss">
.board {
	width: 100%;
	margin-top: 8px;
	border-radius: 20px;
	border: 1px solid;
	@include themeify {
		background: themed('Bg1');
		border-color: themed('Line');
	}
	box-sizing: border-box;
	.message {
		width: 100%;
		height: 96px;
		margin: 12px 0px;
		padding: 0px 12px;
		word-wrap: break-word;
		overflow-wrap: break-word;
		overflow: scroll;
		box-sizing: border-box;
		@include themeify {
			color: themed('Text1');
		}
		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
	}
	:focus-visible {
		outline: none;
	}
}
</style>
