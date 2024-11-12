<template>
	<div class="search-component" ref="resultList">
		<!-- 搜索框 -->
		<div class="search_icon">
			<svg-icon name="search" size="18px"></svg-icon>
		</div>
		<input type="text" v-model="searchQuery" :placeholder="placeholder" class="search-input" :class="inputFocus ? 'onFocus' : ''" @focus="inputFocus = true" />
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
		background: var(--Bg-2);
		border-radius: 6px;
		font-size: 14px;
		border: 1px solid var(--Line-2);
		padding-left: 54px;
		color: var(--Text-s);
	}

	.search_icon {
		position: absolute;
		left: 12px;
		top: 16px;
		margin-right: 24px;
		padding-right: 12px;
		border-right: 1px solid var(--Line-2);
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
	background: var(--Bg-2);
	border: 1px solid var(--Line-2);
	cursor: pointer;
	color: var(--Text-1);
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
		color: var(--Text-s);
	}
}

.noData {
	text-align: center;
}
</style>
