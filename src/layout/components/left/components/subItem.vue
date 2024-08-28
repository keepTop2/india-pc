<template>
	<div v-for="(val, index) in chils" :key="index">
		<el-sub-menu
			:index="val.path"
			:key="val.path"
			v-if="val.children && val.children.length > 0 && !val.meta?.isHide"
			:expand-close-icon="val.meta?.activeIcon"
			:expand-open-icon="val.meta?.activeIcon"
		>
			<template #title>
				<template v-if="val.meta?.isServer">
					<div class="icon" :class="{ activeColor: selectList.includes(val.path) || hoverList.val.includes(val.path) }">
						<SvgIcon :size="18" :iconName="val.meta?.iconCode || `Casino`" @click="show = true" class="iconSvg" />
					</div>
					<span class="ml_16" :class="{ activeColor: selectList.includes(val.path) || hoverList.val.includes(val.path) }">{{ val.meta?.title }}</span>
				</template>
				<template v-else>
					<div class="menu_title_container" @mouseover="onMouseover(val)" @mouseout="onMouseout()">
						<img v-show="selectList.includes(val.path) || hoverList.val.includes(val.path)" :src="getIconPath(val.meta?.activeIcon as string, 'activeIcon')" alt="" />
						<img v-show="!selectList.includes(val.path) && !hoverList.val.includes(val.path)" :src="getIconPath(val.meta?.inactivated as string, 'inactivated')" alt="" />

						<span class="ml_16" :class="{ activeColor: selectList.includes(val.path) || hoverList.val.includes(val.path) }">{{ $t(val.meta?.title) }}</span>
					</div>
				</template>
			</template>
			<sub-item :chil="val.children" />
		</el-sub-menu>
		<template v-else>
			<div v-if="!val.meta?.isHide" @mouseover="onMouseover(val)" @mouseout="onMouseout()">
				<el-menu-item :index="val.path" :key="val.path">
					<template #title>
						<template v-if="val.meta?.isServer">
							<div class="icon" :class="{ activeColor: selectList.includes(val.path) || hoverList.val.includes(val.path) }">
								<SvgIcon :size="18" :iconName="val.meta?.iconCode || `Casino`" @click="show = true" class="iconSvg" />
							</div>
							<span class="ml_16" :class="{ activeColor: selectList.includes(val.path) || hoverList.val.includes(val.path) }">{{ val.meta?.title }}</span>
						</template>
						<template v-else>
							<img v-show="selectList.includes(val.path) || hoverList.val.includes(val.path)" :src="getIconPath(val.meta?.activeIcon as string, 'activeIcon')" alt="" />
							<img v-show="!selectList.includes(val.path) && !hoverList.val.includes(val.path)" :src="getIconPath(val.meta?.inactivated as string, 'inactivated')" alt="" />
							<span class="ml_16" :class="{ activeColor: selectList.includes(val.path) || hoverList.val.includes(val.path) }">{{ $t(val.meta?.title) }}</span>
						</template>
					</template>
				</el-menu-item>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts" name="subItem">
import { computed, onMounted, ref } from "vue";
import { RouteRecordRaw } from "vue-router";
import useMenuHooks from "../useMenuHooks";

const { onMouseover, onMouseout, hoverList, getIconPath } = useMenuHooks();
// 定义父组件传过来的值
const props = defineProps({
	// 菜单列表
	chil: {
		type: Array<RouteRecordRaw>,
		default: () => [],
	},
	selectList: {
		type: Array<string>,
		default: () => [],
	},
});

const show = ref(false);

// 获取父级菜单数据
const chils = computed(() => {
	return <RouteItems>props.chil;
});

onMounted(() => {});
</script>

<style scoped lang="scss">
@import "../left.scss";

:deep(.el-menu-item) {
	padding-left: 20px !important;
}

.el-menu-item.is-active {
	@include themeify {
		color: themed("Text_s");
		background-color: themed("Bg3") !important;
	}
}

.menu_title_container {
	width: 100%;
	@include flex_align_center;
}
</style>
