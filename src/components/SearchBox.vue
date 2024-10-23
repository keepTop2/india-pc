<template>
	<div class="search-component" ref="resultList">
		<!-- 搜索框 -->
		<div class="search_icon">
			<svg-icon name="search" size="18px"></svg-icon>
		</div>
		<input type="text" v-model="searchQuery" :placeholder="placeholder" class="search-input" :class="inputFocus ? 'onFocus' : ''" @focus="inputFocus = true" />

		<!-- 搜索结果 -->
		<ul class="result-list" v-if="filteredResults.length > 0 && inputFocus" ref="resultList">
			<li v-for="item in filteredResults" :key="item.id" @click="Common.goToGame(1)">{{ item.name }}</li>
		</ul>

		<!-- 历史记录 -->
		<ul v-else-if="!searchQuery && inputFocus" class="result-list">
			<li v-for="(item, index) in searchHistoryList" :key="item.id" v-hover-svg @click="Common.goToGame(1)">
				<svg-icon name="history_icon" size="18px" class="mr_6" />
				<span>{{ item.name }}</span>
			</li>
		</ul>
		<ul v-else-if="searchQuery && inputFocus" class="noData result-list">
			<li>没有找到匹配的结果</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, PropType } from "vue";
import Common from "../utils/common";
import { onClickOutside } from "@vueuse/core";
const inputFocus = ref(false);
const resultList = ref(null);
const props = defineProps({
	items: {
		type: Array as PropType<Array<{ id: number; name: string }>>,
		required: true,
	},
	searchHistoryList: {
		type: Array as PropType<Array<{ id: number; name: string }>>,
		required: true,
	},
	placeholder: {
		type: String,
		default: "请输入搜索内容",
	},
});
const searchQuery = ref(""); // 搜索关键词
// 计算属性，用于筛选搜索结果
const filteredResults = computed(() => {
	if (!searchQuery.value) {
		return []; // 如果搜索框为空，则显示全部
	}
	return props.items.filter((item) => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});
onClickOutside(resultList, (event) => {
	inputFocus.value = false;
});
</script>

<style scoped lang="scss">
.search-component {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	position: relative;
	.search-input {
		width: 100%;
		height: 50px;
		background: var(--Bg2);
		border-radius: 6px;
		font-size: 14px;
		border: 1px solid var(--Line_2);
		padding-left: 54px;
		color: var(--Text_s);
	}

	.onFocus {
		border: 1px solid var(--Theme);
	}
	.search_icon {
		position: absolute;
		left: 12px;
		top: 16px;
		margin-right: 24px;
		padding-right: 12px;
		border-right: 1px solid var(--Line_2);
		display: flex;
		align-items: center;
	}
}

.result-list {
	list-style-type: none;
	padding: 4px 24px;
	margin-top: 5px;
	position: absolute;
	top: 100%;
	width: 100%;
	background: var(--Bg2);
	border: 1px solid var(--Line_2);
	cursor: pointer;
	color: var(--Text1);
	z-index: 10;
	border-radius: 6px;
}

.result-list {
	li {
		padding: 8px;
		display: flex;
		align-items: center;
	}
	li:hover {
		color: var(--Text_s);
	}
}

.noData {
	text-align: center;
}
</style>
