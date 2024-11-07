<template>
	<div class="menu_row" :class="collapse ? 'collapse' : ''">
		<div>
			<div>
				<div class="menu_item" :class="openMenuIndex == 'activity' ? 'activeMenu' : ''" @click="router.push('/activity')">
					<span class="menu_icon"><svg-icon name="activity_icon" size="17px"></svg-icon></span>
					<span class="menu_name ellipsis">优惠活动</span>
				</div>
			</div>
			<div v-for="(item, index) in routerObj" :key="index">
				<div class="menu_item" :class="openMenuIndex == index ? 'activeMenu' : ''" @click="selectMenu(item, index)">
					<span class="menu_icon"><img v-lazy-load="item.iconFileUrl" alt="" /></span>
					<span class="menu_name ellipsis">{{ item.directoryName }}</span>
					<span class="arrow" v-if="item.twoList?.length && !collapse">
						<svg-icon name="arrow_up" v-if="openMenuIndex == index" height="8px" width="14px" />
						<svg-icon name="arrow_down" v-else height="8px" width="14px" />
					</span>
				</div>
				<transition name="drawer-expand" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
					<div v-show="openMenuIndex == index" class="subMenu">
						<div
							v-for="(subItem, subIndex) in item.twoList"
							:key="subIndex"
							class="menu_item subItem"
							:class="openSubMenuIndex == index + ',' + subIndex ? 'activeMenu' : ''"
							@click="goToPath(item, subItem, index, subIndex)"
						>
							<span class="menu_icon">
								<img v-lazy-load="subItem.iconFileUrl" alt="" />
							</span>
							<span class="menu_name ellipsis">{{ subItem.name }}</span>
						</div>
					</div>
				</transition>
			</div>
			<div>
				<div class="menu_item" :class="openMenuIndex == 'helpCenter' ? 'activeMenu' : ''" @click="router.push('/helpCenter')">
					<span class="menu_icon"><svg-icon name="help_icon" size="17px"></svg-icon></span>
					<span class="menu_name ellipsis">帮助中心</span>
				</div>
				<div class="menu_item" @click="Common.getSiteCustomerChannel">
					<span class="menu_icon"><svg-icon name="kefu" size="17px"></svg-icon></span>
					<span class="menu_name ellipsis">线上客服</span>
				</div>
				<div class="menu_item" @click="router.push('/helpCenter')">
					<span class="menu_icon"><svg-icon name="join_us" size="17px"></svg-icon></span>
					<span class="menu_name ellipsis">加入我们</span>
				</div>
				<div class="menu_item" @click="useModalStore().openModal('setLang')">
					<span class="menu_icon"><img :src="LangIcon" alt="" class="langIcon" /></span>
					<span class="menu_name ellipsis">语言切换</span>
					<span class="arrow">
						<svg-icon name="arrow_right" height="8px" width="14px" />
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, h, Ref, onMounted, reactive, ref, watch, watchEffect, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

import { useMenuStore } from "/@/stores/modules/menu";
const MenuStore = useMenuStore();
import Common from "/@/utils/common";
import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import pubsub from "/@/pubSub/pubSub";
const router = useRouter();
const route = useRoute();
const openMenuIndex: Ref<number | string | null> = ref(null);
const openSubMenuIndex: any = ref(null);
const UserStore = useUserStore();
//菜单从缓存中拉取
const routerObj: any = computed(() => {
	return MenuStore.getMenu;
});
const LangIcon = computed(() => {
	return UserStore.getLangList.find((item: any) => item.code == UserStore.getLang)?.iconFileUrl;
});

const collapse = computed(() => {
	return MenuStore.getCollapse;
});

watch(
	() => [route.query.gameTwoId, route.query.gameOneId, routerObj.value, route.name],
	() => {
		setOpenMenu();
	}
);
const setOpenMenu = () => {
	// 活动高亮
	if (route.name === "activity") return (openMenuIndex.value = "activity");
	if (route.name === "helpCenter") return (openMenuIndex.value = "helpCenter");
	// 体育高亮
	if (route.fullPath.indexOf("/sports") !== -1) return (openMenuIndex.value = routerObj.value.findIndex((item: any) => item.modelCode == "SBA"));
	// 其他二级菜单
	openMenuIndex.value = routerObj.value.findIndex((item: any) => item.gameOneClassId == route.query.gameOneId);
	if (openMenuIndex.value !== -1) {
		openSubMenuIndex.value = openMenuIndex.value + "," + routerObj.value[openMenuIndex.value as number]?.twoList?.findIndex((item: any) => item.id == route.query.gameTwoId);
	}
};
const goToPath = (item: any, subItem: any, index: number, subIndex: number) => {
	openSubMenuIndex.value = index + "," + subIndex;
	router.push({ path: "/game/venue", query: { gameOneId: item.gameOneClassId, gameTwoId: subItem.id } });
};

onMounted(() => {
	setOpenMenu();
});

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
		if (item.modelCode == "SBA") {
			openMenuIndex.value = index;
			router.push("/sports");
		} else if (item.modelCode == "SIGN_VENUE") {
			console.log(item);

			Common.goToGame(item);
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
		height: 40px;
		margin: 4px 0;
		padding: 0 20px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		overflow: hidden;
		flex-wrap: wrap;
		font-size: 14px;
		border-radius: 4px;
		color: var(--Text_a);
		background: var(--Bg3);
		border-bottom: 2px solid rgba(#9fa5ac, $alpha: 0.1);
		z-index: 10;
		line-height: 40px;
		background-size: 100% 100%;
		.menu_icon {
			display: flex;
			align-items: center;
		}
		.langIcon {
			border-radius: 50%;
		}
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
		color: var(--Text_a);
		background: linear-gradient(to top, rgba(255, 40, 75, 0.3), rgba(255, 40, 75, 0.05));
		border-bottom: 2px solid var(--Theme);
		.menu_name {
			color: var(--Text_a);
		}
	}
	.subItem.menu_item.activeMenu,
	.subItem.menu_item:hover {
		background: linear-gradient(to top, rgba(255, 40, 75, 0.2), rgba(255, 40, 75, 0.05));
		border-bottom: 2px solid rgba(#ff284b, 0.5);
		.menu_name {
			color: var(--Text1);
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
			width: 40px;
			height: 100%;
			text-align: center;
			display: flex;
			img {
				margin: 13px auto;
			}
			svg {
				margin: 13px auto;
			}
		}
		.menu_item.activeMenu,
		.menu_item:hover {
			color: var(--Text_a);
			background: linear-gradient(to top, rgba(255, 40, 75, 0.3), rgba(255, 40, 75, 0.05));
			border-bottom: 2px solid var(--Theme);
			.menu_name {
				color: var(--Text_a);
			}
		}
		.subItem.menu_item.activeMenu,
		.subItem.menu_item:hover {
			background: linear-gradient(to top, rgba(255, 40, 75, 0.2), rgba(255, 40, 75, 0.05));
			border-bottom: 2px solid rgba(#ff284b, 0.5);
			.menu_name {
				color: var(--Text1);
			}
		}
	}
}
.subMenu {
	transition: max-height 0.2s ease;
}
.arrow {
	width: 20px;
	height: 20px;
	background-color: var(--Line_2);
	padding: 2px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
}
</style>
