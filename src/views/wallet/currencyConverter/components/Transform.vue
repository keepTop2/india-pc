<template>
	<div class="transform-container">
		<div class="wrapper">
			<div class="form card-style">
				<div class="balance">
					<div>从</div>
					<div>
						<svg-icon name="wallet" size="20px" />
						<span>{{ transformInfo.platAvailableAmount }} {{ transformInfo.platCurrency }}</span>
					</div>
				</div>
				<div class="type">
					<svg-icon name="BCD" size="36px" />
					<span>{{ transformInfo.platCurrency }}</span>
				</div>
				<div class="number">
					<el-input v-model.number="formValue" type="number" @input="handleInput"></el-input>
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
	const value = transferRate * Number(formValue.value);
	// 当金额大于等于1百万时，转换为K单位显示
	if (value >= 1000000) {
		return (value / 1000).toFixed(2) + "K";
	}
	return value.toFixed(2);
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

// 添加输入处理函数
const handleInput = (value: string) => {
	if (!value) return;

	// 限制最大9位数，不包含小数点
	const valueWithoutDot = value.replace(/\./g, "");
	if (valueWithoutDot.length > 9) {
		formValue.value = value.slice(0, value.length - 1);
	}

	// 转换为数字进行比较
	const numValue = Number(value);
	if (numValue > transformInfo.value?.platAvailableAmount) {
		formValue.value = String(transformInfo.value?.platAvailableAmount);
		ElMessage.warning("输入金额不能大于可用余额");
	}
};

// 转换
const handleTransform = async () => {
	const res = await walletApi.transferAmount({ transferAmount: formValue.value });
	if (res.code !== 10000) return ElMessage.error(res.message);
	ElMessage.success("转账成功");
	formValue.value = "";
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
		background: var(--Bg);  
		border-radius: 16px;
		position: relative;
		//padding-bottom: 0;
		/* overflow: hidden; */

		.balance {
			display: flex;
			align-items: center;
			justify-content: space-between;

			& > div:first-child {
				font-family: "PingFang SC";
				font-size: 20px;
				color: var(--Text-1);
			}

			& > div:last-child {
				display: flex;
				align-items: center;
				gap: 14px;

				span {
					font-family: PingFang SC;
					font-size: 20px;
					color: var(--Text-s);
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
				color: var(--Text-s);
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
						color: var(--Text-s);
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
				color: var(--Text-1);
				cursor: pointer;
				user-select: none;
			}
		}

		.line {
			margin-top: 10px;
			//margin-bottom: 47px;
			background: var(--Line-2);
			height: 1px;
			border-radius: 4.26px 0px 0px 0px;
		}

		.rate {
			margin-top: 10px;
			//margin-bottom: 20px;
			font-family: PingFang SC;
			font-size: 12px;
			font-weight: 400;
			color: var(--Text-1);
		}
	}

	.form {
		/* background: url("../images/form.png") no-repeat;
		background-size: 100% 100%; */
	

		&::after{
			$height:64px;
			content:"";
			display: block;
			position: absolute;
			width: $height;
			height: $height;
			border-radius: $height;
			background: var(--Bg-1); 
			left: 50%;
			transform: translateX(-50%);
			z-index: 1;
			bottom: -16%;
		}
	}

	.icon { 
		position: absolute;
		left: 50%;
		top: 50.2%;
		transform: translate(-50%, -50%);  
		z-index: 2;
	}

	.to { 
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
	background: var(--Theme);
	color: var(--Text-a);
	font-size: 16px;
}
</style>
