<template>
	<div class="gameList">
		<div class="gl-header">
			<h3>{{ pageItem?.name }}</h3>
		</div>
		<div class="main">
			<!-- 普通游戏列表 -->
			<InfiniteScroll ref="InfiniteScrollRef" :scrollLoad="gamePageList" :page-size="18"
				:loaded-number="gameList.length">
				<template #default>
					<GameCard v-for="(item, Index) in gameList" :key="Index" :CardItem="item"> </GameCard>
				</template>
			</InfiniteScroll>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { GameCard, InfiniteScroll } from './components';
import { useThemesStore } from '/@/stores/modules/themes';
import Common from '/@/utils/common';
import { CasionApi } from '/@/api/menu/casion/casion';

import { useUserStore } from '/@/stores/modules/user';
const UserStore = useUserStore();
const router = useRouter();
const route = useRoute();
const InfiniteScrollRef = ref();

const token = computed(() => {
	return UserStore.getUserInfo.token;
});

const props = withDefaults(defineProps<{ pageItem?: any }>(), {
	pageItem: {
		id: '',
		iconCode: 'dat_icon',
		name: '大厅',
		sort: 0,
		modelCode: 'GAME',
		active: true,
	},
});

const gameList = ref([]);
const seach: any = ref({
	venueIds: [],
});

const onFormChange = (val?: any) => {
	seach.value = val;
	if (InfiniteScrollRef.value) {
		gameList.value = [];
		InfiniteScrollRef.value.reset();
	}
};

const gamePageList = async (page: any, loading: any, finished: any, error: any) => {
	// const params = {
	// 	gameOneId: route.name,
	// 	modelStyleCode: themesStore.getTheme,
	// };
	let params: any = {
		// orderField: 'string',
		// orderType: 'string',
		// orderName: 'string',
		// orderValue: 'string',
		pageNumber: page.value.current,
		pageSize: page.value.pageSize,
		gameOneId: route.name,

		sortFile: seach.value?.sortFile, //排序字段
		venueIds: seach.value?.venueId, //游戏供应商人
	};

	const pageItemId = props.pageItem.id;

	loading.value = true;
	let res: any = '';
	if (pageItemId.indexOf('static') != -1) {
		const arrStr = pageItemId.split('_');
		const labelCode = arrStr[arrStr.length - 1];
		params = {
			...params,
			label: labelCode,
		};

		//根据标签label 获取游戏列表
		res = await CasionApi.gamePageList(params).catch((err: any) => {
			loading.value = false;
			error.value = true;
		});
	} else {
		params = {
			...params,
			gameTwoId: props.pageItem.id,
		};
		//根据二级路由Id 获取游戏列表
		res = await CasionApi.gamePageListByID(params).catch((err: any) => {
			loading.value = false;
			error.value = true;
		});
	}

	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		loading.value = false;
		const { total, records } = data;
		if (records && records.length) {
			gameList.value = gameList.value.concat(records);
			if (records.length >= page.value.pageSize) {
				page.value.current += 1;
			} else {
				finished.value = true;
			}
		} else {
			finished.value = true;
		}
	}
};
watch(
	() => props.pageItem,
	(newValue, oldValue) => {
		if (InfiniteScrollRef.value) {
			gameList.value = [];
			InfiniteScrollRef.value.reset();
		}
	}
);
watch(
	() => token.value,
	(newValue, oldValue) => {
		onFormChange(seach.value);
	},
	{
		immediate: true,
	}
);
</script>

<style lang="scss" scoped>
.gameList {
	width: 100%;
	padding-bottom: 34px;

	.gl-header {
		height: 78px;

		h3 {
			// color: var(--text-s, #fff);
			font-family: 'PingFang SC';
			font-size: 20px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			line-height: 78px;

			@include themeify {
				color: themed('Text_s');
			}
		}
	}
}

.container {
	display: grid;
	grid-template-columns: repeat(6, 190px);
	justify-self: center;
	grid-column: 1/-1;
	// justify-items: center;
	grid-column-gap: 12px;
	grid-row-gap: 12px;
	// min-height: 786px;
	// box-sizing: border-box;
	// padding-left: 24px;
}
</style>
