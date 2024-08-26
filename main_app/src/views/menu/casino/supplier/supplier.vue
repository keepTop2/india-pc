<template>
	<div class="base-body">
		<div class="base-container">
			<HeaderCard :isSort="false" :isSupplier="false" @onFormChange="onFormChange"></HeaderCard>
		</div>
		<div class="base-container">
			<div class="container-main">
				<!-- 普通游戏列表 -->
				<InfiniteScroll ref="InfiniteScrollRef" :scrollLoad="gamePageList" :page-size="18"
					:loaded-number="supplierList.length">
					<template #default>
						<GameSupplierCard v-for="(item, index) in supplierList" :item="item" :key="index" :width="190" :height="80"
							@cardClick="onSupplierCardClick"></GameSupplierCard>
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
const supplierList = ref([]);
const seach: any = ref({});

const onFormChange = (val: any) => {
	seach.value = val;
	if (InfiniteScrollRef.value) {
		supplierList.value = [];
		InfiniteScrollRef.value.reset();
	}
};
const gamePageList = async (page: any, loading: any, finished: any, error: any) => {
	const params = {
		pageNumber: page.value.current,
		pageSize: page.value.pageSize,
		// gameOneId: 'string',å
		// label: 0,
		gameTwoId: route.name,
		sortFile: seach.value?.sortFile, //排序字段
		venueId: seach.value?.venueId, //游戏供应商人
	};
	loading.value = true;
	const res: any = await CasionApi.gameSupplierList(params).catch((err: any) => {
		loading.value = false;
		error.value = true;
	});
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		loading.value = false;
		const { total, records } = data;
		if (records && records.length) {
			supplierList.value = supplierList.value.concat(records);
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

const onSupplierCardClick = (item: any) => {
	const routeParam = {
		path: '/menu/casino/supplierDetail',
		query: { id: item.id, name: item.name },
	};

	router.push(routeParam);
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
		box-sizing: border-box;

		.hall-plan {
			padding-top: 34px;
		}
	}
}
</style>
