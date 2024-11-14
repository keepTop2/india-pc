<template>
	<div class="lottery-type-containers" :class="class">
		<!-- 头部组件 -->
		<LotteryHeader :data="props.data" :class="props.class" :timer-end-callback="timerEndCallback" />

		<!-- 分割线 -->
		<div class="line" />

		<!-- 主体部分 -->
		<div class="containers">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import useLotteryHeader from "/@/views/lottery/components/LotteryHeader/Index";
const props = defineProps({
	class: { type: String, default: "" },
	data: { type: Object as PropType<LotteryInfo> },
	timerEndCallback: { type: Function, default: Function.prototype },
});
const { LotteryHeader } = useLotteryHeader();
</script>

<style scoped lang="scss">
.lottery-type-containers {
	width: 1308px;
	margin: 0 auto;
	margin-top: 24px;
	background-color: var(--Bg-1);
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
				color: var(--Text-1);
				font-size: 14px;
				background-color: var(--Button);
				border-radius: 4px;
				cursor: pointer;

				&.actived {
					background-color: var(--Bg-5);
					color: var(--Text-a);
				}
			}
		}
		:deep(.content) {
			.accordion-content-item-balls {
				padding: 12px;
				background-color: var(--Bg-1);
				border: 1px solid var(--Line-2);
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

		:deep(.lottery-result) {
			.search {
				.el-select__wrapper {
					height: 40px;
					background-color: var(--Bg-2);
					border-color: var(--Line-2);
					box-shadow: 0 0 0 1px var(--Line-2);
					&.is-focused {
						border-color: var(--Line-2);
						box-shadow: 0 0 0 1px var(--Line-2);
					}
				}
				.el-popper.is-light {
					background-color: var(--Bg-1);
					border-color: var(--Line-2);
					padding: 0;
					&:has(.is-selected) {
						background-color: var(--Bg-2);
					}
					.el-scrollbar__view {
						padding: 0;
					}
					.el-select-dropdown__item {
						background-color: var(--Bg-1);
						padding: 0;
						height: 40px;
						line-height: 40px;
						padding: 0 12px;
						&.is-selected {
							color: var(--Text-a);
							background-color: var(--Bg-2);
						}
					}
					.el-popper__arrow {
						display: none;
					}
				}
			}
			.table {
				margin: 12px 0;

				.balls {
					display: flex;
					justify-content: end;
					column-gap: 8px;
					align-items: center;
				}
				.table-header-cell .el-table__body {
					.el-table__cell {
						padding: 0px;
						.cell {
							width: 100%;
							height: 100%;
							padding: 15px;
						}
					}
				}

				// 修改头部背景色
				.table-header-cell {
					height: 44px;
					background: var(--Bg-3) !important;
				}
				// 修改鼠标移入表格行背景色
				.el-table--enable-row-hover {
					.el-table__body tr:hover > td.el-table__cell {
						background-color: var(--Bg-1);
					}
				}

				.el-table {
					height: 100%;
					max-height: inherit;
					background-color: transparent;
					--el-table-row-hover-bg-color: var(--Line-2);
					border-radius: 8px;
					border: 1px solid var(--Line-2);

					.el-table__inner-wrapper {
						max-height: inherit;
					}

					th.is-leaf {
						border-bottom: 1px solid var(--Line-2) !important;
					}

					.el-table__body-wrapper {
						overflow: auto;
						border-right: 0;
						border-bottom: 0;
					}

					td,
					th.is-leaf,
					.el-table--border,
					.el-table--group {
						border-color: var(--Line-2);
					}

					.el-table__cell:last-child {
						border-right: 0px !important;
					}

					// 行内样式
					.row-cell,
					tr {
						background: var(--Bg-1) !important;
						background-color: transparent;
					}

					tr td:nth-child(1),
					tr th:nth-child(1) {
						border-left: 0px !important;
					}

					.el-table__inner-wrapper::after {
						display: none;
					}
				}
				.el-table__border-left-patch,
				.el-table--border:before,
				.el-table--border:after,
				.el-table__inner-wrapper:before {
					width: 0px;
					height: 0px;
				}
			}
		}
	}
}
</style>
