<template>
	<div class="detail-container">
		<div class="top">
			<div class="back" @click="handleGoBack">
				<svg-icon class="icon" name="arrow_left" size="13" />
				<span>返回</span>
			</div>
			<div class="title">{{ sportInfo.leagueName }}</div>
			<div class="handle">
				<div class="item curp" @click="toggleCollect">
					<span>{{ show ? "显示" : "隐藏" }}</span>
					<svg-icon :name="show ? 'eyes' : 'eyes_on'" size="16px"></svg-icon>
				</div>
				<Scoreboard />
				<Live />
				<svg-icon class="saveFollow" :name="isAttention ? 'sports-already_collected' : 'sports-collection'" @click="attentionEvent(true)" size="20" />
				<Refresh />
				<!-- <svg-icon name="sports-shuaxin" :class="{ cycling: loading }" size="20" @click="$emit('refresh')" /> -->
			</div>
		</div>
		<div class="content" :class="!show ? 'showContent' : 'hideContent'">
			<!-- <SportEventDetail :sportInfo="sportInfo" :size="'large'" /> -->
			<!-- 计分板组件 -->
			<div class="events-container">
				<!-- 动态记分板组件 -->
				<!-- 已开赛的动态组件计分板 -->
				<component
					v-if="sportInfo && SportsCommonFn.isStartMatch(sportInfo.globalShowTime)"
					:is="ballInfo[Number(route.query.sportType)]?.componentName"
					:eventsInfo="sportInfo"
				></component>
				<!-- 未开赛计分板显示 -->
				<NotStarted v-else :eventsInfo="sportInfo" />
			</div>
			<!-- 直播 -->
			<!-- <div v-else-if="SidebarStore.sidebarStatus === 'live'" class="events-live">
				<VideoSource />
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import SportsApi from "/@/api/sports/sports";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import PubSub from "/@/pubSub/pubSub";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
// import SportEventDetail from "/@/views/sports/layout/components/sportRight/components/sprotVideo/sportEventDetail.vue";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";

const SportAttentionStore = useSportAttentionStore();
const SportHotStore = useSportHotStore();
const SidebarStore = useSidebarStore();
const router = useRouter();
const route = useRoute();

const emits = defineEmits(["back", "isHidden", "isCollect", "refresh", "filter", "toggleAll"]);

// 未开赛
const NotStarted = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/scoreboard/notStarted/notStarted.vue"));
// 视频
const VideoSource = defineAsyncComponent(() => import("/@/views/sports/layout/components/sidebar/components/videoSource/videoSource.vue"));
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

interface CapotCardType {
	sportInfo: any;
	loading?: boolean;
}

const props = withDefaults(defineProps<CapotCardType>(), {
	sportInfo: () => ({}),
	loading: false,
});

const show = ref(false);

/**
 * @description 切换显示/隐藏比分栏
 */
const toggleCollect = () => {
	show.value = !show.value;
	emits("isCollect", show.value);
};

const isAttention = computed(() => SportAttentionStore.attentionEventIdList.includes(props.sportInfo.eventId));

/**
 * @description 处理关注/取消关注事件
 * @param {boolean} isActive - 是否为关注操作
 */
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await SportsApi.unFollow({
			thirdId: [props.sportInfo.eventId],
		});
	} else {
		await SportsApi.saveFollow({
			thirdId: props.sportInfo.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

/**
 * @description 处理返回操作
 */
const handleGoBack = () => {
	router.back();
	SportHotStore.updateToHotEvent();
};

// 工具栏按钮
const gameState = computed(() => props.sportInfo);
const { Live, Scoreboard, Refresh } = useHeaderTools(gameState);
</script>

<style lang="scss" scoped>
.detail-container {
	width: 100%;
	// margin-bottom: 20px;
	border-radius: 0 0 8px 8px;
	color: var(--Text1);

	.title {
		font-size: 16px;
		color: var(--Text_s);
	}

	.handle {
		display: flex;
		align-items: center;
		gap: 24px;

		.item {
			display: flex;
			align-items: center;
			font-size: 14px;
			gap: 8px;
			color: var(--Text1);
			cursor: pointer;
		}

		.saveFollow {
			color: var(--Warn);
		}
	}

	:deep(.scoreboard-container) {
		height: 276px !important;
		.scoreboard {
			padding: 0 75px;
		}

		.scoreboard-center {
			height: 166px;
			width: 100% !important;
			.row {
				height: 65px !important;
			}
			.header,
			.row {
				padding: 0 24px !important;
				.value {
					min-width: 300px !important;
				}
			}
		}
	}
}

.top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 12px 0 6px;
	height: 52px;
	background-color: var(--Bg1);
	border-radius: 8px 8px 0 0;
	margin-top: 5px;
	.back {
		display: flex;
		align-items: center;
		cursor: pointer;

		.icon {
			margin-right: 4px;
		}
	}
}

.content {
	// width: 100%;
	// flex: 1;
	// height: 276px;
	// position: relative;
	// display: flex;
	// align-items: center;
	// justify-content: center;
	// transition: all 0.3s linear;
	// overflow: hidden;
	// z-index: 1;
	width: 100%;
	:deep(.scoreboard-container) {
		height: 276px !important;
		& > div:nth-child(2) {
			display: none;
		}
		.scoreboard-center {
			width: 100%;
			// width: 892px !important;
		}
		.scoreboard-info {
			height: 130px !important;
			.home-team-name,
			.away-team-name {
				max-width: 100% !important;
			}
		}
	}

	> .main {
		// width: 892px;
	}

	&.showContent {
		height: 276px;
	}

	&.hideContent {
		height: 0;
		opacity: 0;
	}
}
</style>
