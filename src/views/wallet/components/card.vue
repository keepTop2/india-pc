<template>
	<div class="card">
		<div v-if="header" class="header">
			<i v-if="showIcon"></i>
			<slot name="header"></slot>
		</div>
		<div class="main">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	header: {
		type: Boolean,
		default: false, // 默认显示状态
	},
	showIcon: {
		type: Boolean,
		default: true, // 默认显示状态
	},
});
</script>

<style scoped lang="scss">
.card {
	border-radius: 12px;
	background: var(--Bg-1);
	// overflow: hidden;
	.header {
		position: relative;
		padding: 20px 20px 0px;

		i {
			position: absolute;
			top: 24px;
			left: 0px;
			width: 4px;
			height: 26px;
			background: var(--Theme);
			border-top-right-radius: 6px;
			border-bottom-right-radius: 6px;
		}
	}
}
</style>
