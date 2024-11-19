<template>
	<div class="menu_row" :class="collapse ? 'collapse' : ''">
		<div class="menu_item" v-if="ActivitySwitch?.includes('DAILY_COMPETITION')" @click="emit('showDAILY_COMPETITION')">
			<span class="menu_icon"><svg-icon name="common-DAILY_COMPETITION" size="20px"></svg-icon></span>
			<span class="menu_name ellipsis">每日竞赛</span>
		</div>

		<div v-for="(item, index) in routerObj" :key="index">
			<div class="menu_item" :class="openMenuIndex == index ? 'activeMenu' : ''" @click="selectMenu(item, index)" v-hover="{ message: item.directoryName }">
				<span class="menu_icon"><img v-lazy-load="item.iconFileUrl" alt="" /></span>
				<span class="menu_name ellipsis">{{ item.directoryName }}</span>
				<span class="arrow" v-if="item.twoList?.length && !collapse" @click.stop="selectMenu(item, index, true)">
					<svg-icon name="common-arrow_up" v-if="openMenuIndex == index" height="6px" width="10.5px" />
					<svg-icon name="common-arrow_down" v-else height="6px" width="10.5px" />
				</span>
			</div>

			<div class="subMenu" :class="openMenuIndex == index ? 'opensubMenu' : ''" :style="{ height: openMenuIndex == index ? item.twoList?.length * 46 + 'px' : '' }">
				<div
					v-for="(subItem, subIndex) in item.twoList"
					:key="subIndex"
					class="subItem"
					:class="openSubMenuIndex == index + ',' + subIndex ? 'activeMenu' : ''"
					@click="goToPath(item, subItem, index, subIndex)"
					v-hover="{ message: subItem.name }"
				>
					<span class="menu_icon">
						<img v-lazy-load="subItem.iconFileUrl" alt="" />
					</span>
					<span class="menu_name ellipsis">{{ subItem.name }}</span>
				</div>
			</div>
		</div>
		<div class="menu_item" :class="openMenuIndex == 'activity' ? 'activeMenu' : ''" @click="router.push('/activity')">
			<span class="menu_icon"><svg-icon name="activity_icon" size="17px"></svg-icon></span>
			<span class="menu_name ellipsis">优惠活动</span>
		</div>

		<div class="menu_item" :class="openMenuIndex == 'helpCenter' ? 'activeMenu' : ''" @click="router.push('/helpCenter')">
			<span class="menu_icon"><svg-icon name="common-help_icon" size="17px"></svg-icon></span>
			<span class="menu_name ellipsis">帮助中心</span>
		</div>
		<div class="menu_item" @click="Common.getSiteCustomerChannel">
			<span class="menu_icon"><svg-icon name="common-kefu_icon" size="17px"></svg-icon></span>
			<span class="menu_name ellipsis">线上客服</span>
		</div>
		<div class="menu_item" @click="router.push('/helpCenter')">
			<span class="menu_icon"><svg-icon name="common-join_us_icon" size="17px"></svg-icon></span>
			<span class="menu_name ellipsis">加入我们</span>
		</div>
		<div class="menu_item" @click="useModalStore().openModal('setLang')">
			<span class="menu_icon"><img :src="LangIcon" alt="" class="langIcon" /></span>
			<span class="menu_name ellipsis">语言切换</span>
			<span class="arrow">
				<svg-icon name="common-arrow_right" height="8px" width="14px" />
			</span>
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
const router = useRouter();
const route = useRoute();
const openMenuIndex: Ref<number | string | null> = ref(null);
const openSubMenuIndex: any = ref(null);
const UserStore = useUserStore();
//菜单从缓存中拉取
const props = defineProps({
	ActivitySwitch: [] as any,
});
const emit = defineEmits(["showDAILY_COMPETITION"]);
const routerObj: any = computed(() => {
	return MenuStore.getMenu;
});
const LangIcon = computed(() => {
	return UserStore.getLangList.find((item: any) => item.code == UserStore.getLang)?.iconFileUrl;
});

