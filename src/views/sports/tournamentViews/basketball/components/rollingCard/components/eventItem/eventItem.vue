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
						v-for="(betType, index) in betTypes"
						:key="betType.id"
						:cardType="betType.cardType"
						:sportInfo="event"
						:betType="betType.type"
						:selectionsLength="betType.selectionsLength"
						@oddsChange="oddsChange"
					/>
				</div>
			</div>
			<div class="league-footer">
				<div class="other-info">
					<!-- 塞节时间 -->
					<div class="date">
						<span>{{ SportsCommonFn.getEventsTitle(event) }} {{ gameTime }}</span>
					</div>
					<div class="info-list">
						<!-- 收藏 -->
						<span class="collection">
							<svg-icon :name="isAttention ? 'sports-already_collected' : 'sports-collection'" size="14px" @click="toggleAttention" />
						</span>
						<!-- 盘口数量 -->
						<div class="markets-qty" @click="linkDetail">
							<span>+{{ event.marketCount }}</span>
							<span class="arrow-icon"><svg-icon name="sports-arrow" width="8px" height="12px" /></span>
						</div>
					</div>
				</div>
				<!-- 节数比分 -->
				<div class="score-list" v-if="event.basketballInfo?.latestLivePeriod > 0">
					<div class="item" :class="{ theme: getPeriod.length === index + 1 }" v-for="(item, index) in getPeriod" :key="item">{{ item[0] }}-{{ item[1] }}</div>
				</div>
			</div>
		</div>

		<!-- 其他信息 -->
		<div class="league-option">
			<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool)">
				<span class="icon"><svg-icon :name="getIconName(tool, event, index)" width="23px" height="16px" /></span>
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
import SportsApi from "/@/api/sports/sports";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { useLink } from "/@/views/sports/hooks/useLink";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import useGameTimer from "/@/views/sports/hooks/useGameTimer";

const SportAttentionStore = useSportAttentionStore();
const SportHotStore = useSportHotStore();
const SidebarStore = useSidebarStore();
const { gotoEventDetail } = useLink();
const { toggleEventScoreboard } = useToolsHooks();

interface TeamDataType {
	dataIndex: number;
	event: any; // 考虑为 event 添加具体类型
	displayContent: boolean;
}

const props = withDefaults(defineProps<TeamDataType>(), {
	dataIndex: 0,
	displayContent: true,
	event: () => ({}),
});

const emit = defineEmits(["oddsChange"]);

// 比赛节数
const getPeriod = computed(() => {
	const { homeGameScore, awayGameScore, homeOverTimeScore, awayOverTimeScore, latestLivePeriod } = props.event.basketballInfo;
	// 加时赛
	if (latestLivePeriod > 4) {
		const periods = homeGameScore.map((score: number, index: number) => [score, awayGameScore[index]]);
		periods.push([homeOverTimeScore, awayOverTimeScore]);
		return periods;
	} else {
		return homeGameScore.slice(0, latestLivePeriod).map((score: number, index: number) => [score, awayGameScore[index]]);
	}
});

// 盘口类型配置
const betTypes = [
	{ id: 1, cardType: "capot", type: 20, selectionsLength: 2 },
	{ id: 2, cardType: "handicap", type: 1, selectionsLength: 2 },
	{ id: 3, cardType: "magnitude", type: 3, selectionsLength: 2 },
	{ id: 4, cardType: "magnitude", type: [401, 402], selectionsLength: 2 },
];

// 获取侧边栏图标
const getIconName = (tool: any, events: any, index: number) => {
	const { eventId } = SidebarStore.getEventsInfo; // 获取当前事件 ID
	const isEventActive = events.eventId === eventId; // 判断事件是否活跃
	if (!isEventActive) {
		return tool.iconName; // 非活跃状态返回默认图标
	}
	const activeIndex = SidebarStore.sidebarStatus === "scoreboard" ? 0 : 1; // 根据侧边栏状态确定活跃索引
	return index === activeIndex ? tool.iconName_active : tool.iconName; // 返回相应的图标名称
};

// 处理赔率变化
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

/**
 * @description  计算工具图标的显示状态
 */
const tools = computed(() => {
	const baseTools = [];
	// 判断 是否在未开赛页面
	baseTools.push({
		iconName: "sports-score_icon",
		iconName_active: "sports-score_icon_active",
		tooltipText: "比分板",
		name: "scoreboard",
		action: (event: any) => toggleEventScoreboard(event), // 闭包函数，事件绑定传递参数
		param: props.event, // 传递参数
	});
	// 判断是否有视频源
	if (props.event.streamingOption != 0 && props.event.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			iconName_active: "sports-live_icon_active",
			tooltipText: "视频源",
			name: "live",
			action: (event: any) => toggleEventScoreboard(event, true),
			param: props.event, // 传递参数
		});
	}
	return baseTools;
});

// 点击对应工具
const handleClick = (tool: any) => {
	toggleEventScoreboard(props?.event);
	tool.action(tool.param); // 执行对应工具的动作
	SidebarStore.getSidebarStatus(tool.name);
};

// 判断是否关注
const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.event.eventId);
});

// 切换关注状态
const toggleAttention = async () => {
	if (isAttention.value) {
		await SportsApi.unFollow({ thirdId: [props.event.eventId] });
	} else {
		await SportsApi.saveFollow({ thirdId: props.event.eventId, type: 2 });
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

// 跳转到比赛详细
const linkDetail = () => {
	const params = {
		leagueId: props.event.leagueId,
		eventId: props.event.eventId,
		dataIndex: props.dataIndex,
	};
	SportHotStore.setCurrentEvent(props.event);
	toggleEventScoreboard(props.event);
	gotoEventDetail(params, SportTypeEnum.Basketball);
};

//比赛时间
const gameState = computed(() => props.event);
const { gameTime } = useGameTimer(gameState);
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
				padding: 8px 4px 8px 0px;
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
