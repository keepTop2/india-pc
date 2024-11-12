<template>
	<div class="dropdown pl_14 pr_14" ref="dropdownRef">
		<div class="dropdown-header Text_s fs_12" @click="toggleDropdown" placeholder="">
			<span>{{ selectedOption.text || placeholder }}</span>
			<svg-icon :name="isOpen ? 'common-arrow_up' : 'common-arrow_down'" size="12px"></svg-icon>
		</div>
		<ul v-if="isOpen" class="dropdown-menu fs_12">
			<li class="dropdown-item pl_14 pr_14" v-for="(item, index) in options" :key="index" @click="selectOption(item)" :class="item.value === selectedOption.value ? 'select' : ''">
				{{ item.text }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref, watch } from "vue";
const dropdownRef = ref(null);
const props = defineProps({
	options: Array as any,
	modelValue: String,
	placeholder: String || "",
});
const emit = defineEmits(["update:modelValue"]);
onClickOutside(dropdownRef, () => {
	isOpen.value = false;
});
watch(
	() => props.options,
	() => {
		console.log(props.options, 123123);
		if (props.options) {
			selectedOption.value = props.options.find((item) => item.value == props.modelValue);
		}
	}
);
const isOpen = ref(false);
const selectedOption: any = ref("");

function toggleDropdown() {
	isOpen.value = !isOpen.value;
}

function selectOption(option: any) {
	selectedOption.value = option;
	emit("update:modelValue", option.value);
	isOpen.value = false;
}
</script>

<style scoped>
.dropdown {
	position: relative;
	max-width: 360px;
	background-color: var(--Bg-2);
	color: #fff;
	border-radius: 4px;
	cursor: pointer;
}

.dropdown-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 34px;
	width: 100%;
}

.arrow {
	transition: transform 0.3s ease;
}

.arrow.open {
	transform: rotate(180deg);
}

.dropdown-menu {
	position: absolute;
	top: 100%; /* 下拉框显示在按钮正下方 */
	left: 0;
	width: 100%;
	background-color: var(--Bg-1);
	border-radius: 4px;
	list-style: none;
	padding: 0;
	margin: 0;
	z-index: 1000;
	overflow: hidden;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
	padding: 8px 0;
	cursor: pointer;
	color: var(--Text-1);
}
.select {
	background-color: var(--Bg-2);
	color: var(--Text-s);
}

.dropdown-item:hover {
	color: var(--Text-s);
	background-color: var(--Bg-2);
}
</style>
