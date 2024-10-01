<template>
	<div class="header-container" :class="route.meta.type">
		<div class="menu-nav">
			<div class="right" ref="rightContainer">
				<div class="arrow_content arrow_left" v-show="showLeftArrow" @click="scrollLeft">
					<span class="icon">
						<svg-icon name="arrow_left" size="12px"></svg-icon>
					</span>
				</div>
				<div class="nva-item-container" ref="nvaItemContainer" @scroll="handleScroll">
					<div v-for="(item, index) in sportsData" :key="index" class="nva-item" :class="{ active: Number(sportType) == item.sportType }" @click="toPath(item)">
						<svg-icon class="icon" :name="`sports-sidebar-${item.icon}`" size="25px" alt="" />
						<span class="value title">{{ item.sportName }}</span>
						<div class="value count">{{ item.count }}</div>
					</div>
				</div>
				<div class="arrow_content arrow_right" v-show="showRightArrow" @click="scrollRight">
					<span class="icon">
						<svg-icon name="sports-arrow" size="12px"></svg-icon>
					</span>
				</div>
			</div>
			<i class="line"></i>
			<div class="left">
				<div v-for="(item, index) in Menu" :key="index" class="nva-item" :class="{ active: item.name === route.name }">
					<router-link :to="{ name: item.name }">
						<svg-icon class="icon" :name="`sports-${item.icon}`" size="25px" alt="" />
						<span class="value">{{ item.meta.title }}</span>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import MajorCategoriesMenu from "/@/router/modules/sports/sportsRouterLeft";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

const router = useRouter();
const route = useRoute();
const Menu = ref(MajorCategoriesMenu);
const sportsBetEvent = useSportsBetEventStore();
const sportType = computed(() => route.query.sportType);

// 球类tab数据
const sportsData = computed(() => viewSportPubSubEventData.viewSportData.sports);

const rightContainer = ref<HTMLElement | null>(null);
const nvaItemContainer = ref<HTMLElement | null>(null);
const showLeftArrow = ref(false);
const showRightArrow = ref(false);

// 路由初始化逻辑
const initRoute = () => {
	if (sportsData.value.length > 0) {
		const firstSportType = sportsData.value[0].sportType;
		const defaultPath = `${router.currentRoute.value.path}/${firstSportType}`;
		router.push(defaultPath);
	}
};

const toPath = (item: any) => {
	if (route.meta.type !== "list") {
		router
			.push({
				path: "/sports/todayContest/rollingBall",
				query: { sportType: item.sportType },
			})
			.catch((err) => {
				console.error("Navigation failed:", err);
			});
	} else {
		if (route.query.sportType == item.sportType) return;
		const currentPath = router.currentRoute.value.path;
		router.push({
			path: currentPath,
			query: { sportType: item.sportType },
		});
	}
};

const handleScroll = () => {
	console.log(nvaItemContainer.value);
	console.log(rightContainer.value);
	if (nvaItemContainer.value) {
		const { scrollLeft, scrollWidth, clientWidth } = nvaItemContainer.value;
		showLeftArrow.value = scrollLeft > 0;
		showRightArrow.value = scrollLeft + clientWidth < scrollWidth;
		console.log(scrollLeft, scrollWidth, clientWidth);
	}
};

const scrollLeft = () => {
	if (nvaItemContainer.value) {
		nvaItemContainer.value.scrollLeft -= 100;
	}
};

const scrollRight = () => {
	if (nvaItemContainer.value) {
		nvaItemContainer.value.scrollLeft += 100;
	}
};

onMounted(() => {
	initRoute();
	nextTick(() => {
		handleScroll();
		window.addEventListener('resize', handleScroll);
	});
});

watch(sportsData, () => {
	nextTick(() => {
		handleScroll();
	});
});
</script>

<style scoped lang="scss">
.header-container {
	position: relative;
	width: 100%;
	height: 67px;
	display: flex;
	align-items: center;
	border-radius: 8px;
	background: var(--Bg1);
	overflow: hidden;
	box-sizing: border-box;
	&.list, &.result {
		border-radius: 0px 0px 8px 8px;
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
		background-color: var(--butter);
		cursor: pointer;
		z-index: 1;
		&.arrow_left {
			left: 4px;
		}
		&.arrow_right {
			right: 0;
		}
		.icon {
			color: var(--Icon_1);
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
			background: var(--Line_1);
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
			// background: var(--butter);
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
				color: var(--Icon_1);
			}

			a {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				gap:4px;
			}
			.value {
				color: var(--Text1, #98a7b5);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;

			}
			.title{
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
			.nva-item{
				width: 68px;
			}
		}
	}
}
</style>
