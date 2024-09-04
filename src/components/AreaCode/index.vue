<template>
	<div class="dropdown-select" ref="dropdown">
		<input class="trigger common_input fs_12"  @input="onInput">
			<span :class="selectedOptionLabel ? 'selectedOptionLabel' : ''" class="selectedOption curp flex_space-between "  @click="toggleDropdown">
				<span class="fs_12">+{{ selectedOptionLabel }}</span>
				<svg-icon name="arrow_down_on" size="14px" fill="#fff"  class="ml_10 "/>
			</span>
		</input>
		<div v-if="isOpen" class="dropdown-menu">
			<div class="flex_space-between input">
				<svg-icon name="search" size="14px" color="#fff" />
				<input v-model="searchQuery" @input="filterOptions" :placeholder="$t(`login['搜索货币名称或简称']`) " class="search-input common_input" />
				<svg-icon name="close" size="14px" @click="searchQuery = ''"  color="#fff" />
			</div>
			<div class="line"></div>
			<ul class="options-list">
				<li
					v-for="option in filteredOptions"
					:key="option.code"
					@click="selectOption(option)"
					class="option-item flex_space-between fs_12"
					:class="option.code == selectedOption?.code ? 'active' : ''"
				>
					<span>{{ option.label }}</span>
					<span>+{{ option.areaCode }}</span>
				</li>
				<li v-if="filteredOptions.length === 0" class="no-results">{{ $t(`login['没有数据']`)  }}</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

interface Option {
	code: string;
	label: string;
	areaCode: string;
}

const props = defineProps({
	phone: {
		type: String,
	},
	options: {
		type: Array<Option>,
		default:[]
	}
})
const emit = defineEmits<{
	(e: "update:modelValue", value: Object): void;
	(e: "search", query: string): void;
}>();

const searchQuery = ref("");
const isOpen = ref(false);
const selectedOption = ref<Option>(props.options[0]);
const dropdown = ref<HTMLDivElement | null>(null);

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

// Hide dropdown when clicking outside of it
const handleClickOutside = (event: MouseEvent) => {
	if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
		isOpen.value = false;
	}
};

const filterOptions = () => {
	emit("search", searchQuery.value);
};

const selectOption = (option: Option) => {
	selectedOption.value = option;
	isOpen.value = false; // Close dropdown after selection
	emit("update:modelValue", {areaCode:option.areaCode});
};

const onInput = (e: any) => {
	isOpen.value = false
	emit("update:modelValue", {phone:e.target.value});
}
const filteredOptions = computed(() => {
	return props.options.filter(
		(option:any) => option.code.toLowerCase().includes(searchQuery.value?.toLowerCase()) || option.areaCode.toLowerCase().includes(searchQuery.value?.toLowerCase())
	);
});


const selectedOptionLabel = computed(() => {
	return selectedOption.value ? selectedOption.value.areaCode : "";
});

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

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
	padding-left: 110px;
	border: none;
	height: 100%;
	border-radius: 4px;
	background-color: var(--Bg1);
	height: 46px;
	text-align: left;
	cursor: pointer;
	color: var(--Text_s);
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;

	.selectedOptionLabel {
		color: var(--Bg1);
	}
}
.selectedOption{
	position: absolute;
	display: inline-block;
	display: flex;
	align-items: center;
	top: 8px;
	bottom: 8px;
	left: 12px;
	width: 60px;
	padding-right: 8px;
	color: var(--Text_s);
	border-right: 1px solid var(--Line_2);

}
.dropdown-menu {
	position: absolute;
	top: calc(100% + 3px);
	left: 0;
	width: 100%;
	border: none;
	border-radius: 4px;
	background-color: var(--Bg1);
	z-index: 10;
	color: var(--Text2);
	padding: 0 16px;

	.input {
		background-color: var(--Bg3);
		margin: 5px 0;
		border-radius: 4px;
		padding: 0px 8px;
	}
	.line {
		height: 1px;
		background: var(--Bg3);
	}
	.search-input {
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
		height: 34px;
		outline: none;

		border-radius: 4px;
		background-color: var(--Bg3);
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
}
.option-item.active {
	color: var(--Text_s);
}

.no-results {
	padding: 8px;
	text-align: center;
}
</style>
