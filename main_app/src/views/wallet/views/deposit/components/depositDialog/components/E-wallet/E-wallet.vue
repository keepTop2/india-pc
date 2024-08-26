<template>
	<div class="from">
		<div class="logo">
			<img :src="ABA" alt="" />
		</div>

		<div class="account-info">
			<div class="account-cell">
				<div class="label">{{ $t(`deposit['账户名称']`) }}</div>
				<div class="value">
					<span>1231</span>
					<SvgIcon class="ml_8" iconName="copy_icon_one" :size="16" />
				</div>
			</div>
			<div class="account-cell">
				<div class="label">{{ $t(`deposit['账户号码']`) }}</div>
				<div class="value">
					<span>123</span>
					<SvgIcon class="ml_8" iconName="copy_icon_one" :size="16" />
				</div>
			</div>
		</div>

		<div class="cell mt_13">
			<div class="label">
				<span>{{ $t(`deposit['金额']`) }}</span>
			</div>
			<FromInput class="mt_10" type="text" :placeholder="$t(`deposit['请输入']`)">
				<template #right>
					<div class="give-away">
						<span>{{ $t(`deposit['赠送']`) }}</span>
						<span class="ml_4">${{ 10.0 }}</span>
					</div>
				</template>
			</FromInput>
			<div class="footer mt_5">
				<span>{{ $t(`deposit['金额范围']`) }}</span>
				<span class="exchange-rate"></span>
			</div>
		</div>

		<div class="quick-amount mt_12">
			<div class="label">{{ $t(`deposit['请输入或选择您的存款金额']`) }}</div>
			<div class="amount-list mt_12">
				<div class="amount-item" :class="{ 'amount-item-active': item == 1 }" v-for="item in 8" :key="item">{{ item }}</div>
			</div>
		</div>

		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['您的账户名称']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['您的账户号码']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>

		<Button class="from-button" :type="btnDisabled ? 'disabled' : 'default'">{{ $t(`deposit['立即充值']`) }}</Button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ABA from '/@/assets/zh/default/wallet/ABA.png';
import FromInput from '/@/components/Input/fromInput.vue';
import Button from '/@/components/Button/Button.vue';

const btnDisabled = ref(true);
</script>

<style scoped lang="scss">
@import '../common.scss';

.account-info {
	margin-top: 28px;
	padding: 0px 60px;
	box-sizing: border-box;

	.account-cell {
		width: 100%;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 12px;
		.label {
			@include themeify {
				color: themed('Text1');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
		}
		.value {
			display: flex;
			align-items: center;
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
		}
	}
}
.give-away {
	@include themeify {
		color: themed('Text_s');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
}
</style>
