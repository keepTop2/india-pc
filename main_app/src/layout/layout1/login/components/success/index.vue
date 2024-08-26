<template>
	<!-- Modal -->
	<div class="modal-wrapper" :class="{ open: props.isModalOpen }">
		<div class="modal" @transitionend="transitionend">
			<div class="icon">
				<SvgIcon iconName="step_icon" :size="30" />
			</div>
			<div class="text">{{ text }}</div>
			<div class="btn" @click="onClose">{{ $t('login["确定"]') }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
const emit = defineEmits(['step', 'close']);

const props = withDefaults(
	defineProps<{
		isModalOpen: boolean;
		text: string;
	}>(),
	{
		isModalOpen: false,
		text: '',
	}
);

let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
	[() => props.isModalOpen],
	([isModalOpen]) => {
		if (isModalOpen) {
			// 三秒后执行逻辑
			timeoutId = setTimeout(() => {
				emit('close');
				// emit('step', 1);
			}, 3000);
		}
	},
	{
		immediate: true,
	}
);

const onClose = () => {
	clearTimeout(timeoutId);
	emit('close');
};

const transitionend = (e) => {
	if (!props.isModalOpen) {
		emit('step', 1);
	}
};
</script>

<style scoped lang="scss">
.modal-wrapper {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.1);
	visibility: hidden;
	opacity: 0;
	transition: all 0.1s ease-in-out;
}

.modal-wrapper.open {
	opacity: 1;
	visibility: visible;
}

.modal {
	width: 316px;
	height: 196px;
	display: block;
	position: relative;
	top: 50%;
	left: 50%;
	transform: translate(-50%, 50%);
	padding-top: 28px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 20px;
	opacity: 0;
	transition: all 0.5s ease-in-out;
	box-sizing: border-box;
}

.modal-wrapper.open .modal {
	margin-top: -200px;
	opacity: 1;
}

.icon {
	width: 54px;
	height: 54px;
	margin: 0px auto 0px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	@include themeify {
		background-color: themed('Theme');
	}
}

.text {
	margin-top: 8px;
	@include themeify {
		color: themed('Text_a');
	}
	text-align: center;
	font-family: 'PingFang SC';
	font-size: 20px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
}

.btn {
	width: 130px;
	height: 34px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 16px auto 0px;
	border-radius: 4px;
	@include themeify {
		background-color: themed('Theme');
	}
	color: #fff;
	text-align: center;
	font-family: 'PingFang SC';
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
}
</style>
