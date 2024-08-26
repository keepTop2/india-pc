<template>
	<div>
		<div class="tips-title">{{ $t('login["请输入注册邮箱账号"]') }}</div>
		<FromInput v-model="state.account" class="mt_18" type="text" :placeholder="$t(`login['邮箱账号']`)" />
		<Button class="mt_18" :type="btnDisabled ? 'disabled' : 'default'" @click="onStep()">{{ $t(`login['下一步']`) }}</Button>
		<Alert class="mt_10" v-if="description" :description="description" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import FromInput from '/@/components/Input/fromInput.vue';
import Button from '/@/components/Button/Button.vue';
import Alert from '/@/components/Alert/index.vue';
import Common from '/@/utils/common';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;

const emit = defineEmits(['step']);

const btnDisabled = ref(true);
const description = ref('');

const state = reactive({
	account: '',
});

watch(
	[() => state.account],
	([account]) => {
		if (account) {
			btnDisabled.value = false;
		} else {
			btnDisabled.value = true;
		}
	},
	{
		immediate: true,
	}
);

const onStep = () => {
	// 校验邮箱
	if (!Common.emailReg(state.account)) {
		description.value = $.t('login["电子邮箱不正确"]');
	} else {
		description.value = '';
	}
	emit('step', state);
};
</script>

<style scoped lang="scss">
.tips-title {
	@include themeify {
		color: themed('Text1');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
}
</style>
