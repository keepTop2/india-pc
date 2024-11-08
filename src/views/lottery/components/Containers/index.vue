<template>
	<div class="lottery-type-containers" :class="class">
		<!-- 头部组件 -->
		<LotteryHeader />

		<!-- 分割线 -->
		<div class="line" />

		<!-- 主体部分 -->
		<div class="containers">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import useLotteryHeader from "/@/views/lottery/components/LotteryHeader/Index";

const props = defineProps({
	class: { type: String, default: "" },
	data: { type: Object },
});

const { LotteryHeader } = useLotteryHeader({ data: props.data });
</script>

<style scoped lang="scss">
.lottery-type-containers {
	width: 1308px;
	margin: 0 auto;
	margin-top: 24px;
	background-color: var(--Bg1);
	border-radius: 12px;
	padding: 20px;

	.line {
		border: 1px solid var(--lineBg);
		margin: 16px 0;
	}
	.containers {
		:deep(.tabs) {
			display: flex;
			align-items: center;
			column-gap: 4px;
			margin-bottom: 16px;

			.tabs-item {
				width: 96px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				color: var(--Text1);
				font-size: 14px;
				background-color: var(--button);
				border-radius: 4px;
				cursor: pointer;

				&.actived {
					background-color: var(--Bg5);
					color: var(--Text_a);
				}
			}
		}
		:deep(.content) {
			.accordion-content-item-balls {
				padding: 12px;
				background-color: var(--Bg1);
				border: 1px solid var(--Line_2);
				border-radius: 8px;
				margin-top: 4px;
			}

			.bet-form-slot-header {
				> div:nth-child(2) {
					font-size: 12px;
					margin-top: 8px;
				}
			}

			.gameplay-container {
				display: flex;
				justify-content: space-between;
				align-items: start;
				gap: 8px;
			}
		}
	}
}
</style>
