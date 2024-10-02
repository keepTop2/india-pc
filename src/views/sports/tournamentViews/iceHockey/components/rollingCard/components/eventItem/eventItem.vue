<template>
	<div class="league-content">
		<div class="content">
			<div class="main">
				<div class="league">
					<!-- 队伍信息 -->
					<TeamInfoCard :dataIndex="dataIndex" :teamData="event" />
				</div>
				<!-- 盘口信息 -->
				<div class="league-markets">
					<MarketColumn
						v-for="(market, index) in markets"
						:key="index"
						:cardType="market.cardType"
						:sportInfo="event"
						:betType="market.betType"
						:selectionsLength="market.selectionsLength"
						@oddsChange="oddsChange"
					/>
				</div>
			</div>
			<div class="league-footer">
				<div class="other-info">
					<!-- 塞节时间 -->
					<div class="date">
						<span>{{ SportsCommonFn.getEventsTitle(event) }}</span>
						<span v-if="isLive">{{ formattedGameTime }}</span>
					</div>
					<div class="info-list">
						<!-- 收藏 -->
						<span class="collection" @click="toggleAttention">
							<svg-icon :name="!isAttention ? 'sports-collection' : 'sports-already_collected'" size="16px"></svg-icon>
						</span>
						<!-- 盘口数量 -->
						<div class="markets-qty" @click="linkDetail">
							<span>+{{ event.marketCount }}</span>
							<span class="arrow-icon"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 其他信息 -->
		<div class="league-option">
			<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool)">
				<span class="icon"><svg-icon :name="getIconName(tool, event, index)" width="23px" height="16px"></svg-icon></span>
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
import { FootballCardApi } from "/@/api/sports/footballCard";
import { useRouter, useRoute } from "vue-router";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useLink } from "/@/views/sports/hooks/useLink";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import SportsCommonFn from "/@/views/sports/utils/common";

const SidebarStore = useSidebarStore();
const SportAttentionStore = useSportAttentionStore();
const { toggleEventScoreboard } = useToolsHooks();
const { gotoEventDetail } = useLink();
const router = useRouter();
const route = useRoute();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	event: any;
	displayContent: boolean;
}

const props = withDefaults(defineProps<teamDataType>(), {
	dataIndex: 0,
	displayContent: true,
	event: () => ({}),
});

const emit = defineEmits(["oddsChange"]);

// 盘口信息定义
const markets = [
	{ cardType: "capot", betType: 20, selectionsLength: 2 },
	{ cardType: "handicap", betType: 1, selectionsLength: 2 },
	{ cardType: "magnitude", betType: 3, selectionsLength: 2 },
	{ cardType: "magnitude", betType: 2, selectionsLength: 2 },
];

// 计算属性：格式化比赛开始时间
const formattedGameTime = computed(() => {
	const minutes = Math.floor(props.event.gameInfo.seconds / 60);
	const seconds = props.event.gameInfo.seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

// 计算属性：判断是否为直播状态
const isLive = computed(() => {
	return [1, 2, 3, 4, 99].includes(props.event.gameInfo.livePeriod) && !props.event.gameInfo.delayLive && !props.event.gameInfo.isHt;
});

// 计算属性：工具图标
const tools = computed(() => {
	const baseTools = [
		{
			iconName: "sports-score_icon",
			iconName_active: "sports-score_icon_active",
			tooltipText: "比分板",
			action: () => toggleEventScoreboard(props.event),
		},
	];

	if (props.event.streamingOption != 0 && props.event.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			iconName_active: "sports-live_icon_active",
			tooltipText: "视频源",
			action: () => toggleEventScoreboard(props.event, true),
		});
	}
	return baseTools;
});

// 计算属性：关注状态
const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.event.eventId);
});

// 点击关注按钮
const toggleAttention = async () => {
	const action = isAttention.value ? FootballCardApi.unFollow : FootballCardApi.saveFollow;
	const params = isAttention.value ? { thirdId: [props.event.eventId] } : { thirdId: props.event.eventId, type: 2 };
	await action(params);
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

// 跳转到比赛详细
const linkDetail = () => {
	const params = {
		leagueId: props.event.leagueId,
		eventId: props.event.eventId,
		dataIndex: props.dataIndex,
	};
	gotoEventDetail(params, SportTypeEnum.AmericanSoccer);
};

// 获取侧边栏图标
const getIconName = (tool: any, events: any, index: number) => {
	const { eventId } = SidebarStore.getEventsInfo;
	const isEventActive = events.eventId === eventId;
	if (!isEventActive) return tool.iconName;

	let activeIndex = -1;
	switch (SidebarStore.sidebarStatus) {
		case "scoreboard":
			activeIndex = 0;
			break;
		case "live":
			activeIndex = 1;
			break;
	}
	return index === activeIndex ? tool.iconName : tool.iconName_active;
};

// 点击对应工具
const handleClick = (tool: any) => {
	tool.action();
};

// 赔率变更事件
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};
</script>

<style scoped lang="scss">
.league-content {
	width: 100%;
	height: 114px;
	display: flex;
	background-color: var(--Bg1);
	&:last-child {
		border-bottom: 0px;
		.league-option {
			border-bottom: 0px;
		}
	}

	.content {
		width: 100%;
		height: 114px;

		.main {
			width: 100%;
			height: 84px;
			display: flex;

			.league {
				min-width: 284px;
				height: 100%;
			}
			.league-markets {
				width: 600px;
				display: flex;
				gap: 4px;
				padding: 8px 0px;
			}
		}
		.league-footer {
			width: 100%;
			height: 30px;
			display: flex;
			background: var(--Bg3);

			.other-info {
				width: 284px;
				padding: 0px 14px 0px 8px;
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
					font-size: 12px;
					font-weight: 400;
				}
				.info-list {
					height: 100%;
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
						color: var(--Text1);
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
			.score-list {
				width: 600px;
				display: flex;
				align-items: center;
				gap: 20px;
				.item {
					color: var(--Text1);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
				}
				.theme {
					color: var(--Theme);
				}
			}
		}
	}

	.league-option {
		width: 46px;
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
