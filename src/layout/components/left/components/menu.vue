<template>
	<div class="menu_row" :class="collapse ? 'collapse' : ''">
		<div>
			<div v-for="(item, index) in routerObj" :key="index">
				<div class="menu_item" :class="openMenuIndex == index ? 'activeMenu' : ''" @click="selectMenu(item, index)">
					<span class="menu_icon"><img v-lazy-load="item.icon" alt="" /></span>
					<span class="menu_name ellipsis">{{ item.directoryName }}</span>
					<span class="arrow" v-if="item.twoList && !collapse">
						<svg-icon name="arrow_up" v-if="openMenuIndex == index" height="8px" width="14px" />
						<svg-icon name="arrow_down" v-else height="8px" width="14px" />
					</span>
				</div>
				<transition name="drawer-expand" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
					<div v-show="openMenuIndex == index" class="subMenu">
						<div
							v-for="(subItem, subIndex) in item.twoList"
							:key="index"
							class="menu_item subItem"
							:class="openSubMenuIndex == index + ',' + subIndex ? 'activeMenu' : ''"
							@click="goToPath(item, subItem, index, subIndex)"
						>
							<span class="menu_icon">
								<img v-lazy-load="subItem.icon" alt="" />
							</span>
							<span class="menu_name ellipsis">{{ subItem.name }}</span>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, h, Ref, onMounted, reactive, ref, watch, watchEffect, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

import { useMenuStore } from "/@/stores/modules/menu";
const MenuStore = useMenuStore();
import useSvgHoverHooks from "/@/hooks/useSvgHover";
import Common from "/@/utils/common";
import { activityApi } from "/@/api/activity";
const { onMouseout, onMouseover, hoverItem } = useSvgHoverHooks();
const router = useRouter();
const route = useRoute();
const openMenuIndex: Ref<number | null> = ref(null);
const openSubMenuIndex: any = ref(null);
const activityList = ref([]);
//菜单从缓存中拉取
const routerObj: any = computed(() => {
	return MenuStore.getMenu;
});

const collapse = computed(() => {
	return MenuStore.getCollapse;
});

watch(
	() => [route.query.gameTwoId, route.query.gameOneId, routerObj.value],
	() => {
		setOpenMenu();
	}
);
const setOpenMenu = () => {
	openMenuIndex.value = routerObj.value.findIndex((item: any) => item.gameOneClassId == route.query.gameOneId);
	if (openMenuIndex.value) {
		console.log(routerObj.value);

		openSubMenuIndex.value = openMenuIndex.value + "," + routerObj.value[openMenuIndex.value]?.twoList?.findIndex((item: any) => item.id == route.query.gameTwoId);
	}
};
const goToPath = (item: any, subItem: any, index: number, subIndex: number) => {
	openSubMenuIndex.value = index + "," + subIndex;
	router.push({ path: "/game/venue", query: { gameOneId: item.gameOneClassId, gameTwoId: subItem.id } });
};

onMounted(() => {
	setOpenMenu();
	getactivityList();
});
const getactivityList = () => {
	activityApi.activityPageList().then((res) => {
		activityList.value = res.data.records;
	});
};

/**
 * PE:"跳转体育"
 * CA:"进入通用场馆"
 * LT:"进入gamePage页面"
 */
const selectMenu = (item: any, index: number) => {
	// 如果一级分类是选中状态，
	if (openMenuIndex.value === index) {
		// 取消选中状态，
		openMenuIndex.value = null;
		// 取消二级分类选中状态，
		openSubMenuIndex.value = null;
		// 场馆内回到默认全部，
		router.push({ path: "/game/venue", query: { gameOneId: item.gameOneClassId, gameTwoId: 0 } });
		return;
		// 如果不是选中状态，判断
	} else if (item.twoList) {
		openMenuIndex.value = index;
		router.push({ path: "/game/venue", query: { gameOneId: item.gameOneClassId, gameTwoId: 0 } });
	} else {
		if (item.modelCode == "PE") {
			router.push("/sports");
		} else if (item.modelCode == "LT") {
			Common.goToGame(item.gameInfo);
		} else {
			router.push({ path: "/game/venue", query: { gameOneId: item.gameOneClassId, gameTwoId: 0 } });
		}
		openMenuIndex.value = index;
	}
};

// 动画
// 在进入动画之前，手动设置 max-height 为内容高度
// 动态计算高度的钩子函数，使用 Element 作为类型
const beforeEnter = (el: Element) => {
	const element = el as HTMLElement;
	element.style.maxHeight = "0";
};

const enter = (el: Element) => {
	const element = el as HTMLElement;
	nextTick(() => {
		element.style.maxHeight = element.scrollHeight + 20 + "px"; // 动态计算内容高度
	});
};

const beforeLeave = (el: Element) => {
	const element = el as HTMLElement;
	element.style.maxHeight = element.scrollHeight + 20 + "px"; // 在隐藏时，先将高度设置为当前高度
};

const leave = (el: Element) => {
	const element = el as HTMLElement;
	nextTick(() => {
		element.style.maxHeight = "0"; // 收起时设置 max-height 为 0
	});
};
</script>

<style lang="scss" scoped>
.menu_row {
	.menu_item {
		height: 46px;
		margin: 4px 0;
		padding: 0 20px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		overflow: hidden;
		flex-wrap: wrap;
		font-size: 14px;
		border-radius: 4px;
		background: var(--Bg2);
		color: var(--Text1);
		z-index: 10;
		line-height: 46px;

		.menu_name {
			flex: 4;
			overflow: hidden;
			padding: 0 16px;
			box-sizing: border-box;
			text-align: left;
		}
		img {
			width: 17px;
			height: 17px;
		}
	}
	.menu_item.activeMenu,
	.menu_item:hover {
		background: linear-gradient(0, rgba(255, 40, 75, 0.8) 0%, rgba(255, 40, 75, 0.1) 100%);
		color: var(--Text_a);
		.menu_name {
			color: var(--Text_a);
		}
	}

	.subItem {
		background: var(--Bg4);
		color: var(--Text1);
		z-index: 5;
	}
	&.collapse {
		width: 64px;

		.menu_item,
		.subItem {
			background: none;
			width: 46px;
			margin: 0 auto;
			padding: 0;
			justify-content: center;
		}
		.menu_icon {
			width: 46px;
			height: 100%;
			text-align: center;
			img {
				margin: 13px auto;
			}
		}
		.menu_item.activeMenu,
		.menu_item:hover {
			background: linear-gradient(0, rgba(255, 40, 75, 0.8) 0%, rgba(255, 40, 75, 0.1) 100%);
			color: var(--Text_a);
			.menu_name {
				color: var(--Text_a);
			}
		}
	}
}
.subMenu {
	transition: max-height 0.2s ease;
}
</style>
