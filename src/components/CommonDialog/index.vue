<template>
	<div v-if="modelValue" class="dialog-backdrop" :style="{ zIndex: currentZIndex }">
		<div class="dialog fade-in">
			<div class="dialog-header"></div>
			<div class="dialog-content"><slot></slot></div>
			<div class="dialog-footer"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { defineProps, defineEmits } from "vue";
const props = defineProps({
	modelValue: Boolean,
	title: {
		type: String,
		default: "",
	},
	confirm: {
		type: Function,
		default: () => {},
	},
});

const emit = defineEmits(["update:modelValue"]);
const baseZIndex = 1000;
const currentZIndex = ref(baseZIndex);
onMounted(() => {
	currentZIndex.value += document.getElementsByClassName("dialog-backdrop").length + 1;
});

const close = () => {
	// emit("update:modelValue", false);
	props.confirm();
};
</script>

<style scoped lang="scss">
.dialog-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;

	align-items: center;
	.dialog {
		position: relative;
		margin: 0 auto;
	}
}
</style>
