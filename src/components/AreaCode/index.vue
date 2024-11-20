<template>
	<div class="dropdown-select" ref="dropdown">
		<FromInput class="trigger fs_14 common_input pl_65" @input="onInput" :placeholder="$t(`login['请输入手机号']`)" v-model="value" />
		<span :class="selectedOptionLabel ? 'selectedOptionLabel' : ''" class="selectedOption curp flex_space-between fs_14" @click="toggleDropdown">
			<span class="fs_14">+{{ selectedOptionLabel }}</span>
			<svg-icon name="common-arrow_down_on" size="14px" fill="#fff" class="ml_10" />
		</span>
		<div v-if="isOpen" class="dropdown-menu">
			<div class="flex_space-between input">
				<svg-icon name="search" size="14px" color="#fff" class="search" />
				<input v-model="searchQuery" @input="filterOptions" :placeholder="$t(`login['搜索区号']`)" class="search-input common_input" />
				<svg-icon name="common-close" size="24px" @click="searchQuery = ''" color="#fff" class="close" />
			</div>
			<div class="line"></div>
			<ul class="options-list">
				<li
					v-for="option in filteredOptions"
					:key="option.areaCode"
					@click="selectOption(option)"
					class="option-item flex_space-between fs_12"
					:class="option.areaCode == selectedOption?.areaCode ? 'active' : ''"
				>
					<span>
						<img :src="option.icon" alt="" />
						{{ option.countryCode }}{{ option.countryName }}(+{{ option.areaCode }})
					</span>
					<svg-icon :name="option.countryCode == selectedOptionLabel ? 'common-cricle_theme' : 'common-cricle'" size="16px"> </svg-icon>
				</li>
				<li v-if="filteredOptions.length === 0" class="no-results fs_12 flex-center mt_8 Text2">{{ $t(`login["未搜索到相关区号"]`) }}</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
const value = ref("");
// 定义选项的接口
interface Option {
	areaCode: string; // 区号
	countryName: string; // 国家名称
	countryCode: string; // 国家代码
	icon: string; // 国家图标
	maxLength: number; // 手机号最大长度
	minLength: number; // 手机号最小长度
}

// 定义组件的 props
const props = defineProps({
	phone: {
		type: String,
	},
	options: {
		type: Array as () => Option[], // 定义选项为 Option 类型数组
		default: () => [], // 默认值为空数组
	},
	verifyType: {
		type: Number,
		default: 1,
	},
	areaCode: {
		type: String,
	},
});

// 定义 emit 事件
const emit = defineEmits<{
	(e: "update:modelValue", value: Object): void; // 更新手机号
	(e: "search", query: string): void; // 搜索事件
}>();

const searchQuery = ref(""); // 搜索查询
const isOpen = ref(false); // 下拉菜单是否打开
const selectedOption = ref<Option>(props.options[0]); // 当前选中的选项
const dropdown = ref<HTMLDivElement | null>(null); // 下拉框引用
const minLength = ref(props.options[0]?.minLength); // 最小长度
const maxLength = ref(props.options[0]?.maxLength); // 最大长度

// 监听 options 的变化
watch(
	() => props.options,
	() => {
		selectedOption.value = props.options[0]; // 选择第一个选项
		minLength.value = props.options[0].minLength; // 更新最小长度
		maxLength.value = props.options[0].maxLength; // 更新最大长度
	}
);

// 切换下拉菜单
const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

// 点击下拉框外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
	if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
		isOpen.value = false; // 关闭下拉菜单
	}
};

// 过滤选项
const filterOptions = () => {
	emit("search", searchQuery.value); // 触发搜索事件
};

// 选择一个选项
const selectOption = (option: Option) => {
	selectedOption.value = option; // 更新选中的选项
	minLength.value = selectedOption.value.minLength; // 更新最小长度
	maxLength.value = selectedOption.value.maxLength; // 更新最大长度
	isOpen.value = false; // 选择后关闭下拉菜单
	emit("update:modelValue", { areaCode: option.areaCode }); // 更新区域代码
};

// 输入框事件处理
const onInput = (e: any) => {
	isOpen.value = false; // 输入时关闭下拉菜单
	console.log(e.target.value, maxLength.value);
	// 限制输入长度
	if (e.target.value.length >= maxLength.value) {
		e.target.value = e.target.value.substring(0, maxLength.value);
	}
	emit("update:modelValue", { phone: e.target.value }); // 更新手机号
};

// 过滤后的选项
const filteredOptions = computed(() => {
	return props.options.filter(
		(option: Option) => option.areaCode.toLowerCase().includes(searchQuery.value?.toLowerCase()) || option.countryCode.toLowerCase().includes(searchQuery.value?.toLowerCase()) // 过滤区域代码和国家代码
	);
});

// 选中的区号标签
const selectedOptionLabel = computed(() => {
	return selectedOption.value ? selectedOption.value.areaCode : "";
});

// 组件挂载时添加事件监听
onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped lang="scss">
.dropdown-select {
	position: relative;
	height: 100%;
}

.trigger {
	width: 100%;
	padding: 8px 16px;
	padding-left: 85px;
	border: none;
	height: 100%;
	border-radius: 4px;
	background-color: var(--Bg-1);
	height: 46px;
	text-align: left;
	cursor: pointer;
	color: var(--Text-s);
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;

	.selectedOptionLabel {
		color: var(--Bg-1);
	}
}
.selectedOption {
	position: absolute;
	display: inline-block;
	display: flex;
	align-items: center;
	top: 8px;
	bottom: 8px;
	left: 12px;
	width: 65px;
	padding-right: 8px;
	color: var(--Text-s);
	border-right: 1px solid var(--Line-2);
}
.dropdown-menu {
	position: absolute;
	left: 0;
	width: 100%;
	border: none;
	border-radius: 4px;
	background-color: var(--Bg-1);
	z-index: 10;
	color: var(--Text-2);
	margin-top: 3px;
	min-height: 305px;
	.input {
		background-color: var(--Bg-2);
		height: 34px;
		border-radius: 4px;
		padding: 0px 8px;
		position: reactive;
		.close {
			position: absolute;
			right: 12px;
		}
		.search {
			position: absolute;
			left: 12px;
		}
	}
	.line {
		height: 1px;
		background: var(--Bg-3);
	}
	.search-input {
		width: 100%;
		padding: 8px;
		padding-left: 36px;
		box-sizing: border-box;
		height: 34px;
		outline: none;
		border-radius: 4px;
		background-color: var(--Bg-2);
		color: var(--Text-s);
	}

	.search-input::placeholder {
		color: var(--Text-2-1) !important;
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
	color: var(--Text-1);
	img {
		width: 14px;
		height: 14px;
		object-fit: cover;
		margin-right: 8px;
		border-radius: 50%;
	}
	svg {
		color: var(--Icon-1);
	}
}
.option-item.active {
	color: var(--Text-s);
	background-color: var(--Bg-3);
	svg {
		color: var(--Theme);
	}
}
.option-item:hover {
	color: var(--Text-s);
	background-color: var(--Bg-4);
	svg {
		color: var(--Theme);
	}
}

.no-results {
	padding: 8px;
	color: var(--Text-2-1);
}
</style>
