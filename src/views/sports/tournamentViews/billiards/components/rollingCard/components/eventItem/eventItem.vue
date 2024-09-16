<template>
	<div class="league-content">
		<div class="content">
			<div class="main">
				<!-- 队伍信息 -->
				<TeamInfoCard :dataIndex="dataIndex" :teamData="event"></TeamInfoCard>
				<!-- 盘口信息 -->
				<div class="league-markets">
					<!-- 全场独赢 -->
					<MarketColumn cardType="capot" :sportInfo="event" :betType="20" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 全场让球 -->
					<MarketColumn cardType="handicap" :sportInfo="event" :betType="1" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
					<!-- 全场大小 -->
					<MarketColumn cardType="magnitude" :sportInfo="event" :betType="3" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
				</div>
			</div>
			<div class="league-footer">
				<div class="other-info">
					<!-- 塞节时间 -->
					<div class="date">
						<span>{{ livePeriod }}</span>
						<span v-if="[1, 2, 3, 4, 99].includes(event.gameInfo.livePeriod) && !event.gameInfo.delayLive && !event.gameInfo.isHt">{{ formattedGameTime }}</span>
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
				<div class="score-info"></div>
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
import common from "/@/utils/common";
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
	displayContent: boolean;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 数据索引 */
	dataIndex: 0,
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
	const globalShowTime = SportsCommonFn.safeAccess(props.event, ["globalShowTime"]);
	const eventStatus = SportsCommonFn.safeAccess(props.event, ["eventStatus"]);
	const parentId = SportsCommonFn.safeAccess(props.event, ["parentId"]);
	const gameInfo = SportsCommonFn.safeAccess(props.event, ["gameInfo"]);
	if (eventStatus == "closed") {
		return "比赛关闭";
	}
	if (eventStatus == "postponed") {
		return "比赛推迟";
	}
	if (SportsCommonFn.isStartMatch(globalShowTime)) {
		if (parentId > 0) {
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else {
			return `第${common.add(gameInfo.liveHomeScore, gameInfo.liveAwayScore) + 1}局`;
		}
	}
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
	baseTools.push({
		iconName: "sports-score_icon",
		tooltipText: "比分板",
		action: openPage,
	});
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
		leagueId: props?.event?.leagueId,

		eventId: props?.event?.eventId,
		dataIndex: props?.dataIndex,
	};
	gotoEventDetail(params, SportTypeEnum.Billiards);
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
