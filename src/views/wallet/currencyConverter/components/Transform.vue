<template>
	<div class="transform-container">
		<div class="wrapper">
			<div class="form card-style">
				<div class="balance">
					<div>从</div>
					<div>
						<svg-icon name="wallet" size="20px" />
						<span>{{ transformInfo.platAvailableAmount }}.{{ transformInfo.platCurrency }}</span>
					</div>
				</div>
				<div class="type">
					<svg-icon name="BCD" size="36px" />
					<span>{{ transformInfo.platCurrency }}</span>
				</div>
				<div class="number">
					<el-input v-model.number="formValue" type="number"></el-input>
					<div @click="formValue = transformInfo.platAvailableAmount">全部</div>
				</div>
				<div class="line"></div>
				<div class="rate none">1</div>
			</div>
			<!--			<div class="round">-->
			<svg-icon name="transform" size="50px" class="icon" />
			<!--			</div>-->
			<div class="to card-style">
				<div class="balance">
					<div>到</div>
<!--					<div>-->
<!--						<svg-icon name="wallet" size="20px" />-->
<!--						<span>{{ transformInfo.userAvailableAmount }}.{{ transformInfo.userCurrencyCode }}</span>-->
<!--					</div>-->
				</div>
				<div class="type">
					<svg-icon name="USD" size="36px" />
					<span>{{ transformInfo.userCurrencyCode }}</span>
				</div>
				<div class="number">
					<el-input v-model="toValue" readonly></el-input>
					<div></div>
				</div>
				<div class="line"></div>
				<div class="rate">汇率：{{ transformInfo.transferRate }}</div>
			</div>
		</div>
		<el-button class="transform-button" @click="handleTransform" :disabled="!formValue" color="#ff284b">一键转换</el-button>
	</div>
</template>

<script setup lang="ts">
import { walletApi } from "/@/api/wallet";
import { ElMessage } from "element-plus";
import { computed, ref } from "vue";

const formValue = ref("");
const toValue = computed(() => {
	const transferRate = transformInfo.value?.transferRate ?? 0;
	return (transferRate * Number(formValue.value)).toFixed(2);
});

// 转换信息
interface TransformInfo {
	userAccount: string; //会员ID
	platAvailableAmount: number; //平台币可用金额
	platCurrency: string; //平台币币种
	transferRate: number; //转换汇率
	userAvailableAmount: number; //用户可用金额
	userCurrencyCode: string; //用户主货币
}

const transformInfo = ref<Partial<TransformInfo>>({});
// 转换
const handleTransform = async () => {
	const res = await walletApi.transferAmount({ transferAmount: formValue.value });
	if (res.code !== 10000) return ElMessage.error(res.message);
  ElMessage.success("转账成功")
  formValue.value = ""
	await getUserPlatformBalance();
};

const getUserPlatformBalance = async () => {
	const res = await walletApi.getUserPlatformBalance();
	if (res.code !== 10000) return ElMessage.error(res.message);
	transformInfo.value = res.data;
};
getUserPlatformBalance();
</script>

<style scoped lang="scss">
.transform-container {
	width: 100%;
	overflow: hidden;

	.none {
		opacity: 0;
	}

	.wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.card-style {
		width: 100%; /* 确保元素宽度为100% */
		height: 100%;
		padding: 18px 32px;
		//padding-bottom: 0;
		overflow: hidden;

		.balance {
			display: flex;
			align-items: center;
			justify-content: space-between;

			& > div:first-child {
				font-family: "PingFang SC";
				font-size: 20px;
				color: var(--light-ok-Text-1-1, #98a7b5);
			}

			& > div:last-child {
				display: flex;
				align-items: center;
				gap: 14px;

				span {
					font-family: PingFang SC;
					font-size: 20px;
					color: var(--light-ok-text-s, #ffffff);
				}
			}
		}

		.type {
			display: flex;
			align-items: center;
			gap: 14px;
			margin-top: 18px;
			margin-bottom: 34px;

			span {
				font-family: PingFang SC;
				font-size: 24px;
				font-weight: 600;
				color: var(--light-ok-text-s, #ffffff);
			}
		}

		.number {
			display: grid;
      grid-template-columns: 1fr auto;
			align-items: center;
			justify-content: space-between;

			.el-input {
				:deep(.el-input__wrapper) {
					background-color: transparent;
					box-shadow: none;

					input {
						color: var(--light-ok-text-s, #ffffff);
						font-family: DIN Alternate;
						font-size: 30px;
						font-weight: 700;
					}
				}
			}

			& > div {
				font-family: PingFang SC;
				font-size: 18px;
				font-weight: 400;
				color: var(--light-ok-Text-1-1, #98a7b5);
        cursor: pointer;
        user-select: none;
			}
		}

		.line {
			margin-top: 10px;
			//margin-bottom: 47px;
			background: var(--light-ok-Line-2-, #373a40);
			height: 1px;
			border-radius: 4.26px 0px 0px 0px;
		}

		.rate {
			margin-top: 10px;
			//margin-bottom: 20px;
			font-family: PingFang SC;
			font-size: 12px;
			font-weight: 400;
			color: var(--light-ok-Text-1-1, #98a7b5);
		}
	}

	.form {
		background: url("../images/form.png") no-repeat;
		background-size: 100% 100%;
	}

	.icon {
		//display: flex;
		//align-items: center;
		//justify-content: center;
		position: absolute;
		left: 50%;
		top: 50.6%;
		transform: translate(-50%, -50%);
	}

	.to {
		background: url("../images/to.png") no-repeat;
		background-size: 100% 100%;
		margin-top: 10px;
	}
}
.transform-button {
	margin-top: 40px;
	width: 100%;
	height: 48px;
	padding: 16px 0px 16px 0px;
	border: none;
	gap: 10px;
	border-radius: 4px;
	background: var(--light-ok-Theme--, #ff284b);
	color: var(--light-ok-text-a, #ffffff);
	font-size: 16px;
}
</style>
