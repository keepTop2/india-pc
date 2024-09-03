<template>
	<div class="box_two" :class="[!props.displayContent ? 'hideToggle' : 'showToggle']">
		<div class="information_left">
			<!-- 左侧时间 -->
			<div class="session" :class="{ 'color_Theme-P': event.isLive, color_TB: !event.isLive }">
				<span>{{ livePeriod }}</span>
				<!-- <span class="mr_6">{{ SportsCommonFn.getEventsTitle(event) }}</span> -->
				<span v-if="[1, 2, 3, 4, 99].includes(event.gameInfo.livePeriod) && !event.gameInfo.delayLive && !event.gameInfo.isHt">{{ formattedGameTime }}</span>
			</div>
			<div class="information">
				<!-- 卡片数据 -->
				<div class="information_top">
					<!-- 左侧 队伍名称 比分 -->
					<TeamInfoCard :IfOffTheBat="IfOffTheBat" :dataIndex="dataIndex" :teamData="event"></TeamInfoCard>
					<div class="information_left">
						<!-- 全场卡片数据 -->
						<div class="game_stats">
							<div class="content">
								<!-- 全场独赢 -->
								<MarketColumn cardType="capot" :sportInfo="event" :betType="20" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
								<!-- 全场让球 -->
								<MarketColumn cardType="handicap" :sportInfo="event" :betType="1" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
								<!-- 全场大小 -->
								<MarketColumn cardType="magnitude" :sportInfo="event" :betType="3" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
							</div>
						</div>
					</div>
				</div>
				<!-- 收藏 -->
				<div class="number">
					<div class="number_left">
						<!-- 关注 -->
						<SvgIcon v-if="isAttention" class="sports_collection2" iconName="sports_collection_two" :size="16" @click="attentionEvent(true)" />
						<!-- 取消关注 -->
						<SvgIcon v-else class="sports_collection" iconName="sports_collection" :size="16" @click="attentionEvent(false)" />
						<div class="number_one" @click="linkDetail">
							<span>+</span><span>{{ event.marketCount }}</span>
							<SvgIcon class="icon" iconName="arrowRight" />
						</div>
					</div>

					<div class="number_right" v-if="event.gameSession">
						<!-- 节数比分 -->
						<span>{{ event.gameSession == 3 ? "3盘2胜" : "5盘3胜" }}</span>
						<!-- <span class="ml_4">总局数</span>
						<span class="ml_2 theme"
							>{{ event.tennisInfo.homeGameScore.flat().reduce((a, b) => a + b, 0) }}-{{ event.tennisInfo.awayGameScore.flat().reduce((a, b) => a + b, 0) }}</span
						>
						<span class="theme">({{ event.tennisInfo.homeGameScore.flat().reduce((a, b) => a + b, 0) + event.tennisInfo.awayGameScore.flat().reduce((a, b) => a + b, 0) }})</span> -->
						<!-- <div class="score-list" v-if="event.basketballInfo?.latestLivePeriod > 0">
							<div class="item" :class="{ theme: event.basketballInfo?.latestLivePeriod == item }" v-for="(item, index) in event.basketballInfo?.latestLivePeriod" :key="item">
								{{ event.basketballInfo.homeGameScore[index] }}-{{ event.basketballInfo.awayGameScore[index] }}
							</div>
						</div> -->
					</div>
				</div>
			</div>
			<!-- 右侧 比分板 视频源 动画直播  -->
			<div class="game_stats_three">
				<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool.action)">
					<SvgIcon :class="tool.className" :iconName="tool.iconName" :size="23" />
					<span class="tooltip-text">{{ tool.tooltipText }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import TeamInfoCard from "../teamInfoCard/teamInfoCard.vue";
import MarketColumn from "../marketColumn/marketColumn.vue";
import { marketsMatchData } from "/@/utils/sports/formattingViewData";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
const SportAttentionStore = useSportAttentionStore();
import { FootballCardApi } from "/@/api/menu/sports/footballCard";
import { useRouter, useRoute } from "vue-router";
import { convertUtcToUtc5AndFormatMD } from "/@/webWorker/module/utils/formattingChildrenViewData";
import SportsCommonFn from "/@/utils/sports/common";
import common from "/@/utils/common";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { useLink } from "/@/hooks/useLink";
import { SportTypeEnum } from "/@/enum/sportEnum/sportEnum";
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
	if (SportsCommonFn.isShowScore(globalShowTime)) {
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

	// 判断 是否在未开赛页面
	if (props.IfOffTheBat !== "todayContest") {
		baseTools.push({
			className: "close",
			iconName: "score",
			tooltipText: "比分板",
			action: openPage,
		});
	}

	// 判断是否有视频源
	if (props.event.streamingOption != 0 && props.event.channelCode) {
		baseTools.push({
			className: "close",
			iconName: "video",
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
	gotoEventDetail(params, SportTypeEnum.Billiards);
};
</script>

<style scoped lang="scss">
.box_two {
	display: flex;
	height: 184px;
	flex-shrink: 0;
	border-radius: 0px 0px 8px 8px;

	.information_left {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		height: 100%;

		.session {
			display: flex;
			width: 58px;
			// height: 214px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			flex-shrink: 0;
			// padding: 0 6px;

			background: var(--Bg3);

			span {
				margin-top: 10px;
				color: var(--Theme);

				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}

		.information {
			width: 100%;
			margin: 6px 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.information_top {
				display: flex;

				.information_left {
					.game_stats {
						// display: flex;
						// justify-content: center;
						// align-items: center;
					}

					.content {
						display: grid;
						grid-template-columns: repeat(3, 264px);
						gap: 4px;
					}
				}
			}
		}
		.number {
			margin-left: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 16px;

			.number_left {
				display: flex;
				align-items: center;
				.sports_collection {
					color: var(--icon);
				}

				.sports_collection2 {
					color: var(--Warn);
				}

				.number_one {
					margin-left: 20px;
					display: flex;
					align-items: center;
					cursor: pointer;
					color: var(--Text1);

					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
					.icon {
						margin-left: 6px;
						width: 12px;
						height: 12px;
						color: var(--icon);
					}
				}
			}
			.number_right {
				color: var(--Text1-1, #98a7b5);
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				// width: 806px;
				// display: flex;
				// justify-content: flex-start;
				// .score-list {
				// 	display: flex;
				// 	align-items: center;
				// 	justify-content: end;
				// 	gap: 20px;
				// 	@include themeify {
				// 		color: var(--Text1);
				// 	}
				// 	font-family: "PingFang SC";
				// 	font-size: 14px;
				// 	font-style: normal;
				// 	font-weight: 400;
				// 	line-height: normal;
				// }
			}
		}
		.game_stats_three {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 54px;
			margin: 8px 4px;
			border-radius: 8px;
			background: var(--Bg3);

			.close {
				color: var(--icon);
			}

			.close:hover {
				color: var(--Theme);
			}

			.tooltip-container {
				position: relative;
				display: inline-block;
				cursor: pointer;
			}

			.tooltip-text {
				visibility: hidden;
				text-align: center;
				position: absolute;
				z-index: 1;
				bottom: 110%;
				/* 调整这个值以适应您的图标大小 */
				left: 50%;
				transform: translateX(-50%);
				opacity: 0;
				transition: opacity 0.3s;
				white-space: nowrap;

				padding: 2px 4px;
				text-align: center;
				font-family: "PingFang SC";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				border-radius: 4px;

				color: var(--Text1);
				background: var(--Line);
			}

			.tooltip-container:hover .tooltip-text {
				visibility: visible;
				opacity: 1;
			}
		}
	}
}
.sticky {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 1;
}
.hideToggle {
	height: 0;
	overflow: hidden;
	transition: height 0.5s ease;
}
.showToggle {
	max-height: 214px;
	overflow: hidden;
	transition: height 0.5s ease;
	background: var(--Bg1);
	border-bottom: 1px solid var(--Line);
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.toggle {
	border-radius: 8px;
	transition: border-radius 0.8s ease;
}
</style>
