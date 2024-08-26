<template>
	<el-dialog :model-value="props.visible" :show-close="false" :align-center="true" width="480" style="height: 600px" :close-on-click-modal="false" :close-on-press-escape="false">
		<div class="deposit-dialog">
			<div class="head">
				<div class="label"></div>
				<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="emits('close')" />
			</div>

			<div class="content">
				<div class="center">
					<div class="top">
						<div class="part1">
							<el-image :src="mod === 'phone' ? phoneImage : emailImage"></el-image>
						</div>
						<div class="part2" v-if="!modalData[mod].send">
							{{ mod === "phone" ? "电话验证" : "邮箱验证" }}
						</div>
						<div class="center part3" v-else>
							我们已发送验证码至<span>{{ params.account }}</span
							>，请输入一下 6位验证码：
						</div>
						<div class="part4" v-if="!modalData[mod].send">
							{{ `在下面输入您的新${mod === "phone" ? "电话号码" : "邮箱账号"}以接收验证码。` }}
						</div>
						<div class="part5" v-else>
							{{ $t(`userDropDown['验证码有效时间']`) }}：<span>5{{ $t(`userDropDown['分钟']`) }}</span>
						</div>
					</div>
				</div>

				<!-- <div class="input-box" v-if="!modalData[mod].send">
          <el-select v-model="selectVal" popper-class="mySelectStyle" size="large">
            <template v-slot:left>
              <PhoneAreaCode :areaCode="optionList" @select="onSelection" />
            </template>
</el-select>

<el-input v-model="phone" size="large" :placeholder="`请输入您的${mod === 'phone' ? '电话' : '邮箱'}号码`"></el-input>
</div> -->
				<template v-if="!modalData[mod].send">
					<el-input v-if="mod === 'email'" class="email-input" v-model="params.account" size="large" :placeholder="`请输入您的邮箱号`"></el-input>
					<FromInput v-else v-model="params.account" class="phone-area-code-input" type="text" :placeholder="$t(`login['电话号码']`)">
						<template v-slot:left>
							<PhoneAreaCode :areaCode="areaCode" @select="onSelection" />
						</template>
					</FromInput>
				</template>

				<div v-else class="part6">
					<VerificationCode @emailCode="handleEmailCode" />
					<div class="part7">
						<div class="center error-box" v-if="!isSuccessFlag">{{ $t(`userDropDown['验证码输入错误']`) }}</div>
						<div class="center text">
							{{ modalData[mod].timeout }}秒后<span>{{ $t(`userDropDown['重发']`) }}</span>
						</div>
					</div>
				</div>
				<div class="part8">
					<el-button v-show="!modalData[mod].send" type="success" @click="sendCode" :disabled="!params.account">
						{{ $t(`userDropDown['核实']`) }}
					</el-button>
				</div>
			</div>
		</div>
	</el-dialog>

	<!--  <Dialog @close="onClose" v-model="props.visible" :title="props.title" width="480" style="height: 600px">-->
	<!--  </Dialog>-->
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import phoneImage from "/@/assets/zh/default/config/phone.svg";
import emailImage from "/@/assets/zh/default/config/email.svg";
import VerificationCode from "/@/views/userDropDown/components/verifyCodeInput.vue";
import areaCodeData from "/@/utils/country-code.json";
import Dialog from "/@/components/Dialog/Dialog.vue";
import BankTransfer from "/@/views/wallet/views/deposit/components/depositDialog/components/bankTransfer/bankTransfer.vue";
import PhoneAreaCode from "/@/layout/layout1/login/components/components/phoneAreaCode.vue";
import { userApi } from "/@/api/user/user";

const props = defineProps<{
	title?: string;
	visible: boolean;
	mod: "phone" | "email";
}>();
const emits = defineEmits(["update:visible", "close"]);
const onClose = () => {
	emits("update:visible", false);
};
const modalData = reactive({
	phone: {
		send: false,
		timeout: 60,
	},
	email: {
		send: false,
		timeout: 60,
	},
});
const send = ref(false);
const timeout = ref(60);
const sleep = (ms: number = 1000) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
const sendCode = async () => {
	const key = props.mod;
	modalData[key].send = true;
	for (let i = 59; i > 0; i--) {
		await sleep();
		modalData[key].timeout = i;
	}
	modalData[key].timeout = 60;
	modalData[key].send = false;
};
const optionList = computed(() => areaCodeData.data);
const optionListFilter = computed(() => optionList.value.filter((item) => item.cn.includes(filterVal.value)));
const areaCode = ref("+86");
const phone = ref("");
const filterVal = ref("");
const onSelection = (item: any) => {
	areaCode.value = item.code;
};
// 验证码是否输入成功标志
const isSuccessFlag = ref(true);

