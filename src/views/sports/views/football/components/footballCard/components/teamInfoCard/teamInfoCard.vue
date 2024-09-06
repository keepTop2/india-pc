<!--
 * @Author: Relax
 * @Description: 体育-足球-队伍卡片
-->
<template>
	<div class="league-info">
		<!-- 队伍信息 -->
		<div class="league-team-info">
			<!-- 主队 -->
			<div class="team">
				<div class="team-icon"><img class="icon" :src="teamData.teamInfo?.homeIconUrl" /></div>
				<div class="team-name">{{ teamData.teamInfo.homeName }}</div>
				<!-- 红牌黄牌数量 -->
				<div class="foul-info" v-if="teamData.soccerInfo?.homeRedCard > 0 || teamData.soccerInfo?.homeYellowCard > 0">
					<span v-if="teamData.soccerInfo?.homeRedCard > 0" class="red">{{ teamData.soccerInfo?.homeRedCard }}</span>
					<span v-if="teamData.soccerInfo?.homeYellowCard > 0" class="yellow">{{ teamData.soccerInfo?.homeYellowCard }}</span>
				</div>
				<!-- 得分 -->
				<div class="score">{{ teamData.gameInfo?.liveHomeScore }}</div>
			</div>
			<!-- 客队 -->
			<div class="team">
				<div class="team-icon"><img class="icon" :src="teamData.teamInfo?.awayIconUrl" /></div>
				<div class="team-name">{{ teamData.teamInfo.awayName }}</div>
				<!-- 红牌黄牌数量 -->
				<div class="foul-info" v-if="teamData.soccerInfo?.awayRedCard > 0 || teamData.soccerInfo?.awayYellowCard > 0">
					<span v-if="teamData.soccerInfo?.awayRedCard > 0" class="red">{{ teamData.soccerInfo?.awayRedCard }}</span>
					<span v-if="teamData.soccerInfo?.awayYellowCard > 0" class="yellow">{{ teamData.soccerInfo?.awayYellowCard }}</span>
				</div>
				<!-- 得分 -->
				<div class="score">{{ teamData.gameInfo?.liveAwayScore }}</div>
			</div>
		</div>
		<div class="other-info">
			<div class="date">
				<span>{{ livePeriod }}</span>
				<span v-if="(teamData.gameInfo.livePeriod == 2 || teamData.gameInfo.livePeriod == 1) && !teamData.gameInfo.delayLive && !teamData.gameInfo.isHt">{{
					formattedGameTime
				}}</span>
			</div>
			<div class="info-list">
				<svg-icon :name="!isAttention ? 'sports-collection' : 'sports-already_collected'" size="16px"></svg-icon>
				<div class="markets-stats">
					<span>+{{ teamData.marketCount }}</span>
					<svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { FootballCardApi } from "/@/api/sports/footballCard";
import { computed } from "vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import PubSub from "/@/pubSub/pubSub";
import { useLink } from "/@/views/sports/hooks/useLink";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import SportsCommonFn from "/@/views/sports/utils/common";
import { convertUtcToUtc5AndFormatMD } from "/@/webWorker/module/utils/formattingChildrenViewData";
const SportAttentionStore = useSportAttentionStore();
const SportHotStore = useSportHotStore();
const router = useRouter();
const route = useRoute();
const { gotoEventDetail } = useLink();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 当前路由名称 */
	IfOffTheBat: string;
	/** 队伍数据 */
	teamData: any;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 数据索引 */
	dataIndex: 0,
	/** 当前路由名称 */
	IfOffTheBat: "rollingBall",
	teamData: () => {
		return {};
	},
});

/**
 * @description 计算是上半场还是下半场 根据 livePeriod 判断当前是第几节
 */
const livePeriod = computed(() => {
	const gameInfo = SportsCommonFn.safeAccess(props.teamData, ["gameInfo"]);
	const { livePeriod, delayLive, isHt } = gameInfo;
	if (livePeriod == 0 && !delayLive && isHt) {
		return "中场休息";
	}
	if (livePeriod == 0 && delayLive && !isHt) {
		return "延迟开赛";
	}
	if (livePeriod == 1 && !delayLive && !isHt) {
		return "上半场";
	}
	if (livePeriod == 2 && !delayLive && !isHt) {
		return "下半场";
	}
	const globalShowTime = SportsCommonFn.safeAccess(props.teamData, ["globalShowTime"]);
	return convertUtcToUtc5AndFormatMD(globalShowTime);
});

// 定义计算属性 格式化比赛开始时间
const formattedGameTime = computed(() => {
	const minutes = Math.floor(props.teamData.gameInfo.seconds / 60);
	const seconds = props.teamData.gameInfo.seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

/**
 * @description: 跳转到比赛详细
 */
const linkDetail = () => {
	const params = {
		eventId: props?.teamData?.eventId,
		leagueId: props?.teamData?.leagueId,
		dataIndex: props?.dataIndex,
		marketCount: props?.teamData.marketCount,
	};

	SportHotStore.setCurrentEvent(props.teamData);
	gotoEventDetail(params, SportTypeEnum.FootBall);
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.teamData.eventId);
});

// 点击关注按钮
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await FootballCardApi.unFollow({
			thirdId: [props.teamData.eventId],
		});
	} else {
		await FootballCardApi.saveFollow({
			thirdId: props.teamData.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};
</script>

<style scoped lang="scss">
.league-info {
	flex: 1;
	padding: 8px 10px 8px 24px;
	.league-team-info {
		display: grid;
		row-gap: 4px;
		.team {
			display: flex;
			align-items: center;
			gap: 6px;
			.team-icon {
				width: 20px;
				height: 20px;
				.icon {
					width: 100%;
					height: 100%;
				}
			}
			.team-name {
				flex: 1;
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.foul-info {
				display: flex;
				gap: 10px;

				.red,
				.yellow {
					min-width: 14px;
					height: 18px;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 2px;
					border-radius: 2px;
					color: var(--Text_a, #fff);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					line-height: 14px;
				}
				.red {
					background: var(--Theme);
				}
				.yellow {
					background: var(--F1);
				}
			}
			.score {
				min-width: 32px;
				height: 34px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--Theme);
				font-family: "DIN Alternate";
				font-size: 16px;
				font-weight: 700;
			}
		}
	}
	.other-info {
		margin-top: 18px;
		padding-right: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.date {
			display: flex;
			gap: 6px;
			color: var(--Theme);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
		.info-list {
			display: flex;
			gap: 10px;
			align-items: center;

			.markets-stats {
				min-width: 50px;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 6px;
				color: var(--Text1, #98a7b5);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
		}
	}
}
</style>
