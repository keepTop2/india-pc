<template>
	<button class="button" :disabled="props.type === 'disabled'">
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		/**
		 * default 默认高亮
		 * disabled 默认未高亮且禁用
		 */
		type?: 'default' | 'disabled';
	}>(),
	{
		type: 'default',
	}
);
</script>

<style scoped lang="scss">
.button {
	width: 100%;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0px 10px;
	border: 0;
	border-radius: 4px;
	@include themeify {
		background: themed('Theme');
		color: themed('Text_a');
	}
	text-align: center;
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 500;
	box-sizing: border-box;
	transition: all 0.2s ease;
	cursor: pointer;
}

.button:active {
	transform: scale(0.98);
}

.button:disabled {
	width: 100%;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0px 10px;
	border: 0;
	border-radius: 4px;
	@include themeify {
		background: themed('icon');
		color: themed('Text_a');
	}
	text-align: center;
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 500;
	box-sizing: border-box;
	cursor: default;
}

.button:disabled:active {
	transform: scale(0.98);
}
</style>
