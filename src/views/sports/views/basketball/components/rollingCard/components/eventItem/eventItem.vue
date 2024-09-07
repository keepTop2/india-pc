<template>
	<div class="league-content">
		<div class="content">
			<div class="main">
				<!-- 队伍信息 -->
				<TeamInfoCard :IfOffTheBat="IfOffTheBat" :dataIndex="dataIndex" :teamData="event"></TeamInfoCard>
				<!-- 盘口信息 -->
				<div class="league-markets">
					<!-- 全场独赢 -->
					<MarketColumn cardType="capot" :sportInfo="event" :betType="20" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 让分 -->
					<MarketColumn cardType="handicap" :sportInfo="event" :betType="1" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 总分 -->
					<MarketColumn cardType="magnitude" :sportInfo="event" :betType="3" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 球队总分 -->
					<MarketColumn cardType="magnitude" :sportInfo="event" :betType="401" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 球队总分 -->
					<MarketColumn cardType="magnitude" :sportInfo="event" :betType="402" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
				</div>
			</div>
			<div class="league-footer">
				<div class="other-info">
					<div class="date">
						<span>{{ livePeriod }}</span>
						<span v-if="[1, 2, 3, 4, 99].includes(event.gameInfo.livePeriod) && !event.gameInfo.delayLive && !event.gameInfo.isHt">{{ formattedGameTime }}</span>
					</div>
					<div class="info-list">
					<svg-icon :name="!isAttention ? 'sports-collection' : 'sports-already_collected'" size="16px" @click="attentionEvent(!isAttention ? false : true)"></svg-icon>
						<div class="markets-stats">
							<span>+{{ event.marketCount }}</span>
							<span class="arrow-icon"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
						</div>
					</div>
				</div>
				<div class="score-list" v-if="event.basketballInfo?.latestLivePeriod > 0">
					<div class="item" :class="{ theme: event.basketballInfo?.latestLivePeriod == item }" v-for="(item, index) in event.basketballInfo?.latestLivePeriod" :key="item">
						{{ event.basketballInfo.homeGameScore[index] }}-{{ event.basketballInfo.awayGameScore[index] }}
					</div>
				</div>
			</div>
		</div>

		<!-- 其他信息 -->
		<div class="league-option">
			<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool.action)">
				<span class="icon"><svg-icon :name="tool.iconName" width="23px" height="16px"></svg-icon></span>
				<!-- <span class="tooltip-text">{{ tool.tooltipText }}</span> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TeamInfoCard from "../teamInfoCard/teamInfoCard.vue";
import MarketColumn from "../marketColumn/marketColumn.vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
const SportAttentionStore = useSportAttentionStore();
import { FootballCardApi } from "/@/api/sports/footballCard";
import { useRouter, useRoute } from "vue-router";
import { convertUtcToUtc5AndFormatMD } from "/@/webWorker/module/utils/formattingChildrenViewData";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { useLink } from "/@/views/sports/hooks/useLink";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
const router = useRouter();
const route = useRoute();
const SportHotStore = useSportHotStore();
const { gotoEventDetail } = useLink();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	event: any;
	/** 当前路由名称 */
	IfOffTheBat: string;
	displayContent: boolean;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 数据索引 */
	dataIndex: 0,
	/** 当前路由名称 */
	IfOffTheBat: "rollingBall",
	displayContent: true,
	/** 队伍数据 */
	event: () => {
		return {};
	},
});

const emit = defineEmits(["oddsChange"]);
/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

/**
 * @description 计算是上半场还是下半场 根据 livePeriod 判断当前是第几节
 */
