<template>
	<div>
		<div class="title">{{ $t('login["设置新密码"]') }}</div>
		<FromInput v-model="state.newPassword" class="mt_10" :type="eyeShow ? 'password' : 'text'" :placeholder="$t(`login['新密码']`)">
			<template v-slot:right>
				<SvgIcon :iconName="eyeShow ? 'eye-off' : 'eye'" :size="30" @click="eyeShow = !eyeShow" />
			</template>
		</FromInput>

		<FromInput v-model="state.confirmPassword" class="mt_10" :type="eyeShow ? 'password' : 'text'" :placeholder="$t(`login['确认密码']`)">
			<template v-slot:right>
				<SvgIcon :iconName="eyeShow ? 'eye-off' : 'eye'" :size="30" @click="eyeShow = !eyeShow" />
			</template>
		</FromInput>

		<Button :type="btnDisabled ? 'disabled' : 'default'" class="mt_18" @click="onStep()">{{ $t(`login['提交']`) }}</Button>

		<Alert class="mt_10" v-if="description" :description="description" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import Common from '/@/utils/common';
import FromInput from '/@/components/Input/fromInput.vue';
import Button from '/@/components/Button/Button.vue';
import Alert from '/@/components/Alert/index.vue';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;
const emit = defineEmits(['step']);
const eyeShow = ref(true);
const btnDisabled = ref(true);
const description = ref('');
const state = reactive({
	newPassword: '',
	confirmPassword: '',
});

watch(
	[() => state.newPassword, () => state.confirmPassword],
	([verifyCode, confirmPassword]) => {
		if (verifyCode && confirmPassword) {
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
	if (!Common.accountPassword(state.newPassword)) {
		description.value = $.t('login["密码组合"]');
		return;
	}
	if (state.newPassword !== state.confirmPassword) {
		description.value = $.t('login["密码不一致"]');
		return;
	}
	emit('step', state);
};
</script>

<style scoped lang="scss">
.title {
	@include themeify {
		color: themed('Text1');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
}
</style>
