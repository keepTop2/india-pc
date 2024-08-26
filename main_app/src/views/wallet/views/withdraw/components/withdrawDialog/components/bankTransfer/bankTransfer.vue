<template>
	<div class="from">
		<div class="logo">
			<img :src="ABA" alt="" />
		</div>

		<div class="funds-info mt_32">
			<div class="activity-funds Text1">{{ $t(`withdraw['可用']`) }}<span class="Text_s">$151</span> <span class="Text2_1">(≈1,834.00USD)</span></div>
			<div class="lock-funds Text1 mt_12">{{ $t(`withdraw['锁定资金']`) }}<span class="Text_s"></span></div>
		</div>

		<div class="cell mt_19">
			<div class="label">
				<span>{{ $t(`withdraw['金额']`) }}</span>
			</div>
			<FromInput class="mt_10" type="text" :placeholder="$t(`withdraw['请输入']`)"> </FromInput>
			<div class="footer mt_5">
				<span>{{ $t(`withdraw['金额范围']`) }}</span>
				<span class="exchange-rate"></span>
			</div>
		</div>

		<div class="cell mt_12">
			<div class="label">
				<span>{{ $t(`withdraw['名字']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`withdraw['请输入']`)" />
		</div>

		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`withdraw['姓氏']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`withdraw['请输入']`)" />
		</div>

		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`withdraw['银行卡号']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`withdraw['请输入']`)" />
		</div>

		<div class="withdraw-info">
			<div class="withdraw-cell">
				<div class="label Text1">{{ $t(`withdraw['提现金额']`) }}(USDT)</div>
				<div class="value Text_s">$ {{ 0 }}</div>
			</div>
			<div class="withdraw-cell">
				<div class="label Text1">
					{{ $t(`withdraw['费用']`) }}(USDT)：<span class="Text2_1">{{ $t(`withdraw['免费提取']`, { value: 10 }) }}</span>
				</div>
				<div class="value Text_s">$ {{ 0 }}</div>
			</div>
			<div class="withdraw-cell">
				<div class="label Text1">{{ $t(`withdraw['到账总额']`) }}(USDT)</div>
				<div class="value Text_s">$ {{ 0 }}</div>
			</div>
			<div class="withdraw-cell">
				<div class="label"></div>
				<div class="value Text_s">≈¥ {{ 0 }}</div>
			</div>
		</div>

		<div class="tips">
			<span class="tip">{{ $t(`withdraw['提示']`) }}</span>
			<span class="text">{{ $t(`withdraw['交易完成时的汇率可能与上述价格略有不同']`) }}</span>
		</div>

		<Button class="from-button" :type="'default'" @click="onSubmit">{{ $t(`withdraw['立即提现']`) }}</Button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ABA from '/@/assets/zh/default/wallet/ABA.png';
import FromInput from '/@/components/Input/fromInput.vue';
import Button from '/@/components/Button/Button.vue';

const emit = defineEmits(['submit']);

const btnDisabled = ref(true);

const onSubmit = () => {
	emit('submit');
};
</script>

<style scoped lang="scss">
@import '../common.scss';
</style>
