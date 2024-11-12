<template>
	<div class="card-list-item">
		<!-- 头部信息 -->
		<header class="card-header">
			<svg-icon width="20px" height="20px" style="color: var(--theme)" name="sports-football" />
			<span class="name">
				<span v-ok-tooltip>{{ events.leagueName }}</span>
			</span>
			<div class="collection"><svg-icon width="22px" height="22px" class="collect_box" name="collect_box"></svg-icon><Collection class="coll-icon" /></div>
		</header>
		<!-- 开赛时间 -->
		<div class="sport-time">
			<span className="date">{{ SportsCommonFn.getEventsTitle(events) }}</span>
			<GameTime :cardData="events" />
		</div>
		<!-- 球队信息 -->
		<div class="sport-team-info">
			<div class="team home-team">
				<img style="width: 30px; height: 30px" :src="events.teamInfo.homeIconUrl" alt="" />
				<span class="name">
					<span>{{ events.teamInfo.homeName }}</span>
				</span>
				<div v-if="!SportsCommonFn.isStartMatch(events)" class="score color_TB bg_BG4">{{ events.gameInfo?.liveHomeScore }}</div>
			</div>
		</div>
		<div class="sport-team-info">
			<div class="team home-team">
				<img style="width: 30px; height: 30px" :src="events.teamInfo.awayIconUrl" alt="" />
				<span class="name">
					<span>{{ events.teamInfo.awayName }}</span>
				</span>
				<div v-if="!SportsCommonFn.isStartMatch(events)" class="score color_TB bg_BG4">{{ events.gameInfo?.liveAwayScore }}</div>
			</div>
		</div>
		<!-- 分割线 -->
		<div class="line"></div>
		<!-- 盘口 -->
		<div class="markets">
			<!-- 全场独赢 -->
			<div class="markets-item">
				<p class="markets-item-title">全场独赢</p>
				<div class="markets-item-content">
					<div @click="handleBet(events.markets[5], m, 5)" :class="`${isBright(m, events.markets[5]) ? 'isBright' : ''}`" v-for="m in events.markets[5].selections">
						<BetSelector :value="m?.oddsPrice?.decimalPrice" :id="`${events.markets[5].marketId}-${m?.key}`" :isRun="events.markets[5].marketStatus === 'running'">
							<BettingCom betType="moneyline" :cardData="m" :market="events.markets[5]" />
						</BetSelector>
					</div>
				</div>
			</div>
			<!-- 全场让球 -->
			<div class="markets-item">
				<p class="markets-item-title">全场让球</p>
				<div class="markets-item-content">
					<div @click="handleBet(events.markets[1], m, 1)" :class="`${isBright(m, events.markets[1]) ? 'isBright' : ''}`" v-for="m in events.markets[1].selections">
						<BetSelector :value="m?.oddsPrice?.decimalPrice" :id="`${events.markets[1].marketId}-${m?.key}`" :isRun="events.markets[1].marketStatus === 'running'">
							<BettingCom betType="pointSpread" :cardData="m" :market="events.markets[1]" />
						</BetSelector>
					</div>
				</div>
			</div>
			<!-- 全场大小 -->
			<div class="markets-item">
				<p class="markets-item-title">全场让球</p>
				<div class="markets-item-content">
					<div @click="handleBet(events.markets[3], m, 3)" :class="`${isBright(m, events.markets[3]) ? 'isBright' : ''}`" v-for="m in events.markets[3].selections">
						<BetSelector :value="m?.oddsPrice?.decimalPrice" :id="`${events.markets[3].marketId}-${m?.key}`" :isRun="events.markets[3].marketStatus === 'running'">
							<BettingCom betType="totalPoints" :cardData="m" :market="events.markets[3]" />
						</BetSelector>
					</div>
				</div>
			</div>
		</div>
		<!-- 底部更多投注 -->
		<footer>
			<div @click="router.push(`/sports/detail?pageName=todayContest&sportType=1&eventId=${events.eventId}&leagueId=${events.eventId}`)">
				更多投注 <svg-icon name="sports-arrow" width="8px" height="12px" />
			</div>
		</footer>
	</div>
</template>
<script lang="ts" setup>
import SportsCommonFn from "/@/views/sports/utils/common";
import { BettingCom } from "/@/views/sports/components/MatchCard/BetType";
import BetSelector from "/@/views/sports/components/BetSelector/index.vue";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
import { GameTime } from "/@/views/sports/components/Search/EventCard";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useUserStore } from "/@/stores/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
const sportsBetEvent = useSportsBetEventStore();
const UserStore = useUserStore();
const props = defineProps({
	events: { type: Object, required: true },
});

