<template>
	<div class="gameMenu">
		<div class="back">
			<el-scrollbar>
				<div class="back-main">
					<div class="menu-item" :class="item.active ? 'active' : ''" v-for="(item, index) in menuList" :key="index" @click="linkMenu(item)">
						<div class="icon">
							<SvgIcon :iconName="item.iconCode" class="iconSvg" />
						</div>
						<span>{{ item.name }}</span>
					</div>
				</div>
			</el-scrollbar>
		</div>

		<!-- <el-scrollbar>
			<div class="scrollbar-flex-content">
				<p v-for="item in 50" :key="item" class="scrollbar-demo-item">
					{{ item }}
				</p>
			</div>
		</el-scrollbar> -->
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { gameMenu } from './record';
import { useMenuStore } from '/@/stores/modules/menu';

const router = useRouter();
const route = useRoute();

const MenuStore = useMenuStore();

//使用后端口数据创建服务菜单
const serverMenu = computed(() => {
	const server = MenuStore.getServerData;
	const sIndex = server.findIndex((e: any) => e.gameOneClassId == route.name);
	let sMenu: any = [];
	if (sIndex == 0 || sIndex) {
		//1:推荐，2:热门，3:最新
		sMenu = [
			{
				id: '',
				iconCode: 'dat_icon',
				name: '大厅',
				sort: 0,
				modelCode: 'GAME',
				active: true,
			},
			// {
			// 	id: 'static_2',
			// 	name: '热门游戏',
			// 	iconCode: 'rm_mr_icon',
			// 	sort: 1,
			// 	modelCode: 'GAME',
			// 	active: false,
			// },
			// {
			// 	id: 'static_3',
			// 	name: '最新游戏',
			// 	iconCode: 'xsyx_mr_icon',
			// 	sort: 2,
			// 	modelCode: 'GAME',
			// 	active: false,
			// },
		].concat(server[sIndex]?.gameTwoClassList);
	}
	MenuStore.setHallTopMenu(sMenu);
	return sMenu;
});

const menuList = ref(JSON.parse(JSON.stringify(serverMenu.value)));
onMounted(() => {
	getRouteTab();
});

const getRouteTab = () => {
	const routeTab = router.currentRoute.value.query;
	if (Object.prototype.hasOwnProperty.call(routeTab, 'tab')) {
		menuList.value.forEach((item: any) => {
			if (item.id && item.id == routeTab.tab) {
				item.active = true;
			} else {
				item.active = false;
			}
		});
	} else {
		menuList.value[0].active = true;
	}
};

const linkMenu = (menuItem: any) => {
	menuList.value.forEach((item: any) => {
		if (item.id && item.id == menuItem.id) {
			item.active = true;
		} else {
			item.active = false;
		}
	});
	if (menuItem.id && route.name) {
		router.push({ name: route.name as any, query: { tab: menuItem.id } });
	} else {
		menuList.value[0].active = true;
		router.push({ name: route.name as any });
	}
};
</script>

<style lang="scss" scoped>
.gameMenu {
	width: 100%;
	height: 64px;
	border-radius: 6px;
	display: inline-block;
	// background: var(--Bg1-1, #24262b);
	// overflow-y: hidden;
	padding: 0 10px;
	overflow-x: hidden;
	box-sizing: border-box;
	@include themeify {
		background-color: themed('Bg1');
	}
	.back {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.back-main {
		// width: auto;
		// padding: 0 10px;
		height: 64px;
		box-sizing: border-box;
		display: inline-block;
		display: flex;
		// flex-direction: row;
		// justify-content: center;
		align-items: center;
		grid-gap: 8px;
		white-space: nowrap;
	}
}

.menu-item {
	// float: left;
	flex-shrink: 0;
	// margin-right: 8px;
	display: flex;
	justify-content: center;
	// height: 44px;
	// color: var(--Text1-1, #98a7b5);
	// font-family: 'PingFang SC';
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 44px;
	border-radius: 4px;
	padding: 0 22px;
	@include themeify {
		color: themed('Text1');
	}
	cursor: pointer;
	.icon {
		margin-right: 8px;
		.iconSvg {
			height: 18px;
			width: 18px;
		}
	}

	&.active {
		// color: var(--text-s, #fff);
		// background-color: var(--Bg3-3, #2e3035);
		@include themeify {
			color: themed('Text_s');
			background-color: themed('Bg3');
		}
	}

	&:hover {
		// color: var(--text-s, #fff);
		// background-color: var(--Bg3-3, #2e3035);
		@include themeify {
			color: themed('Text_s');
			background-color: themed('Bg3');
		}
	}
}
</style>
