<template>
	<div class="from">
		<div class="logo">
			<img :src="ABA" alt="" />
		</div>

		<div class="cell mt_18">
			<div class="label">
				<span>{{ $t(`deposit['金额']`) }}</span>
			</div>
			<FromInput class="mt_10" type="text" :placeholder="$t(`deposit['请输入']`)" />
			<div class="footer mt_5">
				{{ $t(`deposit['金额范围']`) }}
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
				<span>{{ $t(`deposit['银行卡号']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['名字']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['姓氏']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['电子邮箱']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['地址']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['城市']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['邮政编码']`) }}</span>
			</div>
			<FromInput class="mt_13" type="text" :placeholder="$t(`deposit['请输入']`)" />
		</div>
		<div class="cell mt_27">
			<div class="label">
				<span>{{ $t(`deposit['国家']`) }}</span>
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
</style>