/**
 * 判断当前盘口是否高亮
 * @param {any} selection - 当前选项
 * @param {any} market - 当前盘口
 * @returns {boolean} 是否高亮
 */
const isBright = (selection: any, market: any): boolean => {
	return sportsBetEvent.getEventInfo[props.events.eventId]?.listKye === `${market?.marketId}-${selection?.key}`;
};

const handleBet = (market: any, selection: any, type: number): void => {
	if (market.marketStatus === "running") {
		if (isBright(selection, market)) {
			sportsBetEvent.removeEventCart(props.events);
		} else {
			sportsBetEvent.storeEventInfo(props.events.eventId, {
				marketId: market.marketId,
				betType: type,
				selectionKey: selection.key,
			});
			sportsBetEvent.addEventToCart({ ...props.events });
		}
	}
};

const { Collection } = useHeaderTools(props.events);
</script>

<style scoped lang="scss">
.card-list-item {
	width: calc((100% - 36px) / 3);
	height: 100%;
	background-color: var(--Bg1);
	border-radius: 12px;
	padding: 16px 12px;
	header {
		display: flex;
		column-gap: 4px;
		width: 100%;
		height: 22px;
		align-items: center;
		.icon {
			height: 20px;
		}
		.icon,
		.collection {
			flex: 1;
		}
		.name {
			width: 100%;
			color: var(--Text1);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.collection {
			height: 20px;
			width: 20px;
			background: linear-gradient(to bottom, #f4f5f5, #c8cacd);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.coll-icon {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
	.sport-time {
		height: 20px;
		line-height: 20px;
		margin-top: 8px;
		color: var(--Text1);
		margin-bottom: 24px;
	}
	.sport-team-info {
		display: flex;
		flex-direction: column;
		width: 100%;
		row-gap: 14px;
		.team {
			height: 38px;
			width: 100%;
			display: flex;
			align-items: center;
			img {
				width: 30px;
				height: 30px;
				flex: 1;
			}
			.name {
				width: 100%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 20px;
				color: var(--Text_a);
				padding-left: 12px;
			}
			.score {
				height: 100%;
				width: 48px;
				border-radius: 8px;
				background-color: var(--Line_2);
				display: flex;
				justify-content: center;
				align-items: center;
				color: var(--Text_a);
				font-family: "DIN Alternate";
				font-size: 18px;
				font-weight: 700;
			}
		}
	}
	.line {
		width: 100%;
		height: 1px;
		background-color: var(--Line_1);
		margin: 14px 0;
	}
	footer {
		text-align: center;
		margin-top: 20px;
		cursor: pointer;
		color: var(--Text1);
		font-size: 16px;
	}
	.markets {
		&-item {
			margin-bottom: 14px;
			&:last-child {
				margin-bottom: 20px;
			}
		}
		&-item-title {
			color: var(--Text1);
			font-size: 16px;
			margin-bottom: 8px;
		}
		&-item-content {
			display: flex;
			gap: 8px;
			cursor: pointer;
			overflow: hidden;
			position: relative;
			border-radius: 4px;
			> div {
				width: 100%;
				height: 32px;
				position: relative;
				&.isBright::after {
					content: "";
					width: 100%;
					height: 100%;
					position: absolute;
					border: 1px solid var(--Bg5) !important;
					border-radius: 4px;
					box-sizing: border-box;
					left: 0;
					top: 0;
				}
			}
			:deep(.bet-selector) {
				background-color: var(--Line_2);
				border-radius: 2px;

				.label {
					color: var(--Text_a);
				}
				.market-item {
					position: relative;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 6px;
					border-radius: 4px;
					background: var(--Bg3);
					box-sizing: border-box;
					&:hover {
						background-color: var(--betselector-hover-bg);
					}
					.label {
						max-width: 60%;
						color: var(--Text1);
						font-family: PingFang SC;
						font-size: 12px;
						font-weight: 400;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.value {
						position: relative;
						color: var(--Text_a);

						font-size: 18px;
						font-weight: 400;
						span {
							font-family: "DIN Alternate" !important;
						}
					}
					.noData {
						color: var(--Text1);
					}
				}
			}
		}
	}
}
</style>
