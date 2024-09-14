<template>
	<div class="x-collapse">
		<slot></slot>
	</div>
</template>
<script setup>
import { provide, ref, watch } from "vue";
const COLLAPSE_INJECT_KEY = "";
const props = defineProps({
	modelValue: [String, Array], // Vue3使用modelValue取代了Vue2中的value
	accordion: Boolean, // 是否手风琴模式，手风琴模式只能有1个面板项是展开状态
});
const emit = defineEmits(["update:modelValue", "change"]);
function emitValue(v) {
	emit("update:modelValue", v); // 与props.modelValue结合实现双向数据绑定
	emit("change", v);
}
const model = ref(props.modelValue);
watch(
	() => props.modelValue,
	(v) => (model.value = v)
);
provide(COLLAPSE_INJECT_KEY, {
	// 提供2个方法用于注入子组件，给子组件调用
	includes(v) {
		// 根据面板的key，判断是否包含该面板项
		return props.accordion ? model.value === v : (model.value || []).includes(v);
	},
	updateModel(v) {
		// 更新面板项的内容折叠和展开状态
		const { value } = model;
		if (props.accordion) {
			model.value = value === v ? null : v;
			emitValue(model.value);
		} else {
			if (!value) model.value = [];
			const index = model.value.indexOf(v);
			index > -1 ? model.value.splice(index, 1) : model.value.push(v);
			emitValue(model.value);
		}
	},
});
</script>

<style lang="scss" scoped>
.x-collapse {
	height: 100%;
}
</style>
