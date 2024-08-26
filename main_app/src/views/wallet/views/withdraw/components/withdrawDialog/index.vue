<template>
	<div>
		<el-dialog :model-value="props.show" :show-close="false" :align-center="true" width="480" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="close">
			<div class="deposit-dialog">
				<div class="head">
					<div class="label">{{ $t(`withdraw['提现']`) }}</div>
					<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="close" />
				</div>

				<component :is="BankCardDeposit" @submit="submit"></component>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import BankCardDeposit from './components/bankCardDeposit/bankCardDeposit.vue'; // 银行卡
// import EWallet from './components/E-wallet/E-wallet.vue'; // 电子钱包
// import BankTransfer from './components/bankTransfer/bankTransfer.vue'; // 银行卡转账
// import VirtualCurrency from './components/virtualCurrency/virtualCurrency.vue'; // 虚拟币充值
// import PaySystem from './components/paySystem/paySystem.vue'; // 支付系统

const emit = defineEmits(['close', 'finish']);
const props = withDefaults(
	defineProps<{
		show?: boolean;
	}>(),
	{ show: false }
);

const submit = () => {
	emit('finish');
};

const close = () => {
	emit('close');
};
</script>

<style scoped lang="scss">
.deposit-dialog {
	height: 100%;
	border-radius: 24px;
	@include themeify {
		background: themed('Bg1');
	}
	padding-bottom: 30px;
	box-sizing: border-box;

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28px 32px;
		.label {
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 20px;
			font-weight: 500;
		}

		.dialog_close:hover {
			@include themeify {
				color: themed('Text_s');
			}
			transform: rotate(-90deg) scale(1.05);
			transition: all 0.3s;
		}
	}
}

:deep(.el-dialog) {
	background-color: unset;
	box-shadow: unset;
	overflow: hidden;
	// max-height: calc(100% - 220px);
}
:deep(.el-dialog.is-align-center) {
	margin: 110px auto;
}
:deep(.el-dialog__body) {
	height: 100%;
}
:deep(.el-dialog__header),
:deep(.el-dialog__body) {
	margin: 0;
	padding: 0;
}
</style>
