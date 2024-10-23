<template>
	<div class="league-info">
		<!-- 队伍信息 -->
		<div class="league-team-info">
			<!-- 主队 -->
			<div class="team">
				<div class="team-icon"><img class="icon" :src="teamData.teamInfo?.homeIconUrl" /></div>
				<div class="team-name">
					<div class="name">{{ teamData.teamInfo.homeName }}</div>
				</div>
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
				<div class="team-name">
					<div class="name">{{ teamData.teamInfo.awayName }}</div>
				</div>
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
			<!-- 塞节时间 -->
			<div class="date">
				<span>{{ SportsCommonFn.getEventsTitle(teamData) }}</span>
				<!-- <span v-if="(teamData.gameInfo.livePeriod == 2 || teamData.gameInfo.livePeriod == 1) && !teamData.gameInfo.delayLive && !teamData.gameInfo.isHt">{{
					formattedGameTime
				}}</span> -->
			</div>
			<!-- 其他信息 -->
			<div class="info-list">
				<span class="collection">
					<svg-icon :name="!isAttention ? 'sports-collection' : 'sports-already_collected'" size="14px" @click="attentionEvent(!isAttention ? false : true)"></svg-icon>
				</span>
				<div class="markets-qty" @click="linkDetail">
					<span>+{{ teamData.marketCount }}</span>
					<span class="arrow-icon"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import SportsApi from "/@/api/sports/sports";
import { computed } from "vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import PubSub from "/@/pubSub/pubSub";
import { useLink } from "/@/views/sports/hooks/useLink";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import SportsCommonFn from "/@/views/sports/utils/common";
import { convertUtcToUtc5AndFormatMD } from "/@/webWorker/module/utils/formattingChildrenViewData";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
const { toggleEventScoreboard, switchEventVideoSource } = useToolsHooks();

const SportAttentionStore = useSportAttentionStore();
const SportHotStore = useSportHotStore();
const router = useRouter();
const route = useRoute();
const { gotoEventDetail } = useLink();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 当前路由名称 */
	IfOffTheBat?: string;
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
	toggleEventScoreboard(props.teamData);
	gotoEventDetail(params, SportTypeEnum.FootBall);
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.teamData.eventId);
});

// 点击关注按钮
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await SportsApi.unFollow({
			thirdId: [props.teamData.eventId],
		});
	} else {
		await SportsApi.saveFollow({
			thirdId: props.teamData.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};
</script>

<style scoped lang="scss">
.league-info {
	width: 284px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 8px;
	.league-team-info {
		display: grid;
		row-gap: 6px;
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

				.name {
					max-width: 204px;
					white-space: nowrap; /* 防止文本换行 */
					overflow: hidden; /* 超出部分隐藏 */
					text-overflow: ellipsis; /* 超出部分显示省略号 */
				}
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
				height: 32px;
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
		padding-right: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.date {
			display: flex;
			gap: 6px;
			color: var(--Theme);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;
		}
		.info-list {
			display: flex;
			gap: 10px;
			align-items: center;

			.collection {
				width: 14px;
				height: 14px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}

			.markets-qty {
				min-width: 50px;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				color: var(--Text1, #98a7b5);
				font-family: "PingFang SC";
				font-size: 12px;
				font-weight: 400;
				cursor: pointer;
				.arrow-icon {
					width: 20px;
					height: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
}
</style>