const livePeriod = computed(() => {
	const gameInfo = SportsCommonFn.safeAccess(props.event, ["gameInfo"]);
	const { livePeriod, delayLive, isHt } = gameInfo;
	if (livePeriod == 0 && !delayLive && isHt) {
		return "中场休息";
	}
	if (livePeriod == 0 && delayLive && !isHt) {
		return "延迟开赛";
	}
	if (livePeriod == 1 && !delayLive && !isHt) {
		return "第一节";
	}
	if (livePeriod == 2 && !delayLive && !isHt) {
		return "第二节";
	}
	if (livePeriod == 3 && !delayLive && !isHt) {
		return "第三节";
	}
	if (livePeriod == 4 && !delayLive && !isHt) {
		return "第四节";
	}
	if (livePeriod == 99 && !delayLive && !isHt) {
		return "加时赛";
	}
	const globalShowTime = SportsCommonFn.safeAccess(props.event, ["globalShowTime"]);
	return convertUtcToUtc5AndFormatMD(globalShowTime);
});

// 定义计算属性 格式化比赛开始时间
const formattedGameTime = computed(() => {
	const minutes = Math.floor(props.event.gameInfo.seconds / 60);
	const seconds = props.event.gameInfo.seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const openPage = () => {
	SportHotStore.setCurrentEvent(props.event);
};
const toggleFullScreen = () => {
	SportHotStore.setCurrentEvent(props.event);
};
const refreshPage = () => {
	console.log("动画直播");
};

/**
 * @description  计算工具图标的显示状态
 */
const tools = computed(() => {
	const baseTools = [];

	// 判断 是否在未开赛页面
	if (props.IfOffTheBat !== "todayContest") {
		baseTools.push({
			iconName: "sports-score_icon",
			tooltipText: "比分板",
			action: openPage,
		});
	}

	// 判断是否有视频源
	if (props.event.streamingOption != 0 && props.event.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			tooltipText: "视频源",
			action: toggleFullScreen,
		});
	}
	return baseTools;
});

/**
 * @description  点击对应icon方法
 */
const handleClick = (action: () => void) => {
	if (typeof action === "function") {
		action();
	}
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.event.eventId);
});

// 点击关注按钮
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await FootballCardApi.unFollow({
			thirdId: [props.event.eventId],
		});
	} else {
		await FootballCardApi.saveFollow({
			thirdId: props.event.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

/**
 * @description: 跳转到比赛详细
 */
const linkDetail = () => {
	const params = {
		eventId: props?.event?.eventId,
		dataIndex: props?.dataIndex,
	};
	SportHotStore.setCurrentEvent(props.event);
	gotoEventDetail(params, SportTypeEnum.Basketball);
};
</script>

<style scoped lang="scss">
.league-content {
	display: flex;
	background-color: var(--Bg1);
	&:last-child {
		border-bottom: 0px;
	}

	.content {
		flex: 1;

		.main {
			display: flex;
			.league-markets {
				width: 804px;
				display: flex;
				gap: 4px;
				padding: 8px 4px 8px 0px;
			}
		}
		.league-footer {
			width: 100%;
			height: 30px;
			display: flex;
			background: var(--Bg3);

			.other-info {
				// flex: 1;
				width: calc(100% - 804px);
				padding: 0px 14px 0px 24px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.date {
					height: 100%;
					display: flex;
					align-items: center;
					gap: 6px;
					color: var(--Theme);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
				.info-list {
					height: 100%;
					display: flex;
					gap: 10px;
					align-items: center;

					.collection {
						width: 20px;
						height: 20px;
						// display: flex;
						// align-items: center;
						// justify-content: center;
						cursor: pointer;
					}

					.markets-stats {
						min-width: 50px;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						color: var(--Text1, #98a7b5);
						font-family: "PingFang SC";
						font-size: 14px;
						line-height: 20px;
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
			.score-list {
				width: 804px;
				display: flex;
				align-items: center;
				gap: 20px;
				.item {
					color: var(--Text1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
				.theme {
					color: var(--Theme);
				}
			}
		}
	}

	.league-option {
		width: 58px;
		display: flex;
		gap: 16px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-left: 1px solid var(--Line_2);
		border-bottom: 1px solid var(--Line_2);
		overflow: hidden;
		.tooltip-container {
			.icon {
				width: 23px;
				height: 16px;
				display: flex;
				align-items: center;
			}
		}
	}
}
</style>
