<template>
	<div class="base-body">
		<div class="base-container">
			<div class="header">
				<Carousel :gameList="gameList" :spaceBetween="12" />
			</div>
		</div>
		<div class="base-container">
			<div class="container-main">
				<GameMenu></GameMenu>
				<!-- 大厅游戏列表 -->
				<div class="hall-plan" v-if="!menuTab">
					<GameHallList></GameHallList>
				</div>
				<!-- 普通游戏列表 -->
				<div class="gameList" v-else>
					<GameList :pageItem="listItem"></GameList>
				</div>
			</div>
		</div>
		<div class="base-container">
			<div class="footer"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { GameMenu, GameList, GameHallList, Carousel } from '../components/components';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '/@/stores/modules/menu';

const router = useRouter();

const MenuStore = useMenuStore();

const listItem = ref({});
const menuTab = computed(() => {
	const gameMenu = MenuStore.getHallTopMenu;
	const routeTab = router.currentRoute.value.query;

	if (Object.prototype.hasOwnProperty.call(routeTab, 'tab')) {
		gameMenu.forEach((item: any) => {
			if (item.id == routeTab.tab) {
				listItem.value = item;
			}
		});
		return routeTab.tab;
	} else {
		return '';
	}
});

onMounted(() => {});

const gameList = [
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
	{
		imageUrl: '',
		userName: 'hida',
		money: '1234,223',
		unit: '$',
	},
];
</script>

<style lang="scss" scoped>
.base-body {
	display: block;
	position: relative;
	flex: 1;
	flex-shrink: 0;
	width: 100%;
}
.base-container {
	display: flex;
	justify-content: center;
	.header {
		width: 1200px;
		height: 232px;
		flex-shrink: 0;
		padding-top: 36px;
		box-sizing: border-box;
		background-color: transparent;
	}
	.container-main {
		width: 1200px;
		// height: 600px;
		background: none;

		.hall-plan {
			padding-top: 34px;
		}
	}
}
</style>
