<template>
	<div class="league-info">
		<!-- 队伍信息 -->
		<div class="league-team-info">
			<!-- 主队 -->
			<div class="team">
				<div class="team-icon"><img class="icon" :src="teamData.teamInfo?.homeIconUrl" /></div>
				<div class="team-name">{{ teamData.teamInfo.homeName }}</div>
				<!-- 得分 -->
				<div class="score">{{ teamData.gameInfo?.liveHomeScore }}</div>
			</div>
			<!-- 客队 -->
			<div class="team">
				<div class="team-icon"><img class="icon" :src="teamData.teamInfo?.awayIconUrl" /></div>
				<div class="team-name">{{ teamData.teamInfo.awayName }}</div>
				<!-- 得分 -->
				<div class="score">{{ teamData.gameInfo?.liveAwayScore }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { FootballCardApi } from "/@/api/sports/footballCard";
import { computed } from "vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
import { useLink } from "/@/views/sports/hooks/useLink";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
const SportAttentionStore = useSportAttentionStore();
const router = useRouter();
const route = useRoute();
const { gotoEventDetail } = useLink();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 当前路由名称 */
	IfOffTheBat?: string;
	/** 队伍数据 */
	teamData: any;
}

const props = withDefaults(defineProps<teamDataType>(), {
	/** 数据索引 */
	dataIndex: 0,
	/** 当前路由名称 */
	IfOffTheBat: "rollingBall",
	teamData: () => {
		return {};
	},
});
/**
 * @description: 跳转到比赛详细
 */
const linkDetail = () => {
	const params = {
		leagueId: props?.teamData?.leagueId,
		eventId: props?.teamData?.eventId,
		dataIndex: props?.dataIndex,
	};
	gotoEventDetail(params, SportTypeEnum.AmericanSoccer);
};
</script>

<style scoped lang="scss">
.league-info {
	flex: 1;
	display: flex;
	align-items: center;
	padding: 8px 10px 8px 24px;
	.league-team-info {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		.team {
			display: flex;
			align-items: center;
			gap: 6px;
			.team-icon {
				width: 20px;
				height: 20px;
				.icon {
					width: 100%;
					height: 100%;
				}
			}
			.team-name {
				max-width: 286px;
				flex: 1;
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				white-space: nowrap; /* 防止文本换行 */
				overflow: hidden; /* 超出部分隐藏 */
				text-overflow: ellipsis; /* 超出部分显示省略号 */
			}

			.score {
				min-width: 32px;
				height: 34px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--Theme);
				font-family: "DIN Alternate";
				font-size: 16px;
				font-weight: 700;
			}
		}
	}
}
</style>
