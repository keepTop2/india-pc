<template>
	<div class="dropdown-select" ref="dropdown">
		<button class="trigger" @click="toggleDropdown">
			<span :class="selectedOptionLabel ? 'selectedOptionLabel' : ''"> {{ selectedOptionLabel || placeholder }} </span>
			<svg-icon name="arrow_right" size="14px" />
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
					:key="option.code"
					@click="selectOption(option)"
					class="option-item fs_10"
					:class="option.code == selectedOption?.code ? 'active' : ''"
				>
					{{ option.code }}
				</li>
				<li v-if="filteredOptions.length === 0" class="no-results">No results found</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

interface Option {
	code: string;
	label: string;
}

const props = defineProps<{
	options: Option[];
	placeholder?: string;
	model: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: Option | null): void;
	(e: "search", query: string): void;
}>();

const searchQuery = ref("");
const isOpen = ref(false);
const selectedOption = ref<Option | null>(null);
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
	emit("update:modelValue", option);
};

const filteredOptions = computed(() => {
	return props.options.filter((option) => option.code.toLowerCase().includes(searchQuery.value?.toLowerCase()));
});

// Watch for selected option changes to update input value
watch(selectedOption, (newVal) => {
	if (newVal) {
		searchQuery.value = newVal.code;
	} else {
		searchQuery.value = "";
	}
});

const selectedOptionLabel = computed(() => {
	return props.model ? props.model : selectedOption.value ? selectedOption.value.code : "";
});

// Add and remove global click event listener
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
	padding: 8px 12px;
	border: none;
	height: 100%;
	border-radius: 4px;
	background-color: var(--Bg1);
	text-align: left;
	cursor: pointer;
	color: var(--Text2);
	display: flex;
	justify-content: space-between;
	align-items: center;
	.selectedOptionLabel {
		color: var(--Text_s);
	}
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
