<!--
 * @Author: WangMingxin
 * @Description: 自定义体育-按钮组件
-->
<template>
	<div class="wbutton" :class="active ? 'active' : ''">
		<slot>按钮</slot>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		/**
		 * @description: 选中状态
		 * @return {*}
		 */
		active?: boolean;
	}>(),
	{
		active: false,
	}
);

// @click="onClick"
// const emit = defineEmits(['click']);
// const onClick = () => {
//   emit('click');
// }
</script>

<style scoped lang="scss">
.wbutton {
	display: flex;
	width: 100px;
	height: 40px;
	padding: 10px;
	justify-content: center;
	align-items: center;
	gap: 10px;
	border-radius: 4px;
	box-sizing: border-box;
	font-family: "PingFang SC";
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	text-transform: lowercase;
	cursor: pointer;
	/* 禁止用户选择文本 */
	user-select: none;
	-webkit-user-drag: none;
	background-color: var(--Bg3);
	color: var(--Text1);

	&.active {
		background-color: var(--Theme);
		color: var(--Text_a);
	}
}
</style>
