<template>
	<div class="info">
		<!-- 主队 -->
		<div class="left">
			<SportTeam :team-name="get(currentEventInfo.teamInfo, 'homeName', '')" :team-icon="get(currentEventInfo.teamInfo, 'homeIconUrl', '')" />
			<!-- 比分信息 -->
			<div>
				<div>
					<span class="danger"></span>
					{{ get(currentEventInfo.soccerInfo, "homeRedCard", 0) }}
				</div>
				<div>
					<span class="warning"></span>
					{{ get(currentEventInfo.soccerInfo, "homeYellowCard", 0) }}
				</div>
			</div>
		</div>
		<!-- 当前比赛时间信息 -->
		<div class="time">
			<div>
				<span v-for="item in computedSportShowTime" :key="item">{{ item }}</span>
			</div>
			<div>
				<span>{{ computedScore.home }}</span>
				<span>{{ computedScore.away }}</span>
			</div>
		</div>
		<!-- 客队 -->
		<div class="right">
			<SportTeam :team-name="get(currentEventInfo.teamInfo, 'awayName', '')" :team-icon="get(currentEventInfo.teamInfo, 'awayIconUrl', '')" :is-left="false" />
			<div>
				<div>
					<span class="warning"></span>
					{{ get(currentEventInfo.soccerInfo, "awayYellowCard", 0) }}
				</div>
				<div>
					<span class="danger"></span>
					{{ get(currentEventInfo.soccerInfo, "awayRedCard", 0) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { get, isEmpty } from "lodash-es";
import SportTeam from "./sportTeam.vue";
import SportsCommonFn from "/@/views/sports/utils/common";
// import { SportsRootObject } from "/@/views/sports/models/interface";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { useSportEventDetailTool } from "./useSportEventDetailTool";

const SportHotStore = useSportHotStore();
const { currentEventInfo } = storeToRefs(SportHotStore);
const { getSportEventScore } = useSportEventDetailTool();

/**
 * 计算比赛相关时间
 */
const computedSportShowTime = computed(() => (isEmpty(currentEventInfo.value) ? [] : SportsCommonFn.getEventsTitle(currentEventInfo.value, "MM月DD日 HH:mm")));

const computedScore = computed(() => {
	return getSportEventScore(currentEventInfo.value);
});
</script>

<style lang="scss" scoped>
.info {
	padding: 0 12px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	background: var(--Bg3);
	color: var(--Text1);

	.left,
	.right {
		display: flex;
		flex-direction: column;
		gap: 10px;

		& > div {
			display: flex;
			gap: 11px;

			& > div {
				display: flex;
				align-items: center;
				gap: 6px;

				.danger {
					display: inline-block;
					width: 9.8px;
					height: 12.6px;
					border-radius: 1px;
					background: var(--Warn);
				}

				.warning {
					display: inline-block;
					width: 9.8px;
					height: 12.6px;
					border-radius: 1px;

					background: var(--F1);
				}
			}
		}

		& > div:first-child {
			gap: 8px;
			font-size: 14px !important;

			span {
				width: 82px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		}

		& > div:last-child {
			font-size: 12px !important;
		}
	}

	.right {
		align-items: flex-end;
	}

	.time {
		display: flex;
		flex-direction: column;
		gap: 4px;

		& > div {
			display: flex;
		}

		& > div:first-child {
			font-size: 14px !important;
			gap: 3px;

			span:last-child {
				background: var(--Bg3);
				color: var(--Theme);
			}
		}

		& > div:last-child {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px !important;
			padding: 0 8px;

			span {
				width: 22px;
				height: 28px;
				text-align: center;
				line-height: 28px;

				background: var(--Bg4);
			}
		}
	}
}
</style>
