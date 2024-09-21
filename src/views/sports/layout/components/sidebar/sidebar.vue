<!-- 侧边栏 -->
<template>
	<div class="sidebar">
		<!-- 头部 -->
		<div class="header">
			<div class="left">
				<div class="icon"><svg-icon name="sports-tv_icon_on" width="23px" height="16px"></svg-icon></div>
			</div>
			<div class="center">
				<div class="icon" v-for="(tool, index) in computedTools" :key="tool.iconName" @click="handleClick(tool)">
					<svg-icon :name="getIconName(tool, index)" width="23px" height="16px"></svg-icon>
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
				<div class="icon"><svg-icon :name="ballInfo[Number(route.query.sportType)]?.iconName" size="16px"></svg-icon></div>
				<template v-if="Object.keys(eventsInfo).length !== 0">
					<div class="team-name">
						<span class="name">{{ eventsInfo?.teamInfo?.homeName }}</span>
						<span>VS</span>
						<span class="name">{{ eventsInfo?.teamInfo?.awayName }}</span>
					</div>
				</template>
			</div>

			<!-- 计分板组件 -->
			<div v-if="SidebarStore.sidebarStatus === 'scoreboard'" class="events-container">
				<!-- 动态记分板组件 -->
				<!-- 已开赛的动态组件计分板 -->
				<component v-if="SportsCommonFn.isStartMatch(eventsInfo.globalShowTime)" :is="ballInfo[Number(route.query.sportType)]?.componentName" :eventsInfo="eventsInfo"></component>
				<!-- 未开赛计分板显示 -->
				<NotStarted v-else :eventsInfo="eventsInfo" />
			</div>
			<!-- 直播 -->
			<div v-else-if="SidebarStore.sidebarStatus === 'live'" class="events-live">
				<VideoSource />
			</div>
		</div>

		<!-- 盘口数据 与 热门推荐盘口 动态组件切换 -->
		<div class="markets-list">
			<!-- 热门赛事 -->
			<HotEvents />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
const { toggleEventScoreboard, switchEventVideoSource } = useToolsHooks();
const route = useRoute();
const SidebarStore = useSidebarStore();
const { eventsInfo } = storeToRefs(SidebarStore);

// 未开赛
const NotStarted = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/notStarted/notStarted.vue"));
// 视频
const VideoSource = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/videoSource/videoSource.vue"));
// 热门赛事
const HotEvents = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/hotEvents/hotEvents.vue"));

onMounted(() => {
	console.log("route", route);
});

// 球类图标集合
const ballInfo: Record<number, { iconName: string; componentName: any }> = {
	// 足球
	1: {
		iconName: "sports-sidebar-football",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/football/football.vue")),
	},
	// 篮球
	2: {
		iconName: "sports-sidebar-basketball",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/basketball/basketball.vue")),
	},
	// 美式足球
	3: {
		iconName: "sports-sidebar-americanSoccer",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/americanSoccer/americanSoccer.vue")),
	},
	// 冰球
	4: {
		iconName: "sports-sidebar-iceHockey",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/iceHockey/iceHockey.vue")),
	},
	// 网球
	5: {
		iconName: "sports-sidebar-tennis",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/tennis/tennis.vue")),
	},
	// 排球
	6: {
		iconName: "sports-sidebar-volleyball",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/volleyball/volleyball.vue")),
	},
	// 斯诺克
	7: {
		iconName: "sports-sidebar-billiards",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/billiards/billiards.vue")),
	},
	// 棒球
	8: {
		iconName: "sports-sidebar-baseBall",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/baseball/baseball.vue")),
	},
	// 羽毛球
	9: {
		iconName: "sports-sidebar-badminton",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/badminton/badminton.vue")),
	},
	// 电子竞技
	43: {
		iconName: "sports-sidebar-eSports",
		componentName: defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/eSports/eSports.vue")),
	},
};

/**
 * 工具tool
 */
const computedTools = computed(() => {
	const baseTools = [];
	// 判断 是否在未开赛页面
	baseTools.push({
		iconName: "sports-score_icon",
		iconName_active: "sports-score_icon_active",
		tooltipText: "比分板",
		action: (event: any) => toggleEventScoreboard(event), // 闭包函数，事件绑定传递参数
		param: eventsInfo, // 传递参数
	});
	// 判断是否有视频源
	if (eventsInfo.value.streamingOption != 0 && eventsInfo.value.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			iconName_active: "sports-live_icon_active",
			tooltipText: "视频源",
			action: switchEventVideoSource,
			param: eventsInfo, // 传递参数
		});
	}
	return baseTools;
});

// 获取侧边栏图标
const getIconName = (tool: any, index: number) => {
	let activeIndex = -1;
	switch (SidebarStore.sidebarStatus) {
		case "scoreboard":
			activeIndex = 0;
			break;
		case "live":
			activeIndex = 1;
			break;
		// 你可以根据其他可能的状态扩展此逻辑
	}
	return index === activeIndex ? tool.iconName_active : tool.iconName;
};

// 点击对应工具
const handleClick = (tool: any) => {
	tool.action(tool.param);
};
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
		.left,
		.center,
		.right {
			flex: 1;
		}
		.center {
			display: flex;
			justify-content: center;
			gap: 24px;
		}
		.right {
			display: flex;
			justify-content: end;
			gap: 14px;
		}

		.icon {
			width: 24px;
			height: 16px;
			cursor: pointer;
		}
		.icon2 {
			width: 16px;
			height: 16px;
			cursor: pointer;
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
			width: 100%;
			height: 100%;
		}
		.events-live {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
