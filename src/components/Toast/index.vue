<template>
	<div v-if="visible" class="toast fs_14">
		{{ message }}
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
	message: string;
	duration: number;
}>();

const visible = ref(false);

onMounted(() => {
	visible.value = true;
	setTimeout(() => {
		visible.value = false;
	}, props.duration);
});

onUnmounted(() => {
	visible.value = false;
});
</script>

<style scoped>
.toast {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(0, 0, 0, 0.5);
	color: var(--Text-a);
	padding: 10px;
	min-width: 202px;
	border-radius: 8px;
	font-size: 14px;
	z-index: 10000;
	opacity: 1;
	transition: opacity 0.3s;
	text-align: center;
}
</style>
