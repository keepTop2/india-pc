<template>
	<div class="container">
		<el-table :data="props.data" border :row-class-name="'row-cell'" :header-cell-class-name="'table-header-cell'" max-height="950px" :highlight-current-row="false">
			<!-- 编号 使用索引 + 1 -->
			<el-table-column :label="$t(`sports.betRecord['编号']`)" width="55" align="center" :resizable="false">
				<template #default="{ row, column, $index }">
					<div class="serial-number">{{ $index + 1 }}</div>
				</template>
			</el-table-column>

			<!-- 投注详情 -->
			<el-table-column :label="$t(`sports.betRecord['投注详情']`)" width="195" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div class="bet-details">
						<div class="bet-date">{{ row.transTime }}</div>
						<div class="bet-order-ID">
							<span>{{ row.transId }}</span>
						</div>
					</div>
				</template>
			</el-table-column>

			<!-- 投注玩法 -->
			<el-table-column :label="$t(`sports.betRecord['投注玩法']`)" width="137" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div class="betting" v-if="!row.parlayInfo">{{ row.betTypeName }}</div>
					<div class="betting" v-else="!row.parlayInfo">{{ row.comboType }}</div>
				</template>
			</el-table-column>

			<!-- 选项 -->
			<el-table-column :label="$t(`sports.betRecord['选项']`)" align="left" :resizable="false">
				<template #default="{ row, column }">
					<div v-if="!row.parlayInfo" class="options">
						<div class="events-name">{{ row.leagueName }}</div>
						<div class="market-info">
							<span class="market-name">{{ row.keyName }}</span>
							<span class="market-point">@{{ row.point }}</span>
						</div>
						<div class="event-info">
							<span>{{ "滚球" }}</span>
							<span>{{ row.betTypeName }}</span>
							<span>[{{ row.oddsTypeName }}]</span>
						</div>
						<div class="team-info">
							<span>{{ row.homeTeamName }}</span>
							<span>VS</span>
							<span>{{ row.awayTeamName }}</span>
							<span>{{ row.globalShowTime }}</span>
						</div>
						<div class="homeScore-info">
							<span>全场比分</span>
							<span>{{ row.homeScore }}-{{ row.awayScore }}</span>
						</div>
					</div>
					<template v-else>
						<div class="options-list">
							<div v-for="item in row.parlayInfo" class="options">
								<div class="events-name">{{ item.leagueName }}</div>
								<div class="market-info">
									<span class="market-name">{{ item.keyName }}</span>
									<span class="market-point">@{{ item.point }}</span>
								</div>
								<div class="event-info">
									<span>{{ "滚球" }}</span>
									<span>{{ item.betTypeName }}</span>
									<span>{{ item.oddsTypeName }}</span>
								</div>
								<div class="team-info">
									<span>{{ item.homeTeamName }}</span>
									<span>VS</span>
									<span>{{ item.awayTeamName }}</span>
									<span>[{{ item.globalShowTime }}]</span>
								</div>
								<div class="homeScore-info">
									<span>全场比分</span>
									<span>{{ item.homeScore }}-{{ item.awayScore }}</span>
								</div>
							</div>
						</div>
					</template>
				</template>
			</el-table-column>

			<!-- 投注额 -->
			<el-table-column :label="$t(`sports.betRecord['投注额']`)" width="168" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div class="bet-amount">{{ Common.formatFloat(row.stake) }}</div>
				</template>
			</el-table-column>

			<!-- 最高可赢 -->
			<el-table-column :label="$t(`sports.betRecord['最高可赢']`)" width="168" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div class="maximum-win">{{ Common.formatFloat(row.cashoutPrice) }}</div>
				</template>
			</el-table-column>

			<!-- 状态 -->
			<el-table-column :label="$t(`sports.betRecord['状态']`)" width="139" align="center" :resizable="false">
				<template #default="{ row, column }">
					<div class="bet-status">{{ computedStatusLabel[row.status] }}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import Common from "/@/utils/common";
import { SportStatusEnum } from "/@/views/sports/enum/sportEnum/sportEnum";

const props = withDefaults(
	defineProps<{
		data: [];
	}>(),
	{}
);

const i18n = useI18n();

// 投注状态枚举字典
const computedStatusLabel = computed(() => {
	return {
		[SportStatusEnum.HalfWon]: "半赢",
		[SportStatusEnum.HalfLose]: "半输",
		[SportStatusEnum.Won]: "赢",
		[SportStatusEnum.Lose]: "输",
		[SportStatusEnum.Void]: "作废",
		[SportStatusEnum.Running]: "进行中",
		[SportStatusEnum.Draw]: "和局",
		[SportStatusEnum.Reject]: "已取消",
		[SportStatusEnum.Refund]: "已退款",
		[SportStatusEnum.Waiting]: "等待中",
	} as any;
});

/**
 * 判断是否显示退还本金
 */
const isReturnStake = (status: SportStatusEnum) => {
	const returnStakeList = [SportStatusEnum.Void, SportStatusEnum.Reject, SportStatusEnum.Refund];
	return returnStakeList.includes(status);
};

/**
 * @description 格式化日期时间
 * @param dateTimeStr 要格式化的日期字符串或日期对象
 */
function formatDateTime(dateTimeStr: Date | string): string {
	// 将传入的日期字符串转换为 Date 对象
	const date = new Date(dateTimeStr);
	// 获取年份、月份、日期、小时、分钟和秒数
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	// 构建目标格式的日期时间字符串
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped lang="scss">
.container {
	width: 1636px;

	// 头部字体样式调整
	:deep(.table-header-cell) {
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
	}

	.serial-number {
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
	}
	.bet-details {
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
	.betting {
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
	.options-list {
		display: grid;
		gap: 20px;
	}
	.options {
		.events-name {
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 500;
		}
		.market-info {
			display: flex;
			align-items: center;
			gap: 6px;
			.market-name {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 12px;
				font-weight: 400;
			}
			.market-point {
				color: var(--Theme);
				font-family: "PingFang SC";
				font-size: 12px;
				font-weight: 400;
			}
		}
		.event-info,
		.team-info,
		.homeScore-info {
			display: flex;
			align-items: center;
			gap: 4px;
			color: var(--Text_1);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;
		}
	}
	.bet-amount {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
	.maximum-win {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
	.bet-status {
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
}

// 框架表格样式修改 ⬇️
:deep(.el-table) {
	border-radius: 8px;
	border: 1px solid var(--Line_2);
	background-color: transparent;

	// 修改组件库线条配置
	--el-table-border-color: var(--Line_2);

	// 行内样式
	.row-cell,
	tr {
		background: var(--Bg1) !important;
		border-radius: 8px;
		overflow: hidden;
		background-color: transparent;
	}
}

// 去除左右边框
.el-table--border:before,
.el-table--border:after,
:deep(.el-table__border-left-patch) {
	width: 0px;
}

// 去除上下边框
:deep(.el-table__inner-wrapper:after),
:deep(.el-table__inner-wrapper:before) {
	height: 0px;
}

// 修改头部背景色
:deep(.table-header-cell) {
	height: 44px;
	background: var(--Bg3) !important;
}
// 修改鼠标移入表格行背景色
:deep(.el-table--enable-row-hover) {
	.el-table__body tr:hover > td.el-table__cell {
		background-color: var(--Bg1);
	}
}

// 最后一行边框移除
:deep(.el-table__cell:last-child) {
	border-right: 0px;
}

:deep(.row-cell:last-child) {
	.el-table__cell {
		border-bottom: 0px;
	}
}
//
</style>
