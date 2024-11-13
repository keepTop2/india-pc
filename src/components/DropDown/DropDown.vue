<template>
	<div class="dropdown" ref="dropdownRef">
		<slot name="toggle" :toggleDropdown="toggleDropdown">
			<button @click="toggleDropdown" class="dropdown-toggle">
				{{ selectedLabel }}
			</button>
		</slot>
		<transition name="slide-fade">
			<ul v-if="isOpen" class="dropdown-menu">
				<div v-if="searchInput" class="search_input">
					<svg-icon class="search_icon" name="search" />
					<input type="text" v-model="searchQuery" placeholder="请输入关键字" class="dropdown-search" />
					<svg-icon v-show="searchQuery" class="search_clear" name="common-close" @click="searchQuery = ''" />
				</div>
				<div class="dropdown-list">
					<li v-for="item in filteredOptions" :key="item[valueKey]" @click="selectOption(item)" class="dropdown-item">
						<slot name="option" :option="item">
							<span class="dropdown-item-value">{{ item[labelKey] }}</span>
						</slot>
					</li>
				</div>
			</ul>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineEmits, watch, computed } from "vue";

const props = withDefaults(
	defineProps<{
		options: { [key: string]: string }[]; // 选项为任意键名的对象数组
		defaultLabel?: string;
		modelValue?: string;
		searchInput?: boolean;
		searchValue?: string;
		label?: string; // 显示值的键名
		value?: string; // 绑定值的键名
	}>(),
	{
		searchInput: true,
	}
);
const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
	(e: "update:searchValue", value: string): void;
	(e: "toggle", isOpen: boolean): void;
	(e: "change", item: { [key: string]: string }): void; // 新增选中事件
}>();

const labelKey = props.label || "label"; // 默认键名为 'label'
const valueKey = props.value || "value"; // 默认键名为 'value'

const selectedLabel = ref(props.modelValue ? props.options.find((option) => option[valueKey] === props.modelValue)?.[labelKey] : props.defaultLabel || "选择选项");
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const searchQuery = ref(props.searchValue || "");

watch(searchQuery, (newVal) => {
	emit("update:searchValue", newVal);
});

// 计算过滤后的选项
const filteredOptions = computed(() => {
	return props.options.filter((option) => option[labelKey].toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
	emit("toggle", isOpen.value);
};

const selectOption = (item: { [key: string]: string }) => {
	selectedLabel.value = item[labelKey];
	isOpen.value = false;
	emit("update:modelValue", item[valueKey]);
	emit("toggle", isOpen.value);
	emit("change", item); // 触发选中事件
};

const handleClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
		isOpen.value = false;
		emit("toggle", isOpen.value);
	}
};

onMounted(() => {
	window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
	window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.dropdown {
	position: relative;
	display: inline-block;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	margin-top: 5px;
	/* padding: 10px 0; */
	border-radius: 8px;
	background-color: var(--Bg-3);
	box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
	overflow: hidden;
	z-index: 1000;
}

.search_input {
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 10px;
	border-bottom: 1px solid var(--Line-2);
}

input {
	flex: 1;
	margin: 0px;
	padding: 0px;
	border: 0px;
	background-color: var(--Bg-3);
	color: var(--Text-s);
	font-family: "PingFang SC";
	font-size: 12px;
	font-weight: 400;
	&::placeholder {
		color: var(--Text-2-1);
	}
}

.search_icon {
	width: 14px;
	height: 14px;
}

.search_clear {
	width: 24px;
	height: 24px;
	cursor: pointer;
}
.dropdown-list {
	max-height: 190px;
	overflow-y: auto; /* 启用垂直滚动 */
	scrollbar-width: none; /* 适用于 Firefox，隐藏滚动条 */
	&::-webkit-scrollbar {
		width: 0; /* 隐藏滚动条 */
		height: 0;
	}
}

.dropdown-item {
	padding: 8px 12px;
	cursor: pointer;
	.dropdown-item-value {
		color: var(--Text-2-1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
}

.dropdown-item:hover {
	background-color: var(--Bg-1);
	.dropdown-item-value {
		color: var(--Text-s);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
