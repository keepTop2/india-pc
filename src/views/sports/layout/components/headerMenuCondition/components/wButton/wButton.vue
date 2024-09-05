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
	min-width: 80px;
	height: 30px;
	padding: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 4px;
	box-sizing: border-box;
	font-family: "PingFang SC";
	font-size: 14px;
	font-weight: 400;
	cursor: pointer;
	background-color: var(--butter);
	color: var(--Text1);

	&.active {
		background-color: var(--Theme);
		color: var(--Text_a);
	}
}
</style>
