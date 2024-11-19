<template>
	<div class="header-container" :class="[route.meta.type, route.meta.name]">
		<div class="menu-nav">
			<div class="right" ref="rightContainer">
				<!-- 左侧滚动箭头，只有在有滚动时才显示 -->
				<div class="arrow_content common-arrow_left" v-show="showLeftArrow" @click="scrollLeft">
					<span class="icon">
						<svg-icon name="common-arrow_left" size="12px"></svg-icon>
					</span>
				</div>
				<!-- 导航项容器，支持水平滚动 -->
				<div class="nva-item-container" ref="nvaItemContainer" @scroll="handleScroll">
					<!-- 遍历体育数据，动态生成导航项 -->
					<div v-for="(item, index) in sportsData" :key="item.sportType" class="nva-item" :class="{ active: Number(sportType) == item.sportType }" @click="toPath(item)">
						<svg-icon class="icon" :name="`sports-sidebar-${item.icon}`" size="25px" alt="" />
						<span class="value title">{{ item.sportName }}</span>
						<div class="value count">{{ item.count }}</div>
					</div>
				</div>
				<!-- 右侧滚动箭头，只有在有滚动时才显示 -->
				<div class="arrow_content common-arrow_right" v-show="showRightArrow" @click="scrollRight">
					<span class="icon">
						<svg-icon name="sports-arrow" size="12px"></svg-icon>
					</span>
				</div>
			</div>
			<!-- <i class="line"></i> -->
			<!-- 右侧菜单项 -->
			<div class="left">
				<div v-for="(item, index) in Menu" @click="handleRightMenuClick(item.name)" :key="index" class="nva-item" :class="{ active: item.name === route.name }">
					<svg-icon class="icon" :name="`sports-${item.icon}`" size="25px" alt="" />
					<span class="value">{{ item.meta.title }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue"; // 引入Vue相关的API
import { useRouter, useRoute } from "vue-router"; // 引入路由相关的API
import MajorCategoriesMenu from "/@/router/modules/sports/sportsRouterLeft"; // 导入左侧菜单数据
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData"; // 导入体育数据
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData"; // 引入状态管理
import SportsCommonFn from "/@/views/sports/utils/common";
import pubSub from "/@/pubSub/pubSub";
const router = useRouter(); // 获取路由实例
const route = useRoute(); // 获取当前路由实例
const Menu = ref(MajorCategoriesMenu); // 将左侧菜单数据存储为响应式引用
const sportsBetEvent = useSportsBetEventStore(); // 获取体育赛事相关的状态
const sportType = computed(() => route.query.sportType); // 计算当前的运动类型
const props = defineProps<{
	tabActive: string; // 当前激活的标签
}>();

// 获取球类tab数据
const sportsData = computed(() => {
	return viewSportPubSubEventData.viewSportData.sports.filter((item: any) => item.count > 0);
});

const rightContainer = ref<HTMLElement | null>(null); // 右侧容器的引用
const nvaItemContainer = ref<HTMLElement | null>(null); // 导航项容器的引用
const showLeftArrow = ref(false); // 控制左箭头显示的状态
const showRightArrow = ref(false); // 控制右箭头显示的状态

// 初始化路由的逻辑
const initRoute = () => {
	// 确保有体育数据
	const { sportType } = route.query;
	if (!sportType || route.name === "eventDetail") return;
	if (sportsData.value.length > 0) {
		const hasType = sportsData.value.some((item) => item.sportType === Number(sportType));
		if (!hasType) {
			const firstSportType = sportsData.value[0].sportType; // 获取第一个体育类型
			router.push({ path: router.currentRoute.value.path, query: { ...route.query, sportType: firstSportType } });
		}
	}
};

// 标签数据
const tabData = ref([
	{ label: "今日", type: "todayContest", path: "/sports/todayContest" },
	{ label: "早盘", type: "morningTrading", path: "/sports/morningTrading" },
	{ label: "冠军", type: "champion", path: "/sports/champion" },
]);

// 路由跳转函数
const toPath = SportsCommonFn.throttle((item: any) => {
	// 记录滚动元素节点scrollTop
	SportsCommonFn.saveScrollTop(route);
	if (route.meta.type !== "list") {
		pubSub.publish("SkeletonLoading", true);
		// 检查路由类型
		// 根据当前激活的标签获取路径
		const path = tabData.value.find((tab) => tab.type === props.tabActive)?.path || "/sports/todayContest";
		router
			.push({
				path: path,
				query: { sportType: item.sportType }, // 传递运动类型作为查询参数
			})
			.catch((err) => {
				console.error("导航失败:", err); // 错误处理
			});
	} else {
		if (route.query.sportType == item.sportType) return; // 如果当前运动类型相同，不做跳转
		pubSub.publish("SkeletonLoading", true);
		const currentPath = router.currentRoute.value.path; // 获取当前路径

		router.push({
			path: currentPath,
			query: { sportType: item.sportType }, // 更新查询参数
		});
	}
}, 1000);

// 处理滚动事件
const handleScroll = () => {
	if (nvaItemContainer.value) {
		// 确保导航项容器存在
		const { scrollLeft, scrollWidth, clientWidth } = nvaItemContainer.value; // 获取滚动信息
		showLeftArrow.value = scrollLeft > 0; // 控制左箭头的显示
		showRightArrow.value = scrollLeft + clientWidth < scrollWidth; // 控制右箭头的显示
	}
};

// 向左滚动函数
const scrollLeft = () => {
	if (nvaItemContainer.value) {
		// 确保导航项容器存在
		nvaItemContainer.value.scrollLeft -= 100; // 向左滚动100像素
	}
};

// 向右滚动函数
const scrollRight = () => {
	if (nvaItemContainer.value) {
		// 确保导航项容器存在
		nvaItemContainer.value.scrollLeft += 100; // 向右滚动100像素
	}
};

const handleRightMenuClick = (name: string) => {
	SportsCommonFn.saveScrollTop(route);

	router.push({ name });
};

// 组件挂载后初始化路由和事件监听
onMounted(() => {
	nextTick(() => {
		handleScroll(); // 初始处理滚动状态
		window.addEventListener("resize", handleScroll); // 窗口尺寸变化时重新处理滚动状态
	});
});

// 观察体育数据的变化
watch(sportsData, () => {
	initRoute(); // 初始化路由
	nextTick(() => {
		handleScroll(); // 数据变化后处理滚动状态
	});
});
</script>

<style scoped lang="scss">
.header-container {
	position: relative;
	width: 100%;
	height: 66px;
	display: flex;
	align-items: center;
	border-radius: 8px;
	background: var(--Bg-1);
	overflow: hidden;
	box-sizing: border-box;
	&.list {
		border-radius: 0px 0px 8px 8px;
	}
	&.result {
		border-radius: 8px 8px 0px 0px;
		// margin-bottom: 1px;
		border-bottom: 1px solid var(--Line-1);
	}
	&.morningTrading {
		border-radius: 0;
	}
	.arrow_content {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--Butter);
		cursor: pointer;
		border-radius: 4px;
		z-index: 1;
		box-shadow: 0 0 5px 5px var(--popoverShadow);
		&.common-arrow_left {
			left: 4px;
		}
		&.common-arrow_right {
			right: 6px;
		}
		.icon {
			color: var(--Icon-1);
		}
	}

	.menu-nav {
		height: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		overflow: hidden;
		box-sizing: border-box;

		.line {
			width: 1px;
			height: 34px;
			margin: 0 4px;
			background: var(--Line-1);
			box-shadow: 1px 0 0 0 #343d48;
		}

		.left,
		.right {
			display: flex;
			position: relative;
		}

		.right {
			width: 100%;
			// padding-right: 12px;
			overflow: hidden;
			position: relative;
			padding-right: 6px;
			&::after {
				content: "";
				position: absolute;
				right: 1px;
				height: calc(100% - 16px);
				top: 8px;
				width: 1px;
				background-color: var(--Line-1);
				box-shadow: 1px 0px 0px 0px var(--lineBg);
			}

			.nva-item-container {
				display: flex;
				gap: 8px;
				overflow-x: auto;
				scrollbar-width: none;
				// padding:0 18px;
				-ms-overflow-style: none;
				&::-webkit-scrollbar {
					display: none;
				}
			}
		}

		.nva-item {
			width: 82px;
			height: 67px;
			display: flex;
			align-items: center;
			justify-content: center;
			// padding: 0px 12px;
			// background: var(--Butter);
			border-radius: 4px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			box-sizing: border-box;
			cursor: pointer;
			flex-shrink: 0;
			gap: 4px;
			flex-direction: column;
			position: relative;
			.icon {
				width: 16px;
				height: 16px;
				color: var(--Icon-1);
			}

			a {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				gap: 4px;
			}
			.value {
				color: var(--Text-1, #98a7b5);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.title {
				//超出省略号
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.count {
				position: absolute;
				right: 0;
				top: 10px;
				font-size: 12px;
			}
		}

		.active {
			// background-color: var(--Theme);
			.value {
				color: var(--Theme);
			}
			.icon {
				color: var(--Theme);
			}
		}

		.left {
			gap: 4px;
			.nva-item {
				width: 68px;
			}
		}
	}
}
</style>
