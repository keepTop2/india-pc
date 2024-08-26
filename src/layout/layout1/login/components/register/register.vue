<template>
	<div>
		<div class="header">{{ $t(`login['注册']`) }}</div>
		<div class="from">
			<div class="tabs">
				<div class="tab" :class="{ 'tab-active': state.type == '1' }" @click="tabClick('1')">{{ $t(`login['电子邮箱']`) }}
				</div>
				<div class="tab" :class="{ 'tab-active': state.type == '2' }" @click="tabClick('2')">{{ $t(`login['电话号码']`) }}
				</div>
			</div>

			<FromInput v-if="state.type == '1'" v-model="state.email" class="mt_24" type="text"
				:placeholder="$t(`login['邮箱账号']`)" />

			<FromInput v-if="state.type == '2'" v-model="state.phone" class="mt_24 phone-area-code-input" type="text"
				:placeholder="$t(`login['电话号码']`)">
				<template v-slot:left>
					<PhoneAreaCode :areaCode="state.areaCode" @select="onSelection" @visible-change="visibleChange" />
				</template>
			</FromInput>

			<FromInput v-model="state.password" class="mt_10" :type="eyeShow ? 'password' : 'text'"
				:placeholder="$t(`login['登录密码']`)">
				<template v-slot:right>
					<SvgIcon :iconName="eyeShow ? 'eye-off' : 'eye'" :size="30" @click="eyeShow = !eyeShow" />
				</template>
			</FromInput>

			<div class="main-currency mt_10">
				<div class="select" @click.stop="currencySelectionShow = !currencySelectionShow">
					<div v-if="!state.mainCurrency" class="placeholder">{{ $t(`login['选择主货币']`) }}</div>
					<div v-if="state.mainCurrency" class="value">{{ state.mainCurrency }}</div>
					<SvgIcon class="transition_transition_0_2" :class="{ rotate_180: currencySelectionShow }" iconName="arrow"
						:size="18" />
				</div>
				<div v-on-click-outside.bubble="closeCurrencyModal"
					:style="{ height: currencySelectionShow ? '254px' : '0px', opacity: currencySelectionShow ? 1 : 0 }"
					class="select-options">
					<div :class="currencyActive == index ? 'item-active' : 'item'" v-for="(item, index) in 20" :key="item"
						@click="onSelectCurrency(item, index)">
						<span>CNY</span>
						<SvgIcon v-if="currencyActive == index" iconName="selected" :size="20" />
					</div>
				</div>
			</div>

			<div class="referral-code" @click="referralCode = !referralCode">
				<span>{{ $t('login["请输入推荐码"]') }}</span>
				<SvgIcon :class="{ rotate_180: !referralCode }" class="icon" iconName="arrow" :size="18" />
			</div>

			<FromInput v-if="referralCode" v-model="state.inviteCode" class="mt_10" type="text"
				:placeholder="$t(`login['推荐码']`)" />

			<div class="checkbox mt_12">
				<SvgIcon class="icon" :iconName="userAgreement ? 'checkboxChecked' : 'checkbox'"
					@click="userAgreement = !userAgreement" :size="18" />
				<span class="text">{{ $t(`login['我同意']`) }}</span>
				<span class="text2">{{ $t(`login['【用户协议】']`) }}</span>
				<span class="text">{{ $t(`login['并确认我已年满18岁']`) }}</span>
			</div>

			<div class="checkbox mt_10">
				<SvgIcon class="icon" iconName="checkboxChecked" :size="18" />
				<span class="text">{{ $t(`login['我同意并接受平台名称的营销促销信息']`) }}</span>
			</div>

			<Button class="mt_18" :type="btnDisabled ? 'disabled' : 'default'" @click="onNextStep(2)">{{ $t(`login['注册']`)
				}}</Button>

			<Alert class="mt_10" v-if="state.description" :description="state.description" />

			<div class="footer">
				<span class="text">{{ $t('login["已有账号？"]') }}</span>
				<span class="create" @click="onNextStep(1)">{{ $t('login["登录"]') }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import Common from '/@/utils/common';
import PhoneAreaCode from '/@/layout/layout1/login/components/components/phoneAreaCode.vue';
import Alert from '/@/components/Alert/index.vue';
import { registerApi } from '/@/api/login/register';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;

const emit = defineEmits(['step', 'toggleModal']);
const eyeShow = ref(true);
const referralCode = ref(true);
const btnDisabled = ref(true);
const currencySelectionShow = ref(false);
const userAgreement = ref(false); // 用户协议认证
const currencyActive = ref(null);

const state = reactive({
	areaCode: '+86',
	type: '1' as string, // 类型 1 邮箱 2 手机号
	phone: '',
	email: '',
	account: '', // 邮箱或者手机号
	password: '', // 密码
	mainCurrency: 'CNY', // 货币
	inviteCode: '', // 推荐码
	deviceNo: '', // 设备
	description: '',
});

watch(
	[() => state.phone, () => state.email, () => state.password, () => state.mainCurrency, () => state.type],
	([phone, email, password, mainCurrency, type]) => {
		if (type == '1') {
			if (email && password && mainCurrency) {
				btnDisabled.value = false;
			} else {
				btnDisabled.value = true;
			}
		} else {
			if (phone && password && mainCurrency) {
				btnDisabled.value = false;
			} else {
				btnDisabled.value = true;
			}
		}
	},
	{
		immediate: true,
	}
);

const onNextStep = async (active: number) => {
	// 跳转到登录组件
	if (active == 1) {
		emit('step', active);
		return;
	}

	// 校验用户协议
	if (!userAgreement.value) {
		state.description = $.t('login["请同意我们的用户协议"]');
		return;
	} else {
		state.description = '';
	}
	// 判断类型
	if (state.type == '2') {
		state.account = state.areaCode + state.phone;
	} else {
		state.account = state.email;
		// 校验邮箱
		if (!Common.emailReg(state.account)) {
			state.description = $.t('login["注册失败，请输入有效的电子邮箱"]');
			return;
		} else {
			state.description = '';
		}
	}
	// 校验密码
	if (!Common.accountPassword(state.password)) {
		state.description = $.t('login["密码为6-16位数字+字母组合"]');
		return;
	} else {
		state.description = '';
	}
	const params = {
		type: state.type,
		account: state.account,
		password: state.password,
		mainCurrency: state.mainCurrency,
		inviteCode: state.inviteCode,
		deviceNo: state.deviceNo,
	};
	const res = await registerApi.userRegister(params).catch((err: any) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		emit('step', active, state);
	}
};

// 切换tab
const tabClick = (active: string) => {
	state.type = active;
};

// 选择电话区号
const onSelection = (item: any) => {
	state.areaCode = item.code;
};

// 下拉出现隐藏
const visibleChange = (blob: boolean) => {
	if (blob) currencySelectionShow.value = false;
};

// 选择法币
const onSelectCurrency = (item: any, index: any) => {
	currencyActive.value = index;
	currencySelectionShow.value = false;
};

function closeCurrencyModal() {
	currencySelectionShow.value = false;
}
</script>

<style scoped lang="scss">
.header {
	padding: 26px 22px 30px;

	@include themeify {
		color: themed('Text_s');
	}

	font-family: 'PingFang SC';
	font-size: 20px;
	font-weight: 500;
}

.from {
	padding: 0px 32px;

	.tabs {
		display: flex;
		height: 32px;

		.tab {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;

			@include themeify {
				color: themed('Text1');
			}

			font-family: 'PingFang SC';
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			cursor: pointer;
		}

		.tab-active {
			position: relative;

			@include themeify {
				color: themed('Theme');
			}

			background: linear-gradient(180deg, rgba(59, 193, 22, 0) 35.94%, rgba(59, 193, 22, 0.25) 100%);
		}

		.tab-active::after {
			position: absolute;
			width: 100%;
			height: 100%;
			content: '';

			@include themeify {
				color: themed('Theme');
				border-color: themed('Theme');
			}

			border-bottom: 2px solid;
		}
	}

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

	.main-currency {
		position: relative;
		width: 100%;
		height: 46px;
		border-radius: 4px;

		@include themeify {
			background: themed('Bg2');
		}

		box-sizing: border-box;
		cursor: pointer;

		.select {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 13px 10px;
		}

		.placeholder {
			@include themeify {
				color: themed('Text4');
			}

			font-size: 14px;
			font-weight: 400;
		}

		.value {
			@include themeify {
				color: themed('Text_s');
			}

			font-size: 14px;
			font-weight: 400;
		}

		.select-options {
			position: absolute;
			top: calc(100% + 7px);
			width: 100%;
			max-height: 254px;
			padding: 7px;
			border-radius: 4px;
			z-index: 10;

			@include themeify {
				background: themed('Bg2');
			}

			box-sizing: border-box;
			overflow: scroll;
			transition: all 0.2s;

			.item {
				height: 40px;
				display: flex;
				align-items: center;
				padding: 10px;
				border-radius: 4px;
				box-sizing: border-box;
				border: 1px solid transparent;

				@include themeify {
					color: themed('Text1');
				}

				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
			}

			.item-active {
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px;
				border-radius: 4px;
				border: 1px solid;

				@include themeify {
					border-color: themed('Theme');
					background-color: themed('Bg1');
					color: themed('Text_s');
				}

				box-sizing: border-box;
				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
			}

			.item:hover {
				@include themeify {
					background: themed('Bg1');
				}
			}
		}
	}

	.referral-code {
		display: flex;
		align-items: center;
		margin-top: 10px;

		@include themeify {
			color: themed('Text4');
		}

		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
		cursor: pointer;

		span {
			margin-right: 6px;
		}
	}

	.checkbox {
		display: flex;
		align-items: center;

		.icon {
			margin-right: 4px;

			@include themeify {
				color: themed('Theme');
			}
		}

		.text {
			@include themeify {
				color: themed('Text4');
			}

			font-size: 14px;
			font-weight: 400;
		}

		.text2 {
			@include themeify {
				color: themed('Text_s');
			}

			font-size: 14px;
			font-weight: 400;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.footer {
		margin-top: 12px;

		.text {
			@include themeify {
				color: themed('Text4');
			}

			font-size: 14px;
			font-weight: 400;
		}

		.create {
			@include themeify {
				color: themed('Theme');
			}

			font-size: 14px;
			font-weight: 500;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>
