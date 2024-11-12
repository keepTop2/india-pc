<template>
	<div class="wbutton" :class="active ? 'active' : ''">
		<slot></slot>
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
	background-color: var(--Butter);
	color: var(--Text-1);

	&.active {
		background-color: var(--Theme);
		color: var(--Text-a);
	}
}
</style>