const collapse = computed(() => {
	return MenuStore.getCollapse;
});
const openDAILY_COMPETITION = () => {
	if (!UserStore.getLogin) {
		useModalStore().openModal("LoginModal");
	} else {
		useModalStore().openModal("DAILY_COMPETITION");
	}
};
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
	if (item.modelCode === "ACELT") {
		router.push({ path: "/lottery/home", query: { gameOneId: item.gameOneClassId, gameTwoId: subItem.id } });
	} else {
		router.push({ path: "/game/venue", query: { gameOneId: item.gameOneClassId, gameTwoId: subItem.id } });
	}
};

onMounted(() => {
	setOpenMenu();
});

/**
 * PE:"跳转体育"
 * CA:"进入通用场馆"
 * LT:"进入gamePage页面"
 */
const selectMenu = (item: any, index: number, isArrow?: boolean) => {
	// 展开菜单
	if (isArrow) {
		if (openMenuIndex.value === index) {
			openMenuIndex.value = null;
		} else {
			openMenuIndex.value = index;
		}
		return;
	}
	const gameOneIdParams = { gameOneId: item.gameOneClassId, gameTwoId: 0 };
	const singVenueMap = new Map([
		["SBA", { path: "/sports" }],
		["ACELT", { path: "/lottery/home", query: gameOneIdParams }],
	]);

	if (openMenuIndex.value === index) {
		// 取消选中状态，
		openMenuIndex.value = null;
		// 取消二级分类选中状态，
		openSubMenuIndex.value = null;
	} else {
		openMenuIndex.value = index;
	}

	const { modelCode } = item;
	if (singVenueMap.has(modelCode)) {
		router.push({ ...singVenueMap.get(modelCode) });
	} else if (modelCode === "SIGN_VENUE") {
		Common.goToGame(item);
	} else {
		router.push({ path: "/game/venue", query: gameOneIdParams });
	}
	return;
};
</script>

<style lang="scss" scoped>
.menu_row {
	.menu_item {
		height: 40px;
		margin-top: 4px;
		padding: 0 13px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		overflow: hidden;
		flex-wrap: wrap;
		font-size: 14px;
		border-radius: 4px;
		color: var(--Text-s);
		background: var(--Bg-3);
		border-bottom: 2px solid rgba(#9fa5ac, $alpha: 0.1);
		z-index: 10;
		line-height: 40px;

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
			padding: 0 12px;
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
		color: var(--Text-a);
		background: linear-gradient(to top, rgba(255, 40, 75, 0.3), rgba(255, 40, 75, 0.05));
		border-bottom: 2px solid rgba(#ff284b, 0.5);
		.menu_name {
			color: var(--Text-s);
		}
	}
	.subMenu {
		background: var(--Bg);
		height: 0;
		overflow: hidden;
		transition: all 0.2s ease;
		display: block;
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
		.subItem {
			display: flex;
			align-items: center;
			padding: 0 25px;
			height: 46px;
			color: var(--Text-1);
			font-size: 13px;
			border-bottom: 2px solid transparent;
		}
		.subItem.activeMenu,
		.subItem:hover {
			border-radius: 6px;
			background: linear-gradient(0deg, rgba(255, 97, 123, 0.15) 0%, rgba(255, 97, 123, 0.15) 100%), var(--Bg-3);
			border-bottom: 2px solid rgba(#ff284b, 0.5);
			.menu_name {
				color: var(--Text-1);
			}
		}
	}
	.subMenu.opensubMenu {
		border-radius: 6px;
	}

	.menu_icon {
		height: 100%;
		text-align: center;
		width: 20px;
		height: 20px;
	}
	&.collapse {
		width: 52px;
		.subMenu {
			.subItem {
				width: 40px;
				padding: 0;
				margin: 0 auto;
				.menu_name {
					display: none;
				}
			}
		}
		.menu_item {
			width: 40px;
			margin: 0 auto;
			margin-top: 4px;
			padding: 0;
			justify-content: center;
			background: var(--Bg-3);
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
			color: var(--Text-a);
			background: linear-gradient(to top, rgba(255, 40, 75, 0.3), rgba(255, 40, 75, 0.05));
			border-bottom: 2px solid var(--Theme);
			.menu_name {
				color: var(--Text-a);
			}
		}
	}
}

.arrow {
	width: 20px;
	height: 20px;
	background-color: var(--Line-2);
	padding: 2px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
}
</style>
