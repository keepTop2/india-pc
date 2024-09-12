<!-- 侧边栏 -->
<template>
	<div class="sidebar">
		<!-- 头部 -->
		<div class="header">
			<div class="left">
				<div class="icon"><svg-icon name="sports-tv_icon_on" width="23px" height="16px"></svg-icon></div>
			</div>
			<div class="center">
				<div class="icon"><svg-icon name="sports-score_icon" width="23px" height="16px"></svg-icon></div>
				<div class="icon"><svg-icon name="sports-live_icon" width="23px" height="16px"></svg-icon></div>
			</div>
			<div class="right">
				<div class="icon2"><svg-icon name="sports-quanping" size="16px"></svg-icon></div>
				<div class="icon2"><svg-icon name="sports-shuaxin" size="16px"></svg-icon></div>
			</div>
		</div>

		<!-- 赛事数据 -->
		<div class="events-content">
			<div class="events-header">
				<div class="icon"><svg-icon name="sports-sidebar-football" size="16px"></svg-icon></div>
				<div class="team-name">
					<span class="name">李伟</span>
					<span>VS</span>
					<span class="name">王伟</span>
				</div>
			</div>
			<div class="events-container">
				<!-- 动态记分板组件 -->
				<football />
			</div>
		</div>

		<!-- 盘口数据 与 热门推荐盘口 动态组件切换 -->
		<div class="markets-list"></div>
	</div>
</template>

<script setup lang="ts">
import football from "./components/scoreboard/football/football.vue";
import basketball from "./components/scoreboard/basketball/basketball.vue";
import americanSoccer from "./components/scoreboard/americanSoccer/americanSoccer.vue";
import iceHockey from "./components/scoreboard/iceHockey/iceHockey.vue";
import tennis from "./components/scoreboard/tennis/tennis.vue";
import volleyball from "./components/scoreboard/volleyball/volleyball.vue";
import billiards from "./components/scoreboard/billiards/billiards.vue";
import baseBall from "./components/scoreboard/baseball/baseball.vue";
import badminton from "./components/scoreboard/badminton/badminton.vue";
import eSports from "./components/scoreboard/eSports/eSports.vue";
</script>

<style scoped lang="scss">
.sidebar {
	width: 100%;

	background-color: var(--Bg1);
	border-radius: 8px;
	.header {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 24px;
		.center {
			display: flex;
			gap: 24px;
		}
		.right {
			display: flex;
			gap: 14px;
		}

		.icon {
			width: 24px;
			height: 16px;
		}
		.icon2 {
			width: 16px;
			height: 16px;
		}
	}
	.events-content {
		position: relative;
		&::after {
			position: absolute;
			content: "";
			top: 0px;
			left: 0px;
			width: 100%;
			height: 1px;
			background-color: var(--Line_1);
			box-shadow: 0px 1px 0px 0px #343d48;
		}
		.events-header {
			width: 100%;
			height: 30px;
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 5px 12px;
			.icon {
				width: 16px;
				height: 16px;
			}
			.team-name {
				display: flex;
				align-items: center;
				gap: 8px;
				color: var(--Text1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				.name {
					max-width: 140px;
					white-space: nowrap; /* 禁止换行 */
					overflow: hidden; /* 超出部分隐藏 */
					text-overflow: ellipsis; /* 超出部分显示省略号 */
				}
			}
		}

		.events-container {
		}
	}
}
</style>
