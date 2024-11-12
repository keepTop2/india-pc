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
						<span>{{ SportsCommonFn.getEventsTitle(event) }} {{ gameTime }}</span>
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
			<!-- 工具图标 -->
			<Scoreboard />
			<Live />
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
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { useLink } from "/@/views/sports/hooks/useLink";
import SportsCommonFn from "/@/views/sports/utils/common";
import useGameTimer from "/@/views/sports/hooks/useGameTimer";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
const SportAttentionStore = useSportAttentionStore();
const { gotoEventDetail } = useLink();

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

// 计算属性：关注状态
const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.event.eventId);
});

// 点击关注按钮
const toggleAttention = async () => {
	const action = isAttention.value ? SportsApi.unFollow : SportsApi.saveFollow;
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

	gotoEventDetail(params, SportTypeEnum.IceHockey);
};

// 赔率变更事件
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

//比赛时间
const gameState = computed(() => props.event);
const { gameTime } = useGameTimer(gameState);
// 工具栏按钮
const { Live, Scoreboard } = useHeaderTools(gameState);
</script>

<style scoped lang="scss">
.league-content {
	width: 100%;
	height: 114px;
	display: flex;
	background-color: var(--Bg-1);
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
			background: var(--Bg-3);

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
						color: var(--Text-1);
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
					color: var(--Text-1);
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
		border-left: 1px solid var(--Line-2);
		border-bottom: 1px solid var(--Line-2);
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
