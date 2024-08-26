<template>
	<div class="gameList">
		<div class="gl-header">
			<h3>{{ pageItem?.name || $t('gameList["为你推荐"]') }}</h3>
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
import { InfiniteScroll } from '/@/components/InfiniteScroll';
import { GameCard } from '/@/components/gameCard';
import Common from '/@/utils/common';
import { CasionApi } from '/@/api/menu/casion/casion';
import { useUserStore } from '/@/stores/modules/user';
const UserStore = useUserStore();

const token = computed(() => {
	return UserStore.getUserInfo.token;
});
const InfiniteScrollRef = ref();

const props = withDefaults(defineProps<{ pageItem?: any }>(), {
	pageItem: {
		id: '',
		iconCode: 'dat_icon',
		name: '',
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

watch(
	() => props.pageItem,
	(newValue, oldValue) => {
		if (InfiniteScrollRef.value) {
			gameList.value = [];
			InfiniteScrollRef.value.reset();
		}
	}
);

const gamePageList = async (page: any, loading: any, finished: any, error: any) => {
	let params: any = {
		pageNumber: page.value.current,
		pageSize: page.value.pageSize,
		label: 1,
	};
	loading.value = true;
	let res: any = await CasionApi.gamePageList(params).catch((err: any) => {
		loading.value = false;
		error.value = true;
	});
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
