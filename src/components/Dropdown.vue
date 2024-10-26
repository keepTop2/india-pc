<template>
	<div class="dropdown mt_16 mb_20" ref="dropdownRef">
		<div class="dropdown-header Text_s fs_14" @click="toggleDropdown">
			<span>{{ selectedOption.text || "请选择问题类型" }}</span>
			<svg-icon :name="isOpen ? 'arrow_up' : 'arrow_down'" size="20px"></svg-icon>
		</div>
		<ul v-if="isOpen" class="dropdown-menu fs_14">
			<li class="dropdown-item" v-for="(item, index) in options" :key="index" @click="selectOption(item)" :class="item.value === selectedOption.value ? 'select' : ''">
				{{ item.text }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
const dropdownRef = ref(null);
const props = defineProps({
	options: Array as any,
	modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
onClickOutside(dropdownRef, () => {
	isOpen.value = false;
});
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
	width: 360px;
	background-color: var(--Bg2);
	color: #fff;
	border-radius: 4px;
	cursor: pointer;
}

.dropdown-header {
	padding: 14px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 34px;
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
	background-color: var(--Bg1);
	border-radius: 4px;
	list-style: none;
	padding: 0;
	margin: 0;
	z-index: 1000;
	overflow: hidden;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
	padding: 10px;
	cursor: pointer;
}
.select {
	background-color: var(--Bg2);
}

.dropdown-item:hover {
	background-color: var(--Bg2);
}
</style>
