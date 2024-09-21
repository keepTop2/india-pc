<template>
	<div class="hot-event-container">
		<div class="hot_header">热门赛事</div>
		<div class="event-list">
			<div class="event-card" v-for="(item, index) in promotionsData" :key="index">
				<div class="card-header">
					<div class="left">
						<div class="event-title">{{ item.leagueName }}</div>
					</div>
					<div class="right">
						<div class="event-info">
							<div class="event-date">下半场 89:26</div>
							<div class="event-collection"><svg-icon :name="'sports-collection'" size="16px" /></div>
						</div>
					</div>
				</div>
				<div class="event-team-info">
					<div class="left">
						<div class="team-icon"><img :src="item.teamInfo.homeIconUrl" alt="" /></div>
						<div class="team-name">{{ item.teamInfo.homeName }}</div>
					</div>
					<div class="right"></div>
				</div>
				<div class="event-team-info">
					<div class="left">
						<div class="team-icon"><img :src="item.teamInfo.awayIconUrl" alt="" /></div>
						<div class="team-name">{{ item.teamInfo.awayName }}</div>
					</div>
					<div class="right"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";

const promotionsData = computed(() => {
	return viewSportPubSubEventData.promotionsViewData.value;
});

console.log("promotionsData", promotionsData);
</script>

<style scoped lang="scss">
.hot-event-container {
	.hot_header {
		width: 100%;
		height: 42px;
		padding: 10px 14px;
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 16px;
		font-weight: 400;
	}
	.event-list {
		display: grid;
		margin: 0px 12px;
		gap: 6px;
		.event-card {
			padding: 12px 14px;
			border-radius: 8px;
			background: var(--Bg);
			.card-header {
				display: flex;
				align-items: center;

				.event-title {
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					line-height: 20px;
				}

				.event-info {
					display: flex;
					align-items: center;
					gap: 12px;
					.event-date {
						color: var(--Text1);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
						line-height: 20px;
					}
					.event-collection {
						width: 16px;
						height: 20px;
						display: flex;
						align-items: center;
					}
				}
			}
			.event-team-info {
				.team-icon {
					width: 20px;
					height: 20px;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.team-name {
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
				}
			}
			.left {
				flex: 1;
			}
			.right {
				width: 140px;
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
