<template>
	<div class="menu_row" :class="collapse ? 'collapse' : ''">
		<div>
			<div v-for="(item, index) in routerObj" :key="index">
				<div class="menu_item" :class="openMenuIndex == index ? 'activeMenu' : ''" @click="selectMenu(item, index)">
					<span class="menu_icon"><img v-lazy-load="item.icon" alt="" /></span>
					<span class="menu_name ellipsis">{{ item.directoryName }}</span>
					<span class="arrow" v-if="item.children && !collapse">
						<svg-icon name="arrow_up" v-if="openMenuIndex == index" height="8px" width="14px" />
						<svg-icon name="arrow_down" v-else height="8px" width="14px" />
					</span>
				</div>
				<transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
					<div v-show="openMenuIndex == index" class="subMenu">
						<div
							v-for="(subItem, subIndex) in item.children"
							:key="index"
							class="menu_item subItem"
							:class="openSubMenuIndex == index + ',' + subIndex ? 'activeMenu' : ''"
							@click="goToPath(subItem, index, subIndex)"
						>
							<span class="menu_icon">
								<img v-lazy-load="subItem.icon" alt="" />
							</span>
							<span class="menu_name ellipsis">{{ subItem.directoryName }}</span>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, h, Ref, onMounted, reactive, ref, watch, watchEffect, onUnmounted } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

import { useMenuStore } from "/@/stores/modules/menu";
const MenuStore = useMenuStore();
import useSvgHoverHooks from "/@/hooks/useSvgHover";
import Common from "/@/utils/common";
import { activityApi } from "/@/api/activity";
const { onMouseout, onMouseover, hoverItem } = useSvgHoverHooks();
const router = useRouter();
const route = useRoute();
const openMenuIndex: Ref<number | null | string> = ref(null);
const openSubMenuIndex: any = ref(null);
const currentRoute = ref({});
const activityList = ref([]);
//菜单从缓存中拉取
const routerObj: any = computed(() => {
	return MenuStore.getMenu;
});

const collapse = computed(() => {
	return MenuStore.getCollapse;
});

const activeMenu = computed(() => {
	const { path } = route;
	if (state.selectList.length == 0) {
		state.selectList = [path, router.resolve(route.fullPath).matched[route.matched.length - 2]?.path];
	}
	return path;
});

const goToPath = (subItem: Object, index: number, subIndex: number) => {
	openSubMenuIndex.value = index + "," + subIndex;
	// router.push("/sports");
};

onMounted(() => {
	getactivityList();
});
const getactivityList = () => {
	activityApi.activityPageList().then((res) => {
		activityList.value = res.data.records;
	});
};
const state = reactive({
	//选中的菜单数组
	selectList: [] as Array<string>,
	//展开的菜单
	openMenuList: [] as Array<string>,
});

const openMenu = (index: number) => {
	if (openMenuIndex.value === index) {
		openMenuIndex.value = null;
	} else {
		openMenuIndex.value = index;
	}
};

/**
 * PE:"跳转体育"
 * CA:"进入通用场馆"
 * LT:"进入gamePage页面"
 */
const selectMenu = (item: any, index: number) => {
	if (item.children) {
		currentRoute.value = item;
		openMenu(index);
	} else {
		if (item.modelCode == "PE") {
			router.push("/sports");
		} else if (item.modelCode == "LT") {
			Common.goToGame(item.gameInfo);
		} else {
			router.push({ path: "/game/venue", query: { gameOneId: item.gameOneClassId } });
		}
		openMenuIndex.value = index;
	}
};

// 动画
const beforeEnter = (el: any) => {
	el.style.maxHeight = "0";
	el.style.transition = "height 0.2s ease";
};

const enter = (el: any) => {
	const height = el.scrollHeight;
	el.style.maxHeight = `${height}px`;
};

const leave = (el: any) => {
	el.style.maxHeight = "0";
	el.style.transition = "height 0.2s ease";
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
			align-items: center;
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
</style>
