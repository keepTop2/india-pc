<template>
	<div class="league-info">
		<!-- 队伍信息 -->
		<div class="league-team-info">
			<!-- 主队 -->
			<div class="team">
				<div class="team-icon"><img class="icon" :src="teamData.teamInfo?.homeIconUrl" /></div>
				<div class="team-name" v-ok-tooltip>
					<span v-ok-tooltip>{{ teamData.teamInfo.homeName }}</span>
				</div>
				<!-- 得分 -->
				<div class="score">{{ teamData.gameInfo?.liveHomeScore }}</div>
			</div>
			<!-- 客队 -->
			<div class="team">
				<div class="team-icon"><img class="icon" :src="teamData.teamInfo?.awayIconUrl" /></div>
				<div class="team-name">
					<span v-ok-tooltip>{{ teamData.teamInfo.awayName }}</span>
				</div>
				<!-- 得分 -->
				<div class="score">{{ teamData.gameInfo?.liveAwayScore }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface teamDataType {
	/** 队伍数据 */
	teamData: any;
}

const props = withDefaults(defineProps<teamDataType>(), {
	teamData: () => {
		return {};
	},
});
</script>

<style scoped lang="scss">
.league-info {
	width: 284px;
	height: 100%;
	display: flex;
	align-items: center;
	padding: 8px;
	.league-team-info {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		gap: 4px;
		.team {
			display: flex;
			align-items: center;
			gap: 8px;
			.team-icon {
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
				.icon {
					width: 100%;
					height: 100%;
				}
			}
			.team-name {
				max-width: 200px;
				flex: 1;
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 12px;
				font-weight: 400;
				white-space: nowrap; /* 防止文本换行 */
				overflow: hidden; /* 超出部分隐藏 */
				text-overflow: ellipsis; /* 超出部分显示省略号 */
			}

			.score {
				min-width: 32px;
				height: 32px;
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
