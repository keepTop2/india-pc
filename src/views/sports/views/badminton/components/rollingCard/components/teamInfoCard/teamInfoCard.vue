<!--
 * @Author: Relax
 * @Description: 体育-羽毛球-队伍卡片
-->
<template>
	<div class="card-container">
		<div class="information_team">
			<!-- 队伍名称 -->
			<div class="team" @click="linkDetail">
				<div class="team_one">
					<div class="team_name">
						<img class="icon" :src="teamData.teamInfo?.homeIconUrl" />
						<div class="name">
							<span>{{ teamData.teamInfo.homeName }}</span>
						</div>
					</div>
					<!-- 红牌黄牌数量 -->
					<div class="foul-info">
						<span v-if="teamData.soccerInfo?.homeRedCard > 0" class="red">{{ teamData.soccerInfo?.homeRedCard }}</span>
						<span v-if="teamData.soccerInfo?.homeYellowCard > 0" class="yellow">{{ teamData.soccerInfo?.homeYellowCard }}</span>
					</div>
				</div>
				<!-- 队伍名称 -->
				<div class="team_two">
					<div class="team_name">
						<img class="icon" :src="teamData.teamInfo?.awayIconUrl" />
						<div class="name">
							<span>{{ teamData.teamInfo.awayName }}</span>
						</div>
					</div>

					<!-- 红牌黄牌数量 -->
					<div class="foul-info">
						<span v-if="teamData.soccerInfo?.awayRedCard > 0" class="red">{{ teamData.soccerInfo?.awayRedCard }}</span>
						<span v-if="teamData.soccerInfo?.awayYellowCard > 0" class="yellow">{{ teamData.soccerInfo?.awayYellowCard }}</span>
					</div>
				</div>
			</div>
			<!-- 队伍比分 -->
			<div :class="[IfOffTheBat == 'rollingBall' ? 'score' : ' is_show ']">
				<span>{{ teamData.gameInfo?.liveHomeScore }}</span>
				<i class="icon"></i>
				<span>{{ teamData.gameInfo?.liveAwayScore }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { FootballCardApi } from "/@/api/menu/sports/footballCard";
import { computed } from "vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
import { useLink } from "/@/hooks/useLink";
import { SportTypeEnum } from "/@/enum/sportEnum/sportEnum";

const SportAttentionStore = useSportAttentionStore();
const router = useRouter();
const route = useRoute();
const { gotoEventDetail } = useLink();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 当前路由名称 */
	IfOffTheBat: string;
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
		eventId: props?.teamData?.eventId,
		dataIndex: props?.dataIndex,
	};
	gotoEventDetail(params, SportTypeEnum.Badminton);
};
</script>

<style scoped lang="scss">
.is_show {
	display: none;
}
.card-container {
	width: 100%;
	display: flex;
	.information_team {
		flex: 1;
		margin-left: 12px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.team {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 14px 0;

			.icon {
				-webkit-user-drag: none;
				width: 20px;
				height: 20px;
			}

			.name {
				cursor: pointer;
				color: var(--Text1);

				flex: 1;
				position: relative;
				overflow: hidden;
				display: flex;
				// height: 100%;
				height: 24px;
				margin-left: 8px;
				box-sizing: border-box;

				span {
					width: 100%;
					// height: 100%;
					white-space: nowrap;
					/* 不允许换行 */
					overflow: hidden;
					/* 超出部分隐藏 */
					text-overflow: ellipsis;
					/* 显示省略号 */
					font-family: "PingFang SC";
					font-size: 16px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
					margin-left: 8px;
					top: 0;
					position: absolute;
				}
			}
			.team_one {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.team_two {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 22px;
			}
			.team_name {
				flex: 1;
				display: flex;
				align-items: center;
			}
			.foul-info {
				display: flex;
				align-items: center;
				margin-right: 21px;
				.yellow {
					margin-left: 10px;
					background-color: var(--F1);
				}
				.red {
					margin-left: 5px;
					background-color: var(--Warn);
				}
				.yellow,
				.red {
					padding: 2px;
					border-radius: 2px;
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
					line-height: 14px; /* 100% */
				}
			}
		}

		.score {
			display: flex;
			align-items: center;

			span {
				display: flex;
				padding: 10px;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 10px;
				flex-shrink: 0;
				border-radius: 4px;

				color: var(--Text_s);
				background: var(--Bg4);

				font-family: "DIN Alternate";
				font-size: 16px;
				font-style: normal;
				font-weight: 700;
				line-height: normal;
			}

			.icon {
				padding: 0;
				margin: 0 4px;
				width: 16px;
				height: 2px;
				flex-shrink: 0;
				border-radius: 2px;

				background: var(--Line);
			}
		}
	}
}
</style>
