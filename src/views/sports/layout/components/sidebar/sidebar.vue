<!-- 侧边栏 -->
<template>
	<div class="sidebar">
		<!-- 头部 -->
		<div class="header">
			<div class="left">
				<div class="icon"><svg-icon name="sports-tv_icon_on" width="23px" height="16px"></svg-icon></div>
			</div>
			<div class="center">
				<div class="icon" v-for="tool in computedTools" :key="tool.iconName">
					<svg-icon :name="tool.iconName" width="23px" height="16px"></svg-icon>
				</div>
			</div>
			<div class="right">
				<div class="icon2"><svg-icon name="sports-quanping" size="16px"></svg-icon></div>
				<div class="icon2"><svg-icon name="sports-shuaxin" size="16px"></svg-icon></div>
			</div>
		</div>

		<!-- 赛事数据 -->
		<div class="events-content">
			<div class="events-header">
				<div class="icon"><svg-icon :name="ballInfo[eventsInfo?.sportType]?.iconName" size="16px"></svg-icon></div>
				<div class="team-name">
					<span class="name">{{ eventsInfo?.teamInfo?.homeName }}</span>
					<span>VS</span>
					<span class="name">{{ eventsInfo?.teamInfo?.awayName }}</span>
				</div>
			</div>
			<div class="events-container">
				<!-- 动态记分板组件 -->
				<!-- <football /> -->
				<component :is="ballInfo[eventsInfo?.sportType]?.componentName" :eventsInfo="eventsInfo"></component>
			</div>
		</div>

		<!-- 盘口数据 与 热门推荐盘口 动态组件切换 -->
		<div class="markets-list"></div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
const SidebarStore = useSidebarStore();
const { eventsInfo } = storeToRefs(SidebarStore);
// console.log("eventsInfo", eventsInfo);

// 球类图标集合
const ballInfo: Record<number, { iconName: string; componentName: any }> = {
	1: {
		iconName: "sports-sidebar-football",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/football/football.vue")),
	},
	2: {
		iconName: "sports-sidebar-basketball",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/basketball/basketball.vue")),
	},
	3: {
		iconName: "sports-sidebar-americanSoccer",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/americanSoccer/americanSoccer.vue")),
	},
	4: {
		iconName: "sports-sidebar-iceHockey",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/iceHockey/iceHockey.vue")),
	},
	5: {
		iconName: "sports-sidebar-tennis",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/tennis/tennis.vue")),
	},
	6: {
		iconName: "sports-sidebar-volleyball",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/volleyball/volleyball.vue")),
	},
	7: {
		iconName: "sports-sidebar-billiards",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/billiards/billiards.vue")),
	},
	8: {
		iconName: "sports-sidebar-baseBall",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/baseball/baseball.vue")),
	},
	9: {
		iconName: "sports-sidebar-badminton",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/badminton/badminton.vue")),
	},
	43: {
		iconName: "sports-sidebar-eSports",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/eSports/eSports.vue")),
	},
};

/**
 * 工具tool
 */
const computedTools = computed(() => {
	return [
		//  比分板
		{
			iconName: "sports-score_icon",
			actions: () => handleActions(),
		},
		// 视频源
		{
			iconName: "sports-live_icon",
			actions: () => handleActions(),
		},
	];
});

const handleActions = () => {};
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
				line-height: 16px;
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
