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

const emits = defineEmits(["changeOrderStatus"]);
</script>

<style scoped lang="scss">
.card-status-container {
	position: relative;

	.header-single {
		width: 100%;
		height: 40px;
		border-bottom: 1px solid #373a40;
		text-align: right;
		margin-bottom: 20px;
	}

	.close-bunch {
		position: absolute;
		right: 0;
		top: 15px;
		cursor: pointer;
		z-index: 999;
	}

	.status {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 10px;
		position: relative;

		.success {
			color: var(--Theme);
		}

		.fail {
			color: var(--Warn);
		}
	}

	.single {
		flex-direction: column;
	}
}
</style>
