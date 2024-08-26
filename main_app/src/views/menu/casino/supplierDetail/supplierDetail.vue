<template>
	<div class="base-body">
		<div class="base-container">
			<HeaderCard :isSort="false" :isSupplier="false"></HeaderCard>
		</div>
		<div class="base-container">
			<div class="container-main">
				<div class="heder-plan">
					<div class="link-text">
						<span @click="onBack">{{ $t(`gameList['查看所有提供商']`) }} </span>
					</div>
					<h3>
						{{ seach.name }}<span>{{ $t(`gameList['游戏']`) }}</span>
					</h3>
				</div>
				<!-- 普通游戏列表 -->
				<InfiniteScroll ref="InfiniteScrollRef" :scrollLoad="gamePageList" :page-size="18"
					:loaded-number="gameList.length">
					<template #default>
						<GameCard v-for="(item, Index) in gameList" :key="Index" :CardItem="item"> </GameCard>
					</template>
				</InfiniteScroll>
			</div>
		</div>
		<div class="base-container">
			<div class="footer"></div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { HeaderCard, GameCard, InfiniteScroll, GameSupplierCard } from '../components/components';

import { useThemesStore } from '/@/stores/modules/themes';
import Common from '/@/utils/common';
import { CasionApi } from '/@/api/menu/casion/casion';
const router = useRouter();
const route = useRoute();
const InfiniteScrollRef = ref();
const gameList = ref([]);
const seach: any = ref({
	name: '',
	sortFile: '', //排序字段
	venueId: '', //游戏供应商人
});

//返回一条记录
const onBack = () => {
	// router.go(-1);
	console.info(route);
	const { parentName } = route?.meta;
	if (parentName) {
		router.push({ name: parentName } as any);
	} else {
		router.back();
	}

	// const  =route
};

//获取路由参数；
const getRouteId = () => {
	// const params: any = router.currentRoute.value.params;
	const params: any = router.currentRoute.value.query;
	seach.value.venueId = params?.id || '';
	seach.value.name = params?.name || '';
};

const onFormChange = (val: any) => {
	seach.value = val;
	if (InfiniteScrollRef.value) {
		gameList.value = [];
		InfiniteScrollRef.value.reset();
	}
};

// onMounted(() => {
// 	getRouteId();
// });
const gamePageList = async (page: any, loading: any, finished: any, error: any) => {
	getRouteId();
	const params = {
		// orderField: 'string',
		// orderType: 'string',
		// orderName: 'string',
		// orderValue: 'string',
		pageNumber: page.value.current,
		pageSize: page.value.pageSize,
		// gameOneId: 'string',å
		// label: 0,
		// gameTwoId: route.name,
		sortFile: seach.value?.sortFile, //排序字段
		venueId: seach.value?.venueId, //游戏供应商人
	};
	//请求顶部控制项
	const headers = {
		showLoading: false,
	};

	loading.value = true;
	const res: any = await CasionApi.gamePageList(params, headers).catch((err: any) => {
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

	.container-main {
		width: 1200px;
		background: none;
		// min-height: 786px;
		// height: auto;

		.heder-plan {
			.link-text {
				// color: var(--Theme-, #3bc116);
				font-family: 'PingFang SC';
				font-size: 18px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;
				text-decoration: none;
				cursor: pointer;

				@include themeify {
					color: themed('Theme');
				}

				// margin-bottom: 34px;
				&:link,
				&:active,
				&:hover,
				&:visited {
					text-decoration: none;
				}
			}

			h3 {
				@include themeify {
					color: themed('Text_s');
				}

				font-family: 'PingFang SC';
				font-size: 20px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;
				margin: 30px 0;
				margin-bottom: 20px;

				span {
					margin-left: 20px;
				}
			}
		}

		.hall-plan {
			padding-top: 34px;
		}
	}
}
</style>
