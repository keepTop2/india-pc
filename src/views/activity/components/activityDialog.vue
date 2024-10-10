<template>
	<div v-if="modelValue" class="dialog-backdrop" :style="{ zIndex: currentZIndex }">
		<div class="dialog fade-in">
			<div class="dialog-header">
				<img src="./image/header.png" alt="" />
				<div class="Text3 fs_16">{{ title }}</div>
			</div>
			<div class="dialog-content fs_14">
				<slot></slot>
			</div>
			<div class="dialog-footer">
				<button class="common_btn" @click="confirm">
					<slot name="footer"> 确认 </slot>
				</button>
			</div>
		</div>
		<div class="closeDialog" @click="close">
			<img src="../activityType/image/close.png" alt="" />
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
const confirm = () => {
	props.confirm();
};
const close = () => {
	emit("update:modelValue", false);
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
	flex-direction: column;
	justify-content: center;
	.dialog {
		position: relative;
		margin: 0 auto;
		width: 310px;
		padding-bottom: 10px;
		.dialog-header {
			text-align: center;
			height: 101px;
			background: url("./image/image.png") no-repeat;
			background-size: 100% 100%;
			font-weight: 500;
			img {
				height: 124px;
				margin-top: -46px;
			}
		}
		.dialog-content {
			padding: 20px;
			background: white;
			text-align: center;
			color: var(--Text3);
		}
		.dialog-footer {
			background: white;
			border-bottom-left-radius: 24px;
			border-bottom-right-radius: 24px;
			width: 100%;
			text-align: center;
			padding: 0 20px 20px;
			.common_btn {
				width: 158px;
				height: 46px;
				margin: 0 auto;
				font-size: 14px;
				border-radius: 10px;
				background: linear-gradient(278deg, #ff284b 4.74%, #fd677f 92.73%);
			}
		}
	}
	.closeDialog {
		img {
			width: 32px;
			height: 32px;
			cursor: pointer;
		}
	}
}
</style>
