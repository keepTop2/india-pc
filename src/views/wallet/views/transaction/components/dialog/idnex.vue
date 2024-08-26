<template>
	<div>
		<el-dialog :model-value="props.show" :show-close="false" :align-center="true" width="480" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="close">
			<div class="deposit-dialog">
				<div class="head">
					<div class="label">{{ $t(`transaction['交易明细']`) }}</div>
					<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="close" />
				</div>

				<component :is="fiatCurrencySelfOperated" @openCertificate="openCertificate"></component>
			</div>
		</el-dialog>

		<!-- 上传凭证 -->
		<UploadCertificateDialog :show="innerVisible" @close="innerVisible = false" @closed="isModalOpen = true" />
		<!-- 成功 -->
		<Success :isModalOpen="isModalOpen" @close="isModalOpen = false" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import virtualCurrency from '../dialog/withdraw/virtualCurrency/virtualCurrency.vue'; // 虚拟币提现
// import fiatCurrencySelfOperated from '../dialog/withdraw/fiatCurrencySelfOperated/fiatCurrencySelfOperated.vue'; // 法币自营提现
// import fiatCurrencyTripartite from '../dialog/withdraw/fiatCurrencyTripartite/fiatCurrencyTripartite.vue'; // 法币三方提现
// import virtualCurrency from '../dialog/deposit/virtualCurrency/virtualCurrency.vue'; // 虚拟币充值
import fiatCurrencySelfOperated from '../dialog/deposit/fiatCurrencySelfOperated/fiatCurrencySelfOperated.vue'; // 法币自营充值
import UploadCertificateDialog from '../dialog/uploadCertificate/uploadCertificate.vue';
import Success from '../dialog/success/index.vue';

const emit = defineEmits(['close', 'finish']);
const props = withDefaults(
	defineProps<{
		show?: boolean;
	}>(),
	{ show: false }
);

const innerVisible = ref(false);
const isModalOpen = ref(false);

// 打开凭证
const openCertificate = () => {
	innerVisible.value = true;
};

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
