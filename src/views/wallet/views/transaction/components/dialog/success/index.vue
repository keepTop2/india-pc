<template>
	<!-- Modal -->
	<div class="modal-wrapper" :class="{ open: props.isModalOpen }">
		<div class="modal">
			<div class="success-bg">
				<img :src="order_success" alt="" />
			</div>
			<div class="text">
				<p class="Text_s">{{ $t(`deposit['订单提交成功']`) }}</p>
				<p class="Text_s mt_10">{{ $t(`deposit['我们会尽快查看您的充值订单']`) }}</p>
			</div>

			<Button class="from-button" type="default" @click="onClose">{{ $t(`deposit['好的']`) }}</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import Button from '/@/components/Button/Button.vue';
import order_success from '/@/assets/zh/default/layout/layout1/left/wallet/order_success.png';
const emit = defineEmits(['close']);

const props = withDefaults(
	defineProps<{
		isModalOpen: boolean;
	}>(),
	{
		isModalOpen: false,
	}
);

const onClose = () => {
	emit('close');
};
</script>

<style scoped lang="scss">
.modal-wrapper {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	visibility: hidden;
	opacity: 0;
	transition: all 0.1s ease-in-out;
	text-align: center;
	z-index: 3000;
}

.modal-wrapper.open {
	opacity: 1;
	visibility: visible;
}
.modal {
	width: 408px;
	min-height: 347px;
	display: block;
	position: relative;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	@include themeify {
		background: themed('Bg1');
	}
	border-radius: 20px;
	transition: all 0.5s ease-in-out;
	box-sizing: border-box;
	.success-bg {
		position: absolute;
		top: -50%;
		left: 50%;
		transform: translate(-50%, 10%);
		width: 296px;
		height: 296px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.text {
		padding: 140px 20px 36px 20px;
	}
}

// 表单按钮
.from-button {
	width: 220px;
	height: 48px;
	margin: 0px auto 0px;
}
.Text_s {
	@include themeify {
		color: themed('Text_s');
	}
	font-family: 'PingFang SC';
	font-size: 20px;
	font-weight: 400;
}
</style>
