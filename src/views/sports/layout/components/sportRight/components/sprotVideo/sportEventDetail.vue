<template>
	<div class="main" :class="size" v-if="computedHasSportInfo">
		<el-table :data="computedTableData" v-if="sportIsRunning">
			<el-table-column>
				<template #header>
					<div class="col1">
						<span v-for="item in computedSportShowTime" :key="item">{{ item }}</span>
					</div>
				</template>
				<template #default="{ row }">
					<div class="title">
						<img :src="row.icon" alt="" :style="{ width: '18px', height: 'auto' }" />
						{{ row.title }}
					</div>
				</template>
			</el-table-column>

			<el-table-column v-for="item in computedTableColumn" :key="item.dataIndex" :width="item.width" :prop="item.dataIndex">
				<template #header>
					<SvgIcon v-if="item.type === TitleTypeEnum.Svg" :iconName="item.iconName" :size="item.size" />
					<span v-if="item.type === TitleTypeEnum.Text" :size="item.size" :class="item.className ?? ''">{{ item.title }}</span>
				</template>
				<template #default="{ row }">
					<span class="col" :class="item.className ?? ''">{{ row[item.dataIndex] ?? "" }}</span>
				</template>
			</el-table-column>
		</el-table>
		<div v-else class="teams">
			<div class="team1">
				<span>{{ sportInfo?.teamInfo?.homeName }}</span>
				<img v-if="sportInfo?.teamInfo?.homeIconUrl" :src="sportInfo?.teamInfo?.homeIconUrl" alt="" />
			</div>
			<div class="time">
				<div v-if="sportInfo?.leagueName" class="leagueName">{{ sportInfo?.leagueName }}</div>
				<div v-for="item in computedSportShowTime" :key="item">{{ item }}</div>
			</div>
			<div class="team2">
				<img v-if="sportInfo?.teamInfo?.awayIconUrl" :src="sportInfo?.teamInfo?.awayIconUrl" alt="" />
				<span>{{ sportInfo?.teamInfo?.awayName }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import SportsCommonFn from "/@/views/sports/utils/common";
import { SportEventStatusEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { isEmpty } from "lodash-es";
import { useSportEventDetailTool, TitleTypeEnum, TableSizeType } from "./useSportEventDetailTool";

const { getSportTableData, getSportTableColumn } = useSportEventDetailTool();

// 定义props类型
interface Props {
	/** 体育信息 */
	sportInfo: any;
	size?: TableSizeType;
}

// // 定义props并设置默认值
const props = withDefaults(defineProps<Props>(), {
	sportInfo: () => {
		return {};
	},
	size: "small",
});

/**
 * 判断是否有赛事数据
 */
const computedHasSportInfo = computed(() => !isEmpty(props.sportInfo));

// 计算属性 判断是否为比赛中的赛事
const sportIsRunning = computed(() => {
	if (props.sportInfo.eventStatus === SportEventStatusEnum.Running) {
		// 已开赛
		return SportsCommonFn.isShowScore(props.sportInfo.globalShowTime);
	}
	return false;
});

/**
 * 获取对应球类的Table显示
 */
const computedTableColumn = computed(() => getSportTableColumn(props.sportInfo, props.size));

/**
 * 计算球队比分等数据
 */
const computedTableData = computed(() => getSportTableData(props.sportInfo));

/**
 * 计算比赛相关时间
 */
const computedSportShowTime = computed(() => (isEmpty(props.sportInfo) ? [] : SportsCommonFn.getEventsTitle(props.sportInfo, "MM月DD日 HH:mm")));
</script>

<style scoped lang="scss">
.main {
	width: calc(100% - 30px);
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;

	.el-table {
		width: 100%;
		--el-table-row-hover-bg-color: transparent;
		--el-table-bg-color: transparent;
		--el-table-border-color: transparent;

		.col1 {
			font-weight: 500;
			display: flex;
			align-items: center;
			gap: 4px;
			color: var(--Text1) !important;
		}

		:deep() {
			tr {
				background: rgba(0, 0, 0, 0.4);

				td {
					height: 65px;
				}
			}

			th .cell,
			td .cell {
				padding: 0;
				text-align: center;
			}

			th:first-child .cell,
			th:last-child .cell,
			td:first-child .cell,
			td:last-child .cell {
				padding: 0 8px;
			}

			th.el-table__cell {
				background: var(--Bg3);
			}
		}

		.col {
			color: var(--Text_s);
		}

		.title {
			display: flex;
			align-items: center;
			gap: 8px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	&.large .el-table {
		:deep() {
			th .cell,
			td .cell {
				padding: 0 12px;
				text-align: center;
			}

			th:first-child .cell,
			th:last-child .cell,
			td:first-child .cell,
			td:last-child .cell {
				padding: 0 12px;
			}
		}
	}

	.yellow {
		color: var(--F1);
	}

	.teams {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		gap: 6px;
		justify-content: space-between;

		color: var(--Text_s);

		.team1,
		.team2 {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			img {
				width: 32px;
				height: auto;
			}

			span {
				padding: 0 8px;
			}
		}

		.team2 {
			justify-content: flex-start;
		}

		.time {
			min-width: 80px;
			max-width: 150px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 12px;

			.leagueName {
				font-size: 14px;
				margin-bottom: 12px;
			}

			div:last-child {
				margin-top: 6px;
			}
		}
	}

	&.large .teams .time {
		min-width: 300px;
		max-width: 400px;
	}
}
</style>
