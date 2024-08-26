<template>
	<div>
		<div class="tips-title">{{ $t('login["请输入注册手机号"]') }}</div>

		<FromInput v-model="fromParams.phone" class="mt_18 phone-area-code-input" type="text" :placeholder="$t(`login['电话号码']`)">
			<template v-slot:left>
				<PhoneAreaCode :areaCode="fromParams.areaCode" @select="onSelection" />
			</template>
		</FromInput>
		<Button class="mt_18" :type="btnDisabled ? 'disabled' : 'default'" @click="onStep()">{{ $t(`login['下一步']`) }}</Button>
		<Alert class="mt_10" v-if="description" :description="description" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import FromInput from '/@/components/Input/fromInput.vue';
import PhoneAreaCode from '/@/layout/layout1/login/components/components/phoneAreaCode.vue';
import Button from '/@/components/Button/Button.vue';
import Alert from '/@/components/Alert/index.vue';

const emit = defineEmits(['step']);

const btnDisabled = ref(true);
const description = ref('');

const fromParams = reactive({
	areaCode: '+86',
	phone: '',
});
const state = reactive({
	account: '',
});

watch(
	[() => fromParams.phone],
	([phone]) => {
		if (phone) {
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
	// 校验手机
	// if (!Common.emailReg(state.account)) {
	// 	description.value = $.t('login["电子邮箱不正确"]');
	// 	return;
	// }
	state.account = fromParams.areaCode + fromParams.phone;
	emit('step', state);
};

// 选择区号
const onSelection = (item: any) => {
	fromParams.areaCode = item.code;
};
</script>

<style scoped lang="scss">
.phone-area-code-input {
	position: relative;
	:deep(input) {
		margin-left: 10px;
	}
}

.phone-area-code {
	display: flex;
	align-items: center;
	@include themeify {
		color: themed('Text_s');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
	cursor: pointer;

	i {
		display: block;
		width: 1px;
		height: 20px;
		@include themeify {
			background: themed('Line');
		}
		margin-left: 10px;
	}
}

.area-code-selection {
	position: absolute;
	top: calc(100% + 6px);
	left: 0;
	width: 100%;
	max-height: 287px;
	@include themeify {
		background-color: themed('Bg2');
	}
	transition: all 0.2s;
	border-radius: 4px;
	z-index: 10;
	overflow: hidden;
	.selection-header {
		height: 46px;
		border-bottom: 1px solid;
		@include themeify {
			border-color: themed('Line');
		}
	}

	.selection-options {
		max-height: calc(100% - 47px);
		padding: 0px 7px;
		overflow: scroll;

		.cell {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 8px;
			border-radius: 4px;
			box-sizing: border-box;
			border: 1px solid transparent;
			@include themeify {
				color: themed('Text1');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
			cursor: pointer;
		}

		.cell-active {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 8px;
			border-radius: 4px;
			box-sizing: border-box;
			border: 1px solid;
			@include themeify {
				border-color: themed('Theme');
				background-color: themed('Bg1');
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
			cursor: pointer;
		}

		.cell:hover {
			@include themeify {
				background-color: themed('Bg1');
			}
		}
	}
}
</style>
