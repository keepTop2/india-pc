<!-- 侧边栏 -->
<template>
	<div class="sidebar" v-show="eventsInfo">
		<div class="affix">
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
					<div class="icon2" @click="showDetail()"><svg-icon name="sports-quanping" size="16px"></svg-icon></div>
					<!-- <div class="icon2"><svg-icon name="sports-shuaxin" size="16px"></svg-icon></div> -->
				</div>
			</div>

			<!-- 赛事数据 -->
			<div class="events-content">
				<div class="events-header">
					<div class="icon"><svg-icon :name="ballInfo[Number(route.query.sportType)]?.iconName" size="16px"></svg-icon></div>
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
			<div v-if="eventsInfo && SidebarStore.sidebarStatus === 'scoreboard'" class="events-container">
				<!-- 动态记分板组件 -->
				<!-- 已开赛的动态组件计分板 -->
				<component
					v-if="eventsInfo && SportsCommonFn.isStartMatch(eventsInfo.globalShowTime)"
					:is="ballInfo[Number(route.query.sportType)]?.componentName"
					:eventsInfo="eventsInfo"
				></component>
				<!-- 未开赛计分板显示 -->
				<NotStarted v-else :eventsInfo="eventsInfo" />
			</div>
			<!-- 直播 -->
			<!-- 虚拟赛事视频 -->
			<div v-show="SidebarStore.sidebarStatus === 'live'">
				<div ref="videoContainer" class="video-js"></div>
				<!-- 真人赛事比赛 -->
				<div v-show="iframeLoaded" class="live">
					<iframe
						class="eventVideo"
						@load="onIframeLoad"
						:src="videoSrc"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					>
					</iframe>
				</div>
			</div>
		</div>

		<!-- 盘口数据 与 热门推荐盘口 动态组件切换 -->
		<div class="markets-list">
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

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useLink } from "../../../hooks/useLink";
import { SportTypeEnum } from "../../../enum/sportEnum/sportEnum";
import { useUserStore } from "/@/stores/modules/user";
import SportsApi from "/@/api/sports/sports";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const { toggleEventScoreboard, switchEventVideoSource } = useToolsHooks();
const route = useRoute();
const { gotoEventDetail } = useLink();
const UserStore = useUserStore();
const videoSrc = ref("");
const myPlayer = ref();
const videoContainer = ref();
const iframeLoaded = ref(false);
const SidebarStore = useSidebarStore();
const isShowHotEvents = computed(() => route.meta.type === "list" ? false : true);

// 获取到的数据
const eventsInfo = computed(() => {
	const childrenViewData = viewSportPubSubEventData.getSportData("sidebarData");
	const promotionsViewData = viewSportPubSubEventData.sidebarData.promotionsViewData;

	if (childrenViewData && !isShowHotEvents.value) {
		return childrenViewData[0]?.events[0];
	}
	if (promotionsViewData && isShowHotEvents.value) {
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

onUnmounted(() => {
	if (myPlayer.value) {
		myPlayer.value.dispose();
	}
});

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
		param: eventsInfo.value, // 传递参数
	});
	// 判断是否有视频源
	if (eventsInfo.value && eventsInfo.value.streamingOption != 0 && eventsInfo.value.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			iconName_active: "sports-live_icon_active",
			tooltipText: "视频源",
			action: switchEventVideoSource,
			param: eventsInfo.value, // 传递参数
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

// 当iframe加载完成时，设置iframeLoaded为true
const onIframeLoad = () => {
	console.log("onIframeLoad", "加载完成");
	if (videoSrc.value) {
		iframeLoaded.value = true;
	}
};

const getLiveUrl = computed(() => {
	return SidebarStore.getLiveUrl;
});

watch(getLiveUrl, (newVal) => {
	if (Object.keys(newVal).length) {
		getStreaming(newVal);
	} else {
		iframeLoaded.value = false;
		videoSrc.value = "";
		if (myPlayer.value) {
			myPlayer.value.dispose();
			myPlayer.value = null;
		}
	}
});

const getStreaming = async (newVal: { [x: string]: any }) => {
	const lang = UserStore.getLang;
	const { streamingUrlH5, streamingUrlCN, streamingUrlNonCN } = newVal;

	if (videoSrc.value) {
		videoSrc.value = "";
		iframeLoaded.value = false;
	}

	if (streamingUrlH5) {
		videoSrc.value = streamingUrlH5;
	} else {
		const streamingUrl = lang === "zh-CN" ? streamingUrlCN : streamingUrlNonCN;

		// 清除旧的视频播放器
		if (myPlayer.value) {
			myPlayer.value.dispose();
		}

		// 创建新的video元素
		const videoElement = document.createElement("video");
		videoElement.className = "video-js";
		videoContainer.value.innerHTML = "";
		videoContainer.value.appendChild(videoElement);

		// 初始化新的视频播放器
		myPlayer.value = videojs(videoElement, {
			controls: false,
			autoplay: true,
			preload: "auto",
			sources: [
				{
					src: streamingUrl,
					type: "application/x-mpegURL",
				},
			],
		});
	}
	SidebarStore.getSidebarStatus("live");
};

// 点击对应工具
const handleClick = (tool: any) => {
	tool.action(tool.param);
};

/**
 * @description: 跳转到比赛详细
 */
const showDetail = () => {
	const params = {
		leagueId: eventsInfo.value?.leagueId,
		eventId: eventsInfo.value?.eventId,
		dataIndex: eventsInfo.value?.dataIndex,
	};
	toggleEventScoreboard(eventsInfo.value);

	gotoEventDetail(params, route.query.sportType as string);
};
</script>

<style scoped lang="scss">
.no_data{
	display: flex;
	align-items: center;
	justify-content: center;
}
.sidebar {
	width: 100%;
	height:750px;
	background-color: var(--Bg1);
	border-radius: 8px;
	.live {
		height: 420px;
	}
	.eventVideo {
		width: 390px;
		height: 208px;
	}
	:deep(.video-js) {
		height: 208px;
		width: 390px;
		.vjs-tech {
			width: 390px;
		}
	}
	.affix {
		position: sticky;
		top: 0px;
		background-color: var(--Bg1);
		z-index: 1;
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
}
</style>
