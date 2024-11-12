<template>
	<div class="card-status-container">
		<div class="status">
			<template v-if="betStatus == 0">
				<span class="icon"><svg-icon name="sports-success" size="22px"></svg-icon></span>
				<span class="success">投注成功</span>
			</template>
			<template v-else>
				<span class="icon"><svg-icon name="sports-error" size="22px"></svg-icon></span>
				<span class="fail">投注失败</span>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		/** 注单状态  0 ：下注成功 ；1 ：下注失败  */
		betStatus?: number;
	}>(),
	{
		betStatus: 0,
	}
);
</script>

<style scoped lang="scss">
.card-status-container {
	.status {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 12px;

		.icon {
			display: inline-block;
			width: 22px;
			height: 22px;
		}

		.success {
			color: var(--success);
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
			line-height: 22px;
		}

		.fail {
			color: var(--F-1);
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
			line-height: 22px;
		}
	}

	.single {
		flex-direction: column;
	}
}
</style>
