<template>
	<div class="main" :class="size" v-if="computedHasSportInfo">
		<div class="col1 fs_14" v-if="size == 'small'">
			<span class="svg_icon"><svg-icon name="sports-football_icon" size="14px"></svg-icon></span>
			<span>{{ sportInfo?.teamInfo?.homeName }}</span>
			<span class="mr_8 ml_8"> VS </span>
			<span>{{ sportInfo?.teamInfo?.awayName }}</span>
		</div>
		<div
			v-if="sportIsRunning"
			class="scoreboard"
			:style="{
				backgroundImage: size == 'small' ? `url(${Common.getCommonImgPath('scoreboard_bg.png')})` : `url(${Common.getCommonImgPath('scoreboard_bg_2.png')})`,
			}"
		>
			<div class="scoreboard_content fs_14">
				<div class="scoreboard_header">
					<span>
						<span class="fs_12 mr_15">上半场</span>
						<span class="fs_12">88:23</span>
					</span>
					<span>
						<svg-icon name="sports-jiaoqiu" size="20px"></svg-icon>
					</span>
					<span><svg-icon name="sports-hongpai" size="20px"></svg-icon></span>
					<span><svg-icon name="sports-huangpai" size="20px"></svg-icon></span>
					<span><svg-icon name="sports-dianqiu" size="20px"></svg-icon></span>
					<span><svg-icon name="sports-banchangjinqiu" size="20px"></svg-icon></span>
					<span><svg-icon name="sports-quanchangjinqiu" size="20px"></svg-icon></span>
				</div>
				<div class="scoreboard_info">
					<span class="teamName">
						<img v-if="sportInfo?.teamInfo?.homeIconUrl" :src="sportInfo?.teamInfo?.homeIconUrl" alt="" />
						<span class="ellipsis">{{ sportInfo?.teamInfo?.homeName }}</span>
					</span>
					<span>1</span>
					<span>2</span>
					<span>3</span>
					<span>3</span>
					<span>3</span>
					<span>3</span>
				</div>
				<div class="line"></div>
				<div class="scoreboard_info">
					<span class="teamName">
						<img v-if="sportInfo?.teamInfo?.homeIconUrl" :src="sportInfo?.teamInfo?.homeIconUrl" alt="" />
						<span class="ellipsis"> {{ sportInfo?.teamInfo?.awayName }} </span>
					</span>
					<span>1</span>
					<span>2</span>
					<span>3</span>
					<span>3</span>
					<span>3</span>
					<span>3</span>
				</div>
			</div>
		</div>
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
import Common from "/@/utils/common";
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
	min-width: 390px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	background: var(--Bg1);
	.col1 {
		font-weight: 500;
		width: 100%;
		text-align: left;
		padding: 0 12px;
		height: 26px;
		line-height: 26px;
		display: flex;
		align-items: center;
		color: var(--Text1) !important;
		.svg_icon {
			margin: 4px 5px;
			display: flex;
			align-items: center;
		}
	}
	.scoreboard {
		height: 208px;
		width: 100%;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--Text_s);
		.scoreboard_content {
			width: 100%;
			padding: 12px;
			display: flex;
			flex-wrap: wrap;
			border-radius: 8px;
			overflow: hidden;
			> div {
				display: flex;
				width: 100%;
				justify-content: space-between;
				align-items: center;
				span {
					text-align: center;
				}
				.teamName {
					display: flex;
					padding: 0 10px;
					width: 100%;

					img {
						height: 20px;
						margin-right: 5px;
					}
				}
			}
			.scoreboard_header {
				background: var(--Bg2);
				padding: 9px 0;
				border-radius: 8px 8px 0px 0px;
				align-items: center;
				> span {
					flex: 1;
				}
				> span:first-child {
					flex: 3;
				}
			}
			.scoreboard_info {
				height: 51px;
				background: rgba(26, 28, 32, 0.7);
				> span {
					flex: 1;
				}
				> span:first-child {
					max-width: 120px;
					text-align: left;
					flex: 3;
				}
			}
			.scoreboard_info:nth-child(2) {
				border-radius: 0px 0px 8px 8px;
			}
			.line {
				height: 1px;
				flex-shrink: 0;
				opacity: 0.5;
				padding: 0 12px;
				background: var(--Line_2);
			}
		}
		table {
			width: 100%;
			border: none;
			text-align: center;
			border-radius: 8px;

			thead {
				height: 36px;
				background: var(--Bg2);
				padding: 9px 12px;
				border-radius: 8px 8px 0px 0px;
			}
			tbody {
				height: 102px;
				background: rgba(26, 28, 32, 0.7);
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
	&.large {
		width: 100%;
		flex: 1;
		.scoreboard {
			height: 276px;
			.scoreboard_content {
				width: 892px;
				.scoreboard_header {
					> span:first-child {
						flex: 3;
						text-align: left;
						max-width: 300px;
						padding: 0 10px;
					}
				}
				.scoreboard_info {
					height: 65px;
					> span:first-child {
						max-width: 300px;
						flex: 3;
					}
				}
			}
		}
	}
	&.large .teams .time {
		min-width: 300px;
		max-width: 400px;
	}
}
</style>
