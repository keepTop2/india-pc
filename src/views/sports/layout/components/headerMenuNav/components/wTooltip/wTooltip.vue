<template>
	<el-tooltip placement="top" popper-class="wTooltip" :content="content" :offset="6">
		<slot></slot>
	</el-tooltip>
</template>

<script setup lang="ts" name="wTooltip">
const props = withDefaults(
	defineProps<{
		/**
		 * @description: 文本内容
		 */
		content?: string;
	}>(),
	{
		content: "",
	}
);
</script>

<style lang="scss">
.wTooltip {
	&.el-popper {
		display: inline-flex;
		padding: 2px 8px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		border-radius: 4px;
		border: none;

		background: var(--Bg-2); // var(--Bg-2-2, #1A1C20);
		color: var(--Text-s);

		.el-popper__arrow {
			display: none !important;

			::before {
				content: none;
				display: none !important;
			}
		}
	}
}
</style>
