<template>
	<div class="hot-event-container">
		<div class="hot_header"><span class="header-icon"></span>热门赛事</div>
		<div class="event-list">
			<div class="event-card" v-for="(item, index) in promotionsData" :key="index">
				<div class="card-header">
					<div class="left">
						<div class="event-title">{{ item.leagueName }}</div>
					</div>
					<div class="right">
						<div class="event-info">
							<div class="event-date">{{ SportsCommonFn.getEventsTitle(item) }}</div>
							<div class="event-collection" @click="attentionEvent(!SportAttentionStore.attentionEventIdList.includes(item.eventId) ? false : true, item)">
								<svg-icon :name="!SportAttentionStore.attentionEventIdList.includes(item.eventId) ? 'sports-collection' : 'sports-already_collected'" size="16px" />
							</div>
						</div>
					</div>
				</div>
				<div class="event-team">
					<div class="event-team-info">
						<div class="left">
							<div class="team-icon"><img :src="item.teamInfo?.homeIconUrl" alt="" /></div>
							<div class="team-name">{{ item.teamInfo?.homeName }}</div>
						</div>
						<div class="right">
							<div class="market-item" v-if="item.markets && item.markets[3]">
								<div class="label">
									<span>{{ item.markets[3].selections[0]?.keyName }}</span>
									<span>{{ item.markets[3].selections[0]?.point }}</span>
								</div>
								<div class="value">
									<span :class="oddsClass(item)">{{ item.markets[3].selections[0]?.oddsPrice?.decimalPrice }}</span>
									<div class="arrow-icon">
										<RiseOrFall :status="oddsChange(item)" @animationEnd="item.oddsChange = ''" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="event-team-info">
						<div class="left">
							<div class="team-icon"><img :src="item.teamInfo?.awayIconUrl" alt="" /></div>
							<div class="team-name">{{ item.teamInfo?.awayName }}</div>
						</div>
						<div class="right">
							<div class="market-item" v-if="item.markets && item.markets[3]">
								<div class="label">
									<span>{{ item.markets[3].selections[1]?.keyName }}</span>
									<span>{{ item.markets[3].selections[1]?.point }}</span>
								</div>
								<div class="value">
									<span :class="oddsClass(item)">{{ item.markets[3].selections[1]?.oddsPrice?.decimalPrice }}</span>
									<div class="arrow-icon">
										<RiseOrFall :status="oddsChange(item)" @animationEnd="item.oddsChange = ''" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RiseOrFall } from "/@/components/Sport/index";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import SportsCommonFn from "/@/views/sports/utils/common";
import { FootballCardApi } from "/@/api/sports/footballCard";
import PubSub from "/@/pubSub/pubSub";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";

const SportAttentionStore = useSportAttentionStore();

const promotionsData = computed(() => {
	return viewSportPubSubEventData.sidebarData.promotionsViewData || [];
});

// 点击关注按钮
const attentionEvent = async (isActive: boolean, item: any) => {
	if (isActive) {
		await FootballCardApi.unFollow({
			thirdId: [item.eventId],
		});
	} else {
		await FootballCardApi.saveFollow({
			thirdId: item.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

/**
 * @description 赔率状态类名
 */
const oddsClass = (item: any) => {
	if (!item.oddsChange) {
		return "";
	} else if (item.oddsChange === "oddsUp") {
		return "oddsUp";
	} else if (item.oddsChange === "oddsDown") {
		return "oddsDown";
	}
};
/**
 * @description 赔率状态类名
 */
const oddsChange = (item: any) => {
	if (!item.oddsChange) {
		return 3;
	} else if (item.oddsChange === "oddsUp") {
		return 1;
	} else if (item.oddsChange === "oddsDown") {
		return 2;
	}
};
</script>

<style scoped lang="scss">
.oddsUp {
	color: var(--Theme) !important;
}
.oddsDown {
	color: var(--Success) !important;
}

.hot-event-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	margin-top: 8px;
	background-color: var(--Bg4);

	.hot_header {
		position: relative;
		width: 100%;
		height: 38px;
		display: flex;
		align-items: center;
		padding: 0px 12px;
		border-radius: 4px;
		background: var(--Bg6);
		box-shadow: 0px 1px 1px 0px rgba(255, 255, 255, 0.1) inset;
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 16px;
		font-weight: 300;
		.header-icon {
			position: absolute;
			width: 4px;
			height: 22px;
			top: 50%;
			left: 0;
			transform: translate(0px, -50%);
			background-color: var(--Theme);
			border-radius: 0 4px 4px 0;
		}
	}
	.event-list {
		flex: 1;
		overflow: auto; /* 下容器内容超出时显示滚动条 */
		padding: 0px 4px 4px 4px;
		.event-card {
			// padding: 12px 14px;
			margin-top: 4px;
			border-radius: 4px;
			background-color: var(--Bg2);
			.card-header {
				width: 100%;
				height: 36px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 8px;
				border-bottom: 1px solid var(--Line_1);
				box-shadow: 0px 1px 0px 0px var(--Line_2);

				.event-title {
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 300;
					line-height: 20px;
					white-space: nowrap; /* 不换行 */
					overflow: hidden; /* 超出部分隐藏 */
					text-overflow: ellipsis; /* 超出部分显示省略号 */
				}

				.event-info {
					display: flex;
					align-items: center;
					gap: 12px;
					.event-date {
						color: var(--Text1);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 300;
						line-height: 20px;
					}
					.event-collection {
						width: 16px;
						height: 20px;
						display: flex;
						align-items: center;
						cursor: pointer;
					}
				}
			}

			.event-team {
				display: grid;
				gap: 4px;
				padding: 8px;
				.event-team-info {
					width: 100%;
					display: flex;
					justify-content: space-between;
					.team-icon {
						width: 20px;
						height: 20px;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 5px;
						cursor: pointer;

						img {
							width: 100%;
							height: 100%;
						}
					}
					.team-name {
						width: 150px;
						color: var(--Text_s);
						font-family: "PingFang SC";
						font-size: 12px;
						font-weight: 400;
						overflow: hidden; /* 隐藏超出部分的文本 */
						text-overflow: ellipsis; /* 使用省略号显示超出的文本 */
						white-space: nowrap; /* 强制在一行显示，避免换行 */
						cursor: pointer;
					}
					.market-item {
						width: 100%;
						height: 32px;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0px 18px 0px 12px;
						border-radius: 4px;
						background-color: var(--Bg3);
						cursor: pointer;
						.label {
							width: 50%;
							height: 100%;
							display: flex;
							align-items: center;
							span {
								font-size: 12px;
								font-weight: 400;
								&:first-child {
									color: var(--Text1);
								}
								&:last-child {
									margin-left: 4px;
									color: var(--Text_s);
								}
							}
						}
						.value {
							position: relative;
							width: 50%;
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: end;
							color: var(--Text_s);
							font-family: "PingFang SC";
							font-size: 14px;
							font-weight: 400;
							.arrow-icon {
								position: absolute;
								top: 50%;
								right: -15px;
								transform: translate(0, -50%);
							}
						}
					}
				}
			}
			.left {
				width: calc(100% - 160px);
			}
			.right {
				width: 160px;
				justify-content: end;
			}
			.left,
			.right {
				display: flex;
				align-items: center;
			}
		}
	}
}
</style>
