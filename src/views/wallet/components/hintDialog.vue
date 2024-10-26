<template>
	<!-- 交易密码弹窗 -->
	<div class="hint_dialog">
		<div class="dialog_header">{{ $t('wallet["温馨提示"]') }}</div>
		<div class="dialog_main">
			<p>{{ passCode ? $t('wallet["您还未设置交易密码，请先设置交易密码"]') : $t('wallet["您还未绑定手机号，请先绑定手机号"]') }}</p>
		</div>
		<div class="dialog_footer">
			<div class="cancel" @click="onCancel">{{ $t('wallet["取消"]') }}</div>
			<div class="confirm" @click="onConfirm">{{ passCode ? $t('wallet["去设置"]') : $t('wallet["去绑定"]') }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "/@/stores/modules/modalStore";
const modalStore = useModalStore();
const router = useRouter();

const passCode = ref(true);

const onCancel = () => {
	if (passCode.value) {
		passCode.value = !passCode.value;
	} else {
		modalStore.closeModal();
	}
};

const onConfirm = () => {
	router.push("/user/security_center");
	if (passCode.value) {
		modalStore.openModal("setWithdrawPwd");
	} else {
		modalStore.openModal("setPhone");
	}
};
</script>

<style scoped lang="scss">
.hint_dialog {
	width: 380px;
	border-radius: 12px;
	background-color: var(--Bg1);
	.dialog_header {
		padding: 20px;
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 20px;
		font-weight: 500;
		text-align: center;
	}
	.dialog_main {
		width: 100%;
		min-height: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0px 20px;
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 16px;
		font-weight: 400;
	}
	.dialog_footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 12px 0px 40px;
		.cancel,
		.confirm {
			width: 150px;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 16px;
			padding: 10px;
			border-radius: 4px;
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
		}
		.cancel {
			border: 1px solid var(--Theme);
			color: var(--Theme);
		}
		.confirm {
			background: var(--Theme);
			color: var(--Text_a);
		}
	}
}
</style>
