<template>
	<div class="league-content">
		<div class="content">
			<div class="main">
				<div class="league">
					<!-- 显示队伍信息卡片 -->
					<TeamInfoCard :dataIndex="dataIndex" :teamData="event" />
				</div>
				<!-- 盘口信息 -->
				<div class="league-markets">
					<!-- 使用v-for动态生成盘口类型 -->
					<MarketColumn
						v-for="market in marketConfig"
						:key="market.betType"
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
					<!-- 显示赛事时间 -->
					<div class="date">
						<span>{{ SportsCommonFn.getEventsTitle(event) }}</span>
						<!-- 未开始的比赛才显示格式化时间 -->
						<span v-if="!SportsCommonFn.isStartMatch(event.globalShowTime)">{{ formattedGameTime }}</span>
					</div>
					<div class="info-list">
						<!-- 收藏按钮，点击切换收藏状态 -->
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
			</div>
		</div>

		<!-- 工具栏图标 -->
		<div class="league-option">
			<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool)">
				<span class="icon"><svg-icon :name="getIconName(tool, event, index)" width="23px" height="16px"></svg-icon></span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// 引入所需模块和工具
import { computed } from "vue";
import TeamInfoCard from "../teamInfoCard/teamInfoCard.vue";
import MarketColumn from "../marketColumn/marketColumn.vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
import SportsApi from "/@/api/sports/sports";
import { useRouter, useRoute } from "vue-router";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { useLink } from "/@/views/sports/hooks/useLink";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";

const SportAttentionStore = useSportAttentionStore();
const SidebarStore = useSidebarStore();
const SportHotStore = useSportHotStore();
const { toggleEventScoreboard } = useToolsHooks();
const { gotoEventDetail } = useLink();

const router = useRouter();
const route = useRoute();

// 定义属性类型和默认值
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

// 盘口配置数组，便于统一管理
const marketConfig = [
	{ cardType: "capot", betType: 20, selectionsLength: 2 },
	{ cardType: "handicap", betType: 1, selectionsLength: 2 },
	{ cardType: "magnitude", betType: 3, selectionsLength: 2 },
];

// 获取侧边栏图标名称
const getIconName = (tool: any, events: any, index: number) => {
	const { eventId } = SidebarStore.getEventsInfo;
	const isEventActive = events.eventId === eventId;
	if (!isEventActive) {
		return tool.iconName;
	}
	let activeIndex = -1;
	switch (SidebarStore.sidebarStatus) {
		case "scoreboard":
			activeIndex = 0;
			break;
		case "live":
			activeIndex = 1;
			break;
	}
	return index === activeIndex ? tool.iconName_active : tool.iconName;
};

// 处理赔率变化事件
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

// 格式化比赛开始时间
const formattedGameTime = computed(() => {
	const minutes = Math.floor(props.event.gameInfo.seconds / 60);
	const seconds = props.event.gameInfo.seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

// 定义工具栏的图标配置
const tools = computed(() => {
	const baseTools = [
		{
			iconName: "sports-score_icon",
			iconName_active: "sports-score_icon_active",
			tooltipText: "比分板",
			action: (event: any) => toggleEventScoreboard(event),
			param: props.event,
		},
	];
	if (props.event.streamingOption != 0 && props.event.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			iconName_active: "sports-live_icon_active",
			tooltipText: "视频源",
			action: (event: any) => toggleEventScoreboard(event, true),
			param: props.event,
		});
	}
	return baseTools;
});

// 点击工具图标的处理函数
const handleClick = (tool: any) => {
	tool.action(tool.param);
};

// 计算属性，判断当前赛事是否已经被关注
const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.event.eventId);
});

// 切换关注状态
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await SportsApi.unFollow({
			thirdId: [props.event.eventId],
		});
	} else {
		await SportsApi.saveFollow({
			thirdId: props.event.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

// 跳转到比赛详细页面
const linkDetail = () => {
	const params = {
		leagueId: props?.event?.leagueId,
		eventId: props?.event?.eventId,
		dataIndex: props?.dataIndex,
	};
	toggleEventScoreboard(props.event);
	gotoEventDetail(params, SportTypeEnum.AmericanSoccer);
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
