<!--
 * @Author: WangMingxin
 * @Description: 收藏夹
-->
<template>
	<div class="base-body" :class="viewPage ? '' : 'visibility_h'">
		<div class="base-container">
			<div class="container-main gameList">
				<GameList ref="gameListRef" v-model:listLength="listLength"></GameList>
			</div>
		</div>
		<div class="base-container" v-if="!listLength">
			<div class="container-main footer">
				<GameGroupCard :groupCard="gameGroupCard" @clickCollect="clickCollect"></GameGroupCard>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { GameList } from './components';
import { GameGroupCard } from '/@/views/menu/casino/components/components';
import Common from '/@/utils/common';
import { CasionApi } from '/@/api/menu/casion/casion';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;
//dome 对象
const gameListRef = ref();

//数据内容量；
const listLength = ref(0);

const gameGroupCard = ref({
	id: 'recommendedYou',
	name: '为你推荐',
	iconCode: '',
	type: 'GAME',
	gameInfoList: [],
});
//获取为你推荐；
const gamePageList = async () => {
	gameGroupCard.value.gameInfoList = [];
	let params: any = {
		pageNumber: 1,
		pageSize: 18,
		label: 1,
	};
	//根据标签label 获取游戏列表
	let res: any = await CasionApi.gamePageList(params).catch((err: any) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		const { total, records } = data;
		if (records && records.length) {
			gameGroupCard.value.name = $.t('gameList["为你推荐"]');
			gameGroupCard.value.gameInfoList = records;
		}
	}
};
//判断页面是否显示
const viewPage = computed(() => {
	if (listLength.value || gameGroupCard.value.gameInfoList.length) {
		return true;
	} else {
		return false;
	}
});
watch(
	() => listLength.value,
	(newValue, oldValue) => {
		if (!newValue) {
			gamePageList();
		}
	},
	{
		immediate: true,
	}
);

//GameGroupCard 卡片收藏点击响应
const clickCollect = () => {
	(gameListRef.value as any).onFormChange();
};

onBeforeUnmount(() => { });
</script>

<style lang="scss" scoped>
.visibility_h {
	visibility: hidden;
}

.base-body {
	// min-height: 700px;
	display: block;
	position: relative;
	flex: 1;
	flex-shrink: 0;
	width: 100%;
}

.base-container {
	display: flex;
	justify-content: center;

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
