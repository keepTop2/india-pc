<template>
	<div>
		<Selectors />
		<Table class="mt_8" @check="onCheck" />
		<Pagination :currentPage="state.currentPage" :pageSize="state.pageSize" :total="21" @prevClick="prevClick" @nextClick="nextClick" />

		<Dialog :show="dialogShow" @close="dialogShow = false" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import Selectors from './components/selectors/selectors.vue';
import Table from './components/table/table.vue';
import Pagination from './components/pagination/pagination.vue';
import Dialog from './components/dialog/idnex.vue';

const dialogShow = ref(false); // 账变明细弹窗
const state = reactive({
	currentPage: 1,
	pageSize: 10,
});

const onCheck = () => {
	dialogShow.value = true;
};

// 上一页
const prevClick = () => {
	if (state.currentPage <= 1) {
		return;
	}
	state.currentPage--;
};

// 下一页
const nextClick = (totalPages: number) => {
	if (state.currentPage >= totalPages) {
		return;
	}
	state.currentPage++;
};
</script>

<style scoped lang="scss"></style>