const params = reactive({
	account: "",
	type: computed(() => (props.mod === "phone" ? 2 : 1)),
	verifyCode: "",
});
const handleEmailCode = async (verifyCode) => {
	params.verifyCode = verifyCode;
	try {
		let res = await userApi.bindAccount(params);
		console.log(res, "res");
	} catch (err) {
		isSuccessFlag.value = false;
		console.log(err, "err");
	}
};
</script>
<style scoped lang="scss">
@import "../index";

.error-box {
	margin: auto;
	background: #ffdbdb;
	width: 336px;
	height: 28px;
	border: 1px solid #ff6666;
	color: red;
	border-radius: 6px;
}

.content {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	gap: 50px;

	.top {
		width: 80%;

		.part1 {
			margin-top: 20px;

			.el-image {
				width: 48px;
				height: 48px;
			}
		}

		.part2 {
			font-size: 18px;
			color: white;
			margin-top: 10px;
		}

		.part3 {
			margin-top: 10px;
			text-align: center;
			display: flex;
			text-wrap: nowrap;

			@include themeify {
				color: themed("Text1");
			}

			span {
				@include themeify {
					color: themed("Text_s");
				}
			}
		}

		.part4 {
			margin-top: 10px;

			@include themeify {
				color: themed("Text1");
			}
		}

		.part5 {
			margin-top: 10px;

			@include themeify {
				color: themed("Text1");
			}

			span {
				@include themeify {
					color: themed("Text_s");
				}
			}
		}

		div {
			@include center;
		}
	}

	.input-box {
		margin: auto;
		width: 80%;
		color: white;
		display: grid;
		grid-template-columns: 100px 1fr;
		align-items: center;

		:deep {
			.el-input {
				--el-color-primary: white;
				--el-input-placeholder-color: #656e78;
			}

			.el-input__wrapper {
				border-radius: 0 3px 3px 0;
				box-shadow: none;

				@include themeify {
					background: themed("Bg2");
				}
			}

			.el-select__wrapper {
				border-radius: 3px 0 0 3px;
				box-shadow: none;

				@include themeify {
					background-color: themed("Bg2");
				}

				&::after {
					content: "";
					display: inline-block;
					height: 22px;
					width: 2px;
					border-radius: 50%;
					transform: translateX(14px);

					@include themeify {
						background-color: themed("icon");
					}
				}

				.el-select__placeholder {
					@include themeify {
						color: themed("Text_s");
					}
				}
			}
		}
	}

	.phone-area-code-input {
		margin: auto;
		width: 80%;
		color: white;

		:deep(input) {
			margin-left: 10px;
		}
	}
}

.part8 {
	width: 200px;
	height: 48px;
	margin: auto;

	.el-button {
		width: 100%;
		height: 100%;
	}
}

.option-box {
	display: flex;
	align-content: center;
	justify-content: space-between;

	@include themeify {
		//background-color: themed("Bg1");
		color: themed("Text1");
	}
}

.part6 {
	display: grid !important;
	justify-content: center;

	.part7 {
		.error-box {
			//margin: 10px 0;
			margin-top: 10px;
			margin-bottom: 10px;
			border: 1px solid #ff6666;
			background-color: #ffdbdb;
			color: #ff0000;
		}

		.text {
			margin: 5px;

			span {
				@include themeify {
					color: themed("Theme");
				}
			}
		}
	}
}

.email-input {
	--el-color-primary: white;
	--el-input-placeholder-color: #656e78;
	width: 80%;
	margin: auto;

	:deep {
		.el-input__wrapper {
			border-radius: 0 3px 3px 0;
			box-shadow: none;

			@include themeify {
				background: themed("Bg2");
			}
		}

		.el-select__wrapper {
			border-radius: 3px 0 0 3px;
			box-shadow: none;

			@include themeify {
				background-color: themed("Bg2");
			}

			&::after {
				content: "";
				display: inline-block;
				height: 22px;
				width: 2px;
				border-radius: 50%;
				transform: translateX(14px);

				@include themeify {
					background-color: themed("icon");
				}
			}

			.el-select__placeholder {
				@include themeify {
					color: themed("Text_s");
				}
			}
		}
	}
}
</style>
