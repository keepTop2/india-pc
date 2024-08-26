<template>
	<el-menu
		class="elMenu_Plan"
		:class="collapse ? 'collapse' : ''"
		router
		:default-active="activeMenu"
		:collapse-transition="false"
		@select="onSelect"
		@open="onOpen"
		@close="onClose"
	>
		<div v-for="(val, index) in routerObj?.children" :key="index" class="menu_row">
			<el-sub-menu
				class="havechildren"
				:index="val.path"
				v-if="val.children && val.children.length > 0 && !val.meta?.isHide"
				:key="val.path"
				:expand-close-icon="vnode"
				:expand-open-icon="vnode"
			>
				<template #title>
					<div class="menu_title_container" @mouseover="onMouseover(val)" @mouseout="onMouseout()" @click="onMenuClick(val)">
						<template v-if="val.meta?.isServer">
							<div class="menu_title_container">
								<div class="icon" :class="{ activeColor: state.selectList.includes(val.path) || hoverList.val.includes(val.path) || state.openMenuList.includes(val.path) }">
									<SvgIcon :size="18" :iconName="val.meta?.iconCode || `Casino`" class="iconSvg" />
								</div>
								<span class="ml_16" :class="{ activeColor: state.selectList.includes(val.path) || hoverList.val.includes(val.path) || state.openMenuList.includes(val.path) }">
									{{ val.meta?.title }}
								</span>
							</div>
						</template>
						<template v-else>
							<div class="menu_title_container">
								<img
									v-show="state.selectList.includes(val.path) || hoverList.val.includes(val.path) || state.openMenuList.includes(val.path)"
									:src="getIconPath(val.meta?.activeIcon as string, 'activeIcon')"
									alt=""
								/>
								<img
									v-show="!state.selectList.includes(val.path) && !hoverList.val.includes(val.path) && !state.openMenuList.includes(val.path)"
									:src="getIconPath(val.meta?.inactivated as string, 'inactivated')"
									alt=""
								/>
								<span class="ml_16" :class="{ activeColor: state.selectList.includes(val.path) || hoverList.val.includes(val.path) || state.openMenuList.includes(val.path) }">
									{{ $t(val.meta?.title as string) }}
								</span>
							</div>
						</template>

						<div class="instruct_plan">
							<img
								:src="left_imgs.right_2"
								v-show="state.selectList.includes(val.path) || hoverList.val.includes(val.path) || state.openMenuList.includes(val.path)"
								alt=""
								:class="{ rotate_90: state.openMenuList.includes(val.path) }"
							/>
							<img :src="left_imgs.right_1" v-show="!state.selectList.includes(val.path) && !hoverList.val.includes(val.path) && !state.openMenuList.includes(val.path)" alt="" />
						</div>
					</div>
				</template>
				<SubItem v-if="!collapse" :chil="val.children" :select-list="state.selectList" />
			</el-sub-menu>
			<template v-else>
				<div v-if="!val.meta?.isHide" @mouseover="onMouseover(val)" @mouseout="onMouseout()" class="menu_row_plan">
					<el-menu-item :index="val.path" :key="val.path">
						<template #title>
							<div class="icon" v-if="val.meta?.isServer" :class="{ activeColor: state.selectList.includes(val.path) || hoverList.val.includes(val.path) }">
								<SvgIcon :size="18" :iconName="val.meta?.iconCode || `Casino`" class="iconSvg" />
							</div>
							<template v-if="!val.meta?.isServer">
								<img v-show="state.selectList.includes(val.path) || hoverList.val.includes(val.path)" :src="getIconPath(val.meta?.activeIcon as string, 'activeIcon')" alt="" />
								<img v-show="!state.selectList.includes(val.path) && !hoverList.val.includes(val.path)" :src="getIconPath(val.meta?.inactivated as string, 'inactivated')" alt="" />
							</template>
							<span v-if="val.meta?.isServer" class="ml_16" :class="{ activeColor: state.selectList.includes(val.path) || hoverList.val.includes(val.path) }">{{
								val.meta?.title
							}}</span>
							<span v-if="!val.meta?.isServer" class="ml_16" :class="{ activeColor: state.selectList.includes(val.path) || hoverList.val.includes(val.path) }">{{
								$t(val.meta?.title as string)
							}}</span>
						</template>
					</el-menu-item>
				</div>
			</template>
		</div>
	</el-menu>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch, watchEffect, onUnmounted } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { deepClone } from "/@/utils/other";
