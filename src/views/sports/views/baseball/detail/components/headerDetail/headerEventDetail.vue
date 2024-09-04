<template>
	<div class="main">
		<el-table :data="computedTableData" v-if="sportIsRunning && false">
			<el-table-column>
				<template #header>
					<div class="col1">
						<span>{{ sportInfo && SportsCommonFn.getEventsTitle(sportInfo) }}</span>
						<span>{{ formattedGameTime }}</span>
					</div>
				</template>
				<template #default="{ row }">
					<div class="title">
						<img :src="row.icon" alt="" :style="{ width: '18px', height: 'auto' }" />
						{{ row.title }}
					</div>
				</template>
			</el-table-column>

			<el-table-column width="100" prop="field2">
				<template #header>
					<SvgIcon iconName="yellow" size="14" />
				</template>
				<template #default="{ row }"
					><span class="col">{{ row.field2 }}</span></template
				>
			</el-table-column>

			<el-table-column width="100" prop="field3">
				<template #header>
					<SvgIcon iconName="red" size="14" />
				</template>
				<template #default="{ row }"
					><span class="col">{{ row.field3 }}</span></template
				>
			</el-table-column>
		</el-table>
		<div v-else class="teams">
			<div class="team1">
				<span>{{ sportInfo?.teamInfo?.homeName }}</span>
				<img v-if="sportInfo?.teamInfo?.homeIconUrl" :src="sportInfo?.teamInfo?.homeIconUrl" alt="" />
			</div>
			<div class="time">
				<div>{{ timeFormate(sportInfo?.globalShowTime).date }}</div>
				<div>{{ timeFormate(sportInfo?.globalShowTime).time }}</div>
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
import { convertUtcToUtc5AndFormat } from "/@/webWorker/module/utils/formattingChildrenViewData";
import moment from "moment";
import { isEmpty } from "lodash-es";

// 定义props类型
interface CapotCardType {
	/** 体育信息 */
	sportInfo: any;
}

// // 定义props并设置默认值
const props = withDefaults(defineProps<CapotCardType>(), {
	sportInfo: () => {
		return {};
	},
});

// 计算属性 判断是否为比赛中的赛事
const sportIsRunning = computed(() => {
	if (props.sportInfo.eventStatus === SportEventStatusEnum.Running) {
		// 已开赛
		return SportsCommonFn.isShowScore(props.sportInfo.globalShowTime);
	}
	return false;
});

// 格式化赛事开始日期，适应设计图格式
const timeFormate = (globalShowTime: string) => {
	if (globalShowTime) {
		const date = moment(convertUtcToUtc5AndFormat(globalShowTime)).format("MM月DD日");
		const time = moment(convertUtcToUtc5AndFormat(globalShowTime)).format("HH:mm");
		return {
			date,
			time,
		};
	} else {
		return {
			date: "00-00",
			time: "00:00",
		};
	}
};

/**
 * 计算球队比分等数据
 */
const computedTableData = computed(() => {
	const { teamInfo, soccerInfo } = props.sportInfo ?? {};
	if (isEmpty(teamInfo)) {
		return [];
	}

	const homeTeam = {
		title: teamInfo.homeName,
		icon: teamInfo.homeIconUrl,
		field2: soccerInfo.homeYellowCard,
		field3: soccerInfo.homeRedCard,
	};
	const awayTeam = {
		title: teamInfo.awayName,
		icon: teamInfo.awayIconUrl,
		field2: soccerInfo.awayYellowCard,
		field3: soccerInfo.awayRedCard,
	};
	return [homeTeam, awayTeam];
});

// 定义计算属性 格式化比赛开始时间
const formattedGameTime = computed(() => {
	const { sportInfo } = props;
	if (sportInfo && sportInfo.gameInfo.seconds) {
		const minutes = Math.floor(sportInfo.gameInfo.seconds / 60);
		const seconds = sportInfo.gameInfo.seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	} else {
		return "";
	}
});
</script>

<style scoped lang="scss">
.main {
	// background-image: url(/@/assets/zh/default/competition/detailBg.png);;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 276px;
	display: flex;
	align-items: center;
	justify-content: center;

	.el-table {
		width: 892px;
		//height: 166px;
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
		}
	}

	.teams {
		width: 892px;
		min-height: 166px;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		gap: 10px;
		justify-content: space-between;
		color: var(--Text_s);

		.team1,
		.team2 {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			width: 240px;

			img {
				width: 32px;
				height: 32px;
			}

			span {
				padding: 0 8px;
			}
		}

		.team2 {
			justify-content: flex-start;
		}

		.time {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			div:last-child {
				margin-top: 6px;
			}
		}
	}
}
</style>
