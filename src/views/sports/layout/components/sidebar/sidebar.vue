<!-- 侧边栏 -->
<template>
	<div class="sidebar" v-show="eventsInfo">
		<div class="affix">
			<!-- 头部 -->
			<div class="header">
				<div class="left">
					<Tv />
				</div>
				<div class="center">
					<Scoreboard isCurrent />
					<Live />
				</div>
				<div class="right">
					<Refresh @onChange="handleRefresh" />
				</div>
			</div>

			<!-- 赛事数据 -->
			<div class="events-content">
				<div class="events-header">
					<div class="icon"><svg-icon :name="ballInfo[Number(eventsInfo?.sportType)]?.iconName" size="16px"></svg-icon></div>
					<template v-if="eventsInfo">
						<div class="team-name">
							<span class="name">{{ eventsInfo?.teamInfo?.homeName }}</span>
							<span>VS</span>
							<span class="name">{{ eventsInfo?.teamInfo?.awayName }}</span>
						</div>
					</template>
				</div>
			</div>

			<!-- 计分板组件 -->
			<div v-if="eventsInfo && SidebarStore.sidebarStatus === 'scoreboard' && toolState.isOpen" class="events-container">
				<!-- 动态记分板组件 -->
				<!-- 已开赛的动态组件计分板 -->
				<component
					v-if="eventsInfo && SportsCommonFn.isStartMatch(eventsInfo.globalShowTime)"
					:is="ballInfo[Number(eventsInfo?.sportType)]?.componentName"
					:eventsInfo="eventsInfo"
				></component>
				<!-- 未开赛计分板显示 -->
				<NotStarted v-else :eventsInfo="eventsInfo" />
			</div>
			<!-- 直播 -->
			<div class="live-box" v-ok-loading="tvState.videoLoading" v-show="eventsInfo && SidebarStore.sidebarStatus === 'live' && toolState.isOpen">
				<VideoSource class="video-js" :source="SidebarStore.getLiveUrl" />
			</div>
		</div>

		<!-- 盘口数据 与 热门推荐盘口 动态组件切换 -->
		<div class="markets-list" v-ok-loading="refresh.loading">
			<!-- 盘口列表 -->
			<MarketsList v-show="!isShowHotEvents" />
			<!-- 热门赛事 -->
			<HotEvents v-show="isShowHotEvents" />
		</div>
	</div>
	<div class="sidebar no_data" v-show="!eventsInfo">
		<svg-icon name="no_data" width="142px" height="120px"></svg-icon>
	</div>
</template>

<script setup lang="tsx">
import { computed, defineAsyncComponent, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useUserStore } from "/@/stores/modules/user";
import videojs from "video.js";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
import useVideo from "/@/views/sports/components/VideoSource";
import "video.js/dist/video-js.css";
const { getSidebarEventSSEPush } = useToolsHooks();
const route = useRoute();
const UserStore = useUserStore();
const videoSrc = ref("");
const myPlayer = ref();
const videoContainer = ref();
const iframeLoaded = ref(false);
const SidebarStore = useSidebarStore();
const isShowHotEvents = computed(() => (route.meta.type === "detail" ? true : false));

// 刷新按钮数据
const refresh = reactive({
	rotation: 0, //旋转角度
	loading: false, //盘口数据loading状态
});

// 获取到的数据
const eventsInfo = computed(() => {
	const childrenViewData = viewSportPubSubEventData.getSportData("sidebarData");
	const promotionsViewData = viewSportPubSubEventData.sidebarData.promotionsViewData || [];

	if (route.meta.name === "champion" && promotionsViewData.length) {
		return promotionsViewData[0];
	}
	// 非冠军
	if (route.meta.name !== "champion" && childrenViewData?.length) {
		return childrenViewData[0]?.events[0];
	}

	if (promotionsViewData.length && isShowHotEvents.value) {
		return promotionsViewData[0];
	}
	return null;
});

const NotStarted = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/notStarted/notStarted.vue"));
// 热门赛事
const HotEvents = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/hotEvents/hotEvents.vue"));
// 盘口列表
const MarketsList = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/marketsList/marketsList.vue"));

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
 * @description: 刷新数据
 */
const handleRefresh = () => {
	//打开盘口数据loading状态
	refresh.loading = true;
	// 获取盘口数据
	getSidebarEventSSEPush();
	setTimeout(() => {
		refresh.loading = false;
	}, 1000);
};

const tvState = reactive({
	//当前状态是否打开
	isOpen: true,
	// 视频播放loading状态
	videoLoading: false,
	// 视频是否播放成功
	isSuccess: false,
});

// 工具栏按钮
const { Tv, Live, Scoreboard, Refresh, toolState } = useHeaderTools(eventsInfo);

const { VideoSource } = useVideo();
</script>

<style scoped lang="scss">
.no_data {
	display: flex;
	align-items: center;
	justify-content: center;
}

.sidebar {
	width: 100%;
	height: calc(100vh - 94px);
	display: flex;
	flex-direction: column;
	border-radius: 8px;
	overflow: hidden;

	.markets-list {
		flex: 1;
		overflow: hidden;
	}

	.live {
		height: 420px;
	}

	.eventVideo {
		width: 370px;
		height: 208px;
	}
	.live-box {
		position: relative;
		:deep(.request-failed-svg) {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 200px;
			height: 200px;
		}
	}
	:deep(.video-js) {
		height: 208px;
		width: 100%;

		.vjs-tech {
			width: 100%;
		}
	}

	.affix {
		position: sticky;
		top: 0px;
		background-color: var(--Bg-1);
		z-index: 1;

		.header {
			width: 100%;
			height: 34px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0px 14px;

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
				background-color: var(--Line-1);
				box-shadow: 0px 1px 0px 0px #343d48;
			}

			.events-header {
				width: 100%;
				height: 36px;
				display: flex;
				align-items: center;
				gap: 8px;
				padding: 5px 12px;
				.icon.is-active {
					svg {
						color: var(--Icon-1);
					}
				}
				.icon {
					width: 16px;
					height: 16px;

					svg {
						color: var(--Text-1);
					}
				}

				.team-name {
					display: flex;
					align-items: center;
					gap: 8px;
					color: var(--Text-1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					line-height: 16px;

					.name {
						max-width: 140px;
						white-space: nowrap;
						/* 禁止换行 */
						overflow: hidden;
						/* 超出部分隐藏 */
						text-overflow: ellipsis;
						/* 超出部分显示省略号 */
					}
				}
			}

			.events-container {
				width: 100%;
				height: 100%;
				.scoreboard-container .small .scoreboard-center .cell .label {
					overflow: hidden;
				}
			}

			.events-live {
				width: 100%;
				height: 100%;
			}
		}
	}
	:deep(.event-list) {
		&::-webkit-scrollbar-thumb {
			background-color: var(--Bg-3);
			border-radius: 6px;
		}
		&::-webkit-scrollbar {
			width: 6px;
		}
	}
}
</style>
