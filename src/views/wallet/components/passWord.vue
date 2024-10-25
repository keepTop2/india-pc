<template>
	<div>
		<!-- 交易密码 -->
		<CommonDialog v-model="props.modelValue">
			<div class="container">
				<div class="header">
					<span>{{ $t('wallet["交易密码"]') }}</span>
					<!-- 关闭按钮 -->
					<i @click="handleClose">
						<svg-icon class="icon" name="close" />
					</i>
				</div>
				<div class="main">
					<div class="cell">
						<input v-model="password" @input="onPasswordInput" type="text" maxlength="6" />
					</div>
				</div>
				<!-- 确认按钮 -->
				<div class="button" @click="handleConfirm">{{ $t('wallet["立即提款"]') }}</div>
				<div class="tips">
					<span class="curp" @click="router.push('/user/security_center')">{{ $t('wallet["忘记密码"]') }}</span>
				</div>
			</div>
		</CommonDialog>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

// 路由和 props 定义
const router = useRouter();
const props = defineProps<{
	modelValue?: boolean;
	password?: string;
}>();

// 事件 emit 定义
const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "update:password", value: string): void;
	(e: "confirm", password: string): void;
}>();

// 内部管理 password
const password = ref(props.password || "");

// 监听 props.password 的变化
watch(
	() => props.password,
	(newPassword) => {
		password.value = newPassword || "";
	}
);

// 监听输入框变化
function onPasswordInput() {
	emit("update:password", password.value);
}

// 关闭按钮处理函数
function handleClose() {
	emit("update:modelValue", false);
}

// 确认按钮处理函数
function handleConfirm() {
	emit("confirm", password.value);
}
</script>

<style scoped lang="scss">
.container {
	width: 380px;
	background-color: var(--Bg1);
	border-radius: 12px;
	overflow: hidden;
	.header {
		position: relative;
		padding: 24px;
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 20px;
		font-weight: 500;
		box-sizing: border-box;

		i {
			position: absolute;
			top: 0px;
			right: 0px;
			display: block;
			width: 77px;
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom-left-radius: 12px;
			background-color: var(--Bg2);
			cursor: pointer;
			.icon {
				width: 30px;
				height: 30px;
			}
		}
	}
	.main {
		padding: 40px 34px;
		.cell {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			padding: 10px 12px;
			border-radius: 4px;
			background: var(--Bg2);
			overflow: hidden;
			input {
				flex: 1;
				height: 100%;
				background: var(--Bg2);
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				margin: 0px;
				padding: 0px;
				border: 0;
			}
		}
	}

	.button {
		width: 178px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		border-radius: 4px;
		background: var(--Theme, #ff284b);
		color: var(--Text_a);
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
	}
	.tips {
		margin-top: 10px;
		margin-bottom: 10px;
		text-align: center;
		color: var(--Theme, #ff284b);
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
	}
}
</style>
