<template>
	<div class="dialog-backdrop" :style="{ zIndex: currentZIndex }" v-if="visible">
		<div class="dialog fade-in">
			<div class="dialog-header fs_20 Text_s">{{ title }}</div>
			<div class="dialog-content Text1">{{ text }}</div>
			<div class="dialog-footer">
				<div class="cancel curp" @click="handleClose">{{ cancelText }}</div>
				<div class="confirm curp" @click="handleConfirm">{{ confirmText }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import router from "/@/router";
const props = defineProps({
	title: {
		type: String,
		default: "温馨提示",
	},
	text: {
		type: String,
		require: true,
	},
	cancelText: {
		type: String,
		default: "取消",
	},
	confirmText: {
		type: String,
		default: "确认",
	},
	onClose: Function,
	onConfirm: Function,
});

const visible = ref(true);
const baseZIndex = 1000;
const currentZIndex = ref(baseZIndex);

onMounted(() => {
	currentZIndex.value += document.getElementsByClassName("dialog-backdrop").length + 1;
});

watch(
	() => router.currentRoute.value.fullPath,
	() => {
		console.log(router);
		handleClose();
	}
);

const handleClose = () => {
	visible.value = false;
	if (props.onClose) props.onClose();
};

const handleConfirm = () => {
	visible.value = false;
	if (props.onConfirm) props.onConfirm();
	// handleClose();
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
	justify-content: center;
}
.dialog {
	position: relative;
	background: white;
	background: var(--Bg-1);
	padding: 0 20px 40px;
	border-radius: 20px;
	width: 380px;
	.dialog-header {
		padding: 20px;
		text-align: center;
	}
	.dialog-content {
		position: 20px;
		text-align: center;
		min-height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: pre-line;
	}
	.dialog-footer {
		display: flex;
		justify-content: space-around;
		gap: 20px;
		padding: 0 12px;
		> div {
			padding: 13px;
			flex: 1;
			text-align: center;
			border-radius: 4px;
		}
		.cancel {
			border: 1px solid var(--Theme);
			color: var(--Theme);
		}
		.confirm {
			background: var(--Theme);
			color: var(--Text-s);
		}
	}
}
</style>
