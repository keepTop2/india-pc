<template>
	<div :class="[cls, { 'is-active': isActive }]">
		<div :class="`${cls}_header`" @click="onToggle">
			<div :class="`${cls}_title`">
				<slot name="title">{{ title }}</slot>
			</div>
		</div>
		<x-collapse-transition :visible="isActive">
			<div :class="`${cls}_content`">
				<slot></slot>
			</div>
		</x-collapse-transition>
	</div>
</template>
<script setup>
import { computed, inject } from "vue";
import XCollapseTransition from "./CollapseTransition.vue"; // 折叠动画组件
const props = defineProps({
	name: [String, Number],
	title: String,
	disabled: Boolean,
});

const emit = defineEmits(["onToggle"]);

const COLLAPSE_INJECT_KEY = "";
const collapse = inject(COLLAPSE_INJECT_KEY, ""); // 注入折叠面板组件提供的一些属性和方法
const cls = "x-collapse-item";
const idKey = computed(() => props.name); // 如果没提供name，我们生成一个key
const isActive = computed(() => !collapse.includes(idKey.value)); // 是否展开状态
function onToggle() {
	// 内容可见时隐藏，隐藏时可见
	collapse.updateModel(idKey.value);
	emit("onToggle");
}
</script>

<style lang="scss" scope>
.x-collapse-item {
	box-sizing: border-box;
}
</style>
