<template>
	<div class="dropdown-select" ref="dropdown">
		<button class="trigger" @click="toggleDropdown">
			<span :class="selectedOptionLabel ? 'selectedOptionLabel' : ''"> {{ selectedOptionLabel || placeholder }} </span>
			<svg-icon name="common-arrow_right" size="14px" />
		</button>
		<div v-if="isOpen" class="dropdown-menu">
			<div class="flex_space-between input">
				<svg-icon name="search" size="14px" />
				<input v-model="searchQuery" @input="filterOptions" placeholder="搜索货币名称或简称" class="search-input common_input fs_12" />
				<svg-icon name="close" size="14px" @click="searchQuery = ''" />
			</div>
			<div class="line"></div>
			<ul class="options-list">
				<li
					v-for="option in filteredOptions"
					:key="option.currencyCode"
					@click="selectOption(option)"
					class="option-item fs_10"
					:class="option.currencyCode == selectedOption?.currencyCode ? 'active' : ''"
				>
					<span> {{ option.currencyCode }}</span>
					<span> {{ option.currencyNameI18 }}</span>
				</li>
				<li v-if="filteredOptions.length === 0" class="no-results">暂不支持此货币</li>
			</ul>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

// 定义选项的接口
interface Option {
	currencyCode: string; // 选项的代码
	currencyNameI18: string; // 选项的标签
	value: string; // 选项的值
}

// 定义组件的 props 类型
const props = defineProps<{
	options: Option[]; // 选项数组
	placeholder?: string; // 占位符（可选）
	model: string; // 绑定的模型
}>();

// 定义事件发射器
const emit = defineEmits<{
	(e: "update:modelValue", value: Option | null): void; // 更新模型值的事件
	(e: "search", query: string): void; // 搜索事件
}>();

// 定义响应式变量
const searchQuery = ref(""); // 搜索查询
const isOpen = ref(false); // 下拉菜单是否打开
const selectedOption = ref<Option | null>(null); // 当前选中的选项
const dropdown = ref<HTMLDivElement | null>(null); // 下拉菜单的 DOM 引用

// 切换下拉菜单的显示状态
const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

// 点击外部时隐藏下拉菜单
const handleClickOutside = (event: MouseEvent) => {
	if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
		isOpen.value = false; // 点击外部关闭下拉菜单
	}
};

// 过滤选项以进行搜索
const filterOptions = () => {
	emit("search", searchQuery.value); // 发射搜索事件
};

// 选择选项
const selectOption = (option: Option) => {
	selectedOption.value = option; // 设置选中的选项
	isOpen.value = false; // 选择后关闭下拉菜单
	emit("update:modelValue", option); // 发射更新模型值的事件
};

// 计算过滤后的选项
const filteredOptions = computed(() => {
	return props.options.filter(
		(option) =>
			option.currencyCode.toLowerCase().includes(searchQuery.value?.toLowerCase()) || // 根据 code 过滤
			option.currencyNameI18.toLowerCase().includes(searchQuery.value?.toLowerCase()) // 根据 value 过滤
	);
});

// 计算选中选项的标签
const selectedOptionLabel = computed(() => {
	return props.model ? props.model : selectedOption.value ? selectedOption.value.currencyCode : ""; // 返回绑定的模型值或选中项的代码
});

// 添加和移除全局点击事件监听器
onMounted(() => {
	document.addEventListener("click", handleClickOutside); // 组件挂载时添加事件监听器
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside); // 组件卸载时移除事件监听器
});
</script>

<style scoped lang="scss">
.dropdown-select {
	position: relative;
	height: 100%;
}

.trigger {
	width: 100%;
	padding: 8px 12px;
	border: none;
	height: 100%;
	border-radius: 4px;
	background-color: var(--Bg-1);
	text-align: left;
	cursor: pointer;
	color: var(--Text-2);
	display: flex;
	justify-content: space-between;
	align-items: center;
	.selectedOptionLabel {
		color: var(--Text-s);
	}
}

.dropdown-menu {
	position: absolute;
	top: calc(100% + 3px);
	left: 0;
	width: 100%;
	border: none;
	border-radius: 4px;
	background-color: var(--Bg-1);
	z-index: 10;
	color: var(--Text-2);
	padding: 0 16px;

	.input {
		background-color: var(--Bg-3);
		margin: 5px 0;
		border-radius: 4px;
		padding: 0px 8px;
	}
	.line {
		height: 1px;
		background: var(--Bg-3);
	}
	.search-input {
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
		height: 34px;
		outline: none;

		border-radius: 4px;
		background-color: var(--Bg-3);
	}
}

.options-list {
	max-height: 200px;
	overflow-y: auto;
	margin: 0;
	padding: 0;
	list-style: none;
}
.options-list::-webkit-scrollbar {
	display: none;
}
.option-item {
	padding: 8px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
}
.option-item.active,
.option-item:hover {
	color: var(--Text-s);
}

.no-results {
	padding: 8px;
	text-align: center;
	font-size: 12px;
}
</style>
