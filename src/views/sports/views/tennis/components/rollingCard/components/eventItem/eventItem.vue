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
					<!-- 让盘 -->
					<MarketColumn cardType="handicap" :sportInfo="event" :betType="1303" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 让局 -->
					<MarketColumn cardType="handicap" :sportInfo="event" :betType="153" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 总局数 -->
					<MarketColumn cardType="magnitude" :sportInfo="event" :betType="1306" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
				</div>
			</div>
			<div class="league-footer">
				<div class="other-info">
					<!-- 塞节时间 -->
					<div class="date">
						<span>{{ livePeriod }}</span>
					</div>
					<div class="info-list">
						<!-- 收藏 -->
						<span class="collection">
							<svg-icon :name="!isAttention ? 'sports-collection' : 'sports-already_collected'" size="16px" @click="attentionEvent(!isAttention ? false : true)"></svg-icon>
						</span>
						<!-- 盘口数量 -->
						<div class="markets-qty" @click="linkDetail">
							<span>+{{ event.marketCount }}</span>
							<span class="arrow-icon"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
						</div>
					</div>
				</div>
				<div class="score-info">
					<!-- 节数比分 -->
					<div class="score-list" v-if="event.tennisInfo">
						<div class="item" :class="{ theme: event.tennisInfo.currentSet == item }" v-for="(item, index) in event.tennisInfo.currentSet" :key="item">
							{{ event.tennisInfo.homeGameScore[index] }}-{{ event.tennisInfo.awayGameScore[index] }}
						</div>
					</div>
					<!-- 总分 -->
					<div class="total-score">
						<span>{{ event.gameSession == 3 ? "3盘2胜" : "5盘3胜" }}</span>
						<template v-if="IfOffTheBat == 'rollingBall'">
							<span>|</span>
							<span class="theme"
								>总分{{ event?.tennisInfo?.homeGameScore.flat().reduce((a, b) => a + b, 0) }}-{{ event?.tennisInfo?.awayGameScore.flat().reduce((a, b) => a + b, 0) }}</span
							>
							<span class="theme"
								>({{ event?.tennisInfo?.homeGameScore.flat().reduce((a, b) => a + b, 0) + event?.tennisInfo?.awayGameScore.flat().reduce((a, b) => a + b, 0) }})</span
							>
						</template>
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import TeamInfoCard from "../teamInfoCard/teamInfoCard.vue";
import MarketColumn from "../marketColumn/marketColumn.vue";
import { marketsMatchData } from "/@/views/sports/utils/formattingViewData";
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
const SportHotStore = useSportHotStore();
const router = useRouter();
const route = useRoute();
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
	const tennisInfo = SportsCommonFn.safeAccess(props.event, ["tennisInfo"]);
	const { currentSet } = tennisInfo;
	if (currentSet == 1) {
		return "第1盘";
	}
	if (currentSet == 2) {
		return "第2盘";
	}
	if (currentSet == 3) {
		return "第3盘";
	}
	if (currentSet == 4) {
		return "第4盘";
	}
	if (currentSet == 5) {
		return "第5盘";
	}
	const globalShowTime = SportsCommonFn.safeAccess(props.event, ["globalShowTime"]);
	return convertUtcToUtc5AndFormatMD(globalShowTime);
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
	gotoEventDetail(params, SportTypeEnum.Tennis);
};
</script>

<style scoped lang="scss">
.league-content {
	display: flex;
	background-color: var(--Bg1);
	&:last-child {
		border-bottom: 0px;
		.league-option {
			border-bottom: 0px;
		}
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
						cursor: pointer;
					}

					.markets-qty {
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

			.score-info {
				width: 804px;
				display: flex;
				justify-content: space-between;
				.score-list {
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
				.total-score {
					display: flex;
					align-items: center;
					gap: 6px;
					padding-right: 22px;
					span {
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
			cursor: pointer;
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
