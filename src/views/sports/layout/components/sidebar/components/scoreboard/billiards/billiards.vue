<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'">
			<div class="scoreboard-center">
				<template v-if="Object.keys(eventsInfo).length !== 0">
					<div class="scoreboard-header">{{ eventsInfo.leagueName }}</div>
					<div class="scoreboard-info">
						<div class="home-team-info">
							<div class="left">
								<div class="home-team-name">
									<span>{{ eventsInfo?.teamInfo?.homeName }}</span>
								</div>
							</div>
							<div class="home-team-icon"><img :src="eventsInfo?.teamInfo?.homeIconUrl" alt="" /></div>
						</div>
						<div class="score-info">
							<span>{{ eventsInfo.gameInfo?.liveHomeScore }}</span>
							<span>:</span>
							<span>{{ eventsInfo.gameInfo?.liveAwayScore }}</span>
						</div>
						<div class="away-team-info">
							<div class="away-team-icon"><img :src="eventsInfo?.teamInfo?.awayIconUrl" alt="" /></div>
							<div class="away-team-name">
								<span>{{ eventsInfo?.teamInfo?.awayName }}</span>
							</div>
						</div>
						<div class="events-status">{{ $t(`sports['比赛中']`) }}</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SportsRootObject } from "/@/views/sports/models/interface";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useRouter, useRoute } from "vue-router";
const { getEventsTitle } = SportsCommonFn;
const route = useRoute();

const props = withDefaults(
	defineProps<{
		size: "small" | "large";
		eventsInfo: SportsRootObject;
	}>(),
	{
		size: "small",
	}
);
</script>

<style scoped lang="scss">
.scoreboard-container {
	width: 100%;
	height: 208px;

	// 侧边栏小布局样式
	.small {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: url("/@/assets/zh-CN/sports/sidebar/billiards_s.png") center center / 100% 100% no-repeat;

		.scoreboard-center {
			position: relative;
			width: 354px;
			border-radius: 8px;
			background-color: var(--scoreboard_bg);
			overflow: hidden;
			.scoreboard-header {
				width: 100%;
				height: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--Bg-3);
				color: var(--Text-a);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.scoreboard-info {
				position: relative;
				width: 100%;
				height: 102px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0px 14px;
				.events-status {
					position: absolute;
					left: 50%;
					bottom: 8px;
					transform: translate(-50%, 0);
					color: var(--Text-s);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
				}
			}
			.score-info {
				width: 100px;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 10px;
				color: var(--Text-s);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 24px;
				font-weight: 600;
			}
			.home-team-info,
			.away-team-info {
				flex: 1;
				display: flex;
				align-items: center;
				gap: 8px;
				.home-team-icon,
				.away-team-icon {
					width: 30px;
					height: 30px;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.left {
					display: flex;
					justify-content: end;
				}
				.home-team-name,
				.away-team-name {
					flex: 1;
					color: var(--Text-a);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					display: -webkit-box; /* 必须结合以下两个属性来实现多行文本截断 */
					-webkit-box-orient: vertical; /* 设置为垂直排列 */
					-webkit-line-clamp: 2; /* 限制显示两行 */
					overflow: hidden; /* 超出部分隐藏 */
					text-overflow: ellipsis; /* 超出显示省略号 */
					white-space: normal; /* 允许换行 */
				}
			}
			.home-team-info {
				justify-content: end;
			}
		}
	}
}
</style>
