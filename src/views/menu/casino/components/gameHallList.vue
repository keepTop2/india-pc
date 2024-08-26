<template>
	<div class="container gameHallList">
		<!-- <GameGroupCard v-if="hotGame.gameInfoList.length" :groupCard="hotGame"></GameGroupCard> -->
		<template v-for="(item, index) in hallList" :key="index">
			<!-- POPULAR:热门，GAME:游戏，VENUE:游戏供应商 -->
			<GameGroupCard v-if="item?.type == 'POPULAR' || item?.type == 'GAME'" :key="index" :groupCard="item">
			</GameGroupCard>
			<GameSupplierGroupCard v-if="item?.type == 'VENUE'" key="index" :supplierGroupCard="item"></GameSupplierGroupCard>
		</template>
		<!-- <GameSupplierGroupCard v-if="supplier.gameInfoList.length" :supplierGroupCard="supplier"></GameSupplierGroupCard> -->
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { GameGroupCard, GameSupplierGroupCard } from './components';
import Common from '/@/utils/common';
import { CasionApi } from '/@/api/menu/casion/casion';
import { gameGroupCardList } from './record';
import { useRouter, useRoute } from 'vue-router';
import { useThemesStore } from '/@/stores/modules/themes';
import { useUserStore } from '/@/stores/modules/user';
const UserStore = useUserStore();

const router = useRouter();
const route = useRoute();
const themesStore = useThemesStore();

const hallList = ref([]);

const token = computed(() => {
	return UserStore.getUserInfo.token;
});

//获取大厅列表
const getGroupList = async () => {
	const params = {
		gameOneId: route.name,
		// label: 0,
		// gameTwoId: 'string',
		// sortFile: 0,
		// venueId: 'string',
		modelStyleCode: themesStore.getTheme,
	};
	const res = await CasionApi.gameHallList(params).catch((err) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		hallList.value = data;
	}
};
const hotGame = ref({
	id: 'static_2',
	name: '热门游戏',
	iconCode: 'rm_mr_icon',
	type: 'POPULAR',
	gameInfoList: [],
});
//获取固定热门游戏
const getGameHotList = async () => {
	let params: any = {
		pageNumber: 1,
		pageSize: 18,
		label: 2,
	};
	const res = await CasionApi.gamePageList(params).catch((err: any) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		const { total, records } = data;
		if (records && records.length) {
			hotGame.value.gameInfoList = records;
		} else {
		}
	}
};

const supplier = ref({
	id: 'static_2',
	name: '游戏供应商',
	iconCode: 'rm_mr_icon',
	type: 'VENUE',
	gameInfoList: [],
});

const gameSupplier = async () => {
	const params = {
		pageNumber: 0,
		pageSize: 18,
	};
	const res: any = await CasionApi.gameSupplierList(params).catch((err: any) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		const { total, records } = data;
		supplier.value.gameInfoList = records;
	}
};
watch(
	() => token.value,
	(newValue, oldValue) => {
		getGroupList();
		// getGameHotList();
		// gameSupplier();
	},
	{
		immediate: true,
	}
);
</script>

<style lang="scss" scoped>
.gameHallList {
	min-height: 786px;
	box-sizing: border-box;
}
</style>
