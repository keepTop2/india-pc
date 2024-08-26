<template>
	<div class="from">
		<div class="logo">
			<img :src="ABA" alt="" />
		</div>

		<div class="cell mt_18">
			<div class="label">
				<span>{{ $t(`deposit['网络协议']`) }}</span>
			</div>
			<FromInput class="mt_10" type="text" readonly />
			<div class="footer mt_5">
				<span class="exchange-rate">1BTC=72,722.9USD</span>
			</div>
		</div>

		<div class="qr-code">
			<div class="label">{{ $t(`deposit['最低BTC']`, { value: 1 }) }}</div>
			<div class="code-box">
				<!-- <img src="" alt=""> -->
				<div class="code"></div>
			</div>
		</div>

		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['充值地址']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" readonly>
				<template #right>
					<SvgIcon class="ml_8" iconName="copy_icon_one" :size="16" />
				</template>
			</FromInput>
			<div class="tips">
				<span class="tips-label">{{ $t(`deposit['提示']`) }}</span>
				<span class="tips-text">{{ $t(`deposit['交易完成时的汇率可能与上述价格略有不同']`) }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ABA from '/@/assets/zh/default/wallet/ABA.png';
import FromInput from '/@/components/Input/fromInput.vue';
</script>

<style scoped lang="scss">
@import '../common.scss';

.qr-code {
	margin-top: 12px;
	.label {
		@include themeify {
			color: themed('Text1');
		}
		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
	}
	.code-box {
		padding: 16px;
		border-radius: 4px;
		@include themeify {
			background: themed('Bg2');
		}
		.code {
			width: 156px;
			height: 156px;
			margin: auto;
			background-color: #fff;
		}
	}
}

.tips {
	margin-top: 5px;
	.tips-label {
		@include themeify {
			color: themed('Warn');
		}
		font-family: 'PingFang SC';
		font-size: 12px;
		font-weight: 400;
	}
	.tips-text {
		@include themeify {
			color: themed('Text2_1');
		}
		font-family: 'PingFang SC';
		font-size: 12px;
		font-weight: 400;
	}
}
</style>