import SubItem from "./subItem.vue";
import useMenuHooks from "../useMenuHooks";
import left_imgs from "../left_imgs";
import { useMenuStore } from "/@/stores/modules/menu";
const MenuStore = useMenuStore();
const { onMouseover, onMouseout, hoverList, getIconPath } = useMenuHooks();
const router = useRouter();
const route = useRoute();

//菜单从缓存中拉取
const routerObj = computed(() => {
	const menuList = MenuStore.getMenu;
	console.info("菜单从缓存中拉取", menuList);

	return menuList;
});

const collapse = computed(() => {
	const val = MenuStore.getCollapse;
	return val;
});

const activeMenu = computed(() => {
	const { path } = route;
	if (state.selectList.length == 0) {
		state.selectList = [path, router.resolve(route.fullPath).matched[route.matched.length - 2]?.path];
	}
	return path;
});

const state = reactive({
	//选中的菜单数组
	selectList: [] as Array<string>,
	//展开的菜单
	openMenuList: [] as Array<string>,
});

//选中菜单
const onSelect = (index: string, item: Array<string>) => {
	state.selectList = item;
};

//sub-menu 展开的回调
const onOpen = (index: string, indexPath: Array<string>) => {
	state.openMenuList.push(index);
	// console.log(index, indexPath, '展开菜单');
};

//sub-menu 收起的回调
const onClose = (index: string, indexPath: Array<string>) => {
	const idx = state.openMenuList.findIndex((item) => item == index);
	state.openMenuList.splice(idx, 1);
	// console.log(index, indexPath, '收起菜单');
};

//渲染
const vnode = h("span");

const onMenuClick = (val: any) => {
	// console.info(val);
	router.push(val);
};
</script>

<style lang="scss" scoped>
@import "../left.scss";

.el-menu {
	border-right: none;

	@include themeify {
		background-color: themed("Bg4") !important;
	}

	.el-menu-item {
		@include themeify {
			background: themed("Bg1");
			color: themed("Text1");
			font-size: 14px;
			margin-bottom: 2px;
			border-radius: 4px;
		}
	}

	.el-menu-item:hover {
		@include themeify {
			background-color: themed("Bg3") !important;
		}
	}

	.el-sub-menu {
		@include themeify {
			background: themed("Bg1");
		}
	}

	:deep(.el-sub-menu__title) {
		padding-right: 20px;

		@include themeify {
			color: themed("Text1");
			font-size: 14px;
		}
	}

	:deep(.el-sub-menu__title:hover) {
		@include themeify {
			background-color: themed("Bg3");
		}
	}
}

.havechildren {
	:deep(.el-menu) {
		@include themeify {
			background-color: themed("Bg4");
		}
	}

	:deep(.el-menu-item) {
		border-radius: 4px;

		@include themeify {
			color: themed("Text1");
			font-size: 14px;
		}
	}

	:deep(.el-menu-item:hover) {
		@include themeify {
			background-color: themed("Bg3") !important;
		}
	}
}

.el-menu-item.is-active {
	@include themeify {
		color: themed("Text_s");
		background-color: themed("Bg3") !important;
	}
}

.menu_title_container {
	width: 100%;
	height: 100%;
	@include flex_align_center;
}

.rotate_90 {
	transform: rotate(90deg);
}

.elMenu_Plan {
	&.collapse {
		width: 44px;

		.menu_row {
			margin-bottom: 16px;
		}

		:deep() {
			.el-menu-item {
				background-color: transparent;
				padding: 0px !important;

				span {
					display: none;
				}

				width: 44px;
				height: 44px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.havechildren {
				background-color: transparent;

				.el-sub-menu__title {
					padding: 0px;
					width: 44px;
					height: 44px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 4px;

					.menu_title_container {
						width: 44px;
						height: 44px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 4px;

						span {
							display: none;
						}
					}

					.el-icon {
						display: none;
					}
				}

				.instruct_plan {
					display: none;
				}
			}
		}
	}
}
</style>
