<template>
	<div class="league-content">
		<div class="content">
			<div class="main">
				<!-- 队伍信息 -->
				<TeamInfoCard :dataIndex="dataIndex" :teamData="event"></TeamInfoCard>
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
					<div class="score-list" v-if="event.volleyballInfo">
						<div class="item" :class="{ theme: event?.volleyballInfo?.latestLivePeriod == item }" v-for="(item, index) in event?.volleyballInfo?.latestLivePeriod" :key="item">
							{{ event.volleyballInfo.homeGameScore[index] }}-{{ event.volleyballInfo.awayGameScore[index] }}
						</div>
					</div>
					<!-- 总分 -->
					<div class="total-score">
						<span>{{ event.gameSession }}局{{ Math.ceil(event.gameSession / 2) }}胜</span>
						<template v-if="event.volleyballInfo">
							<span>|</span>
							<span class="theme"
								>总分{{ event?.volleyballInfo?.homeGameScore.flat().reduce((a, b) => a + b, 0) }}-{{ event?.volleyballInfo?.awayGameScore.flat().reduce((a, b) => a + b, 0) }}</span
							>
							<span class="theme"
								>({{ event?.volleyballInfo?.homeGameScore.flat().reduce((a, b) => a + b, 0) + event?.volleyballInfo?.awayGameScore.flat().reduce((a, b) => a + b, 0) }})</span
							>
						</template>
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
import SportsCommonFn from "/@/views/sports/utils/common";
import { useLink } from "/@/views/sports/hooks/useLink";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
const { toggleEventScoreboard } = useToolsHooks();
const { gotoEventDetail } = useLink();
const SportAttentionStore = useSportAttentionStore();

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

// 盘口信息定义
const markets = [
	{ cardType: "capot", betType: 20, selectionsLength: 2 }, // 独赢
	{ cardType: "handicap", betType: 704, selectionsLength: 2 }, // 让分
	{ cardType: "magnitude", betType: 705, selectionsLength: 2 }, // 总分
];

const emit = defineEmits(["oddsChange"]);

/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.event.eventId);
});

// 点击关注按钮
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

/**
 * @description: 跳转到比赛详细
 */
const linkDetail = () => {
	const params = {
		leagueId: props?.event?.leagueId,

		eventId: props?.event?.eventId,
		dataIndex: props?.dataIndex,
	};
	toggleEventScoreboard(props.event);

	gotoEventDetail(params, SportTypeEnum.Volleyball);
};

// 工具栏按钮
const gameState = computed(() => props.event);
const { Live, Scoreboard } = useHeaderTools(gameState);
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
		width: 884px;
		height: 114px;

		.main {
			width: 100%;
			height: 84px;
			display: flex;
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

			.score-info {
				width: 600px;
				display: flex;
				justify-content: space-between;
				.score-list {
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
				.total-score {
					display: flex;
					align-items: center;
					gap: 6px;
					padding-right: 22px;
					span {
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
