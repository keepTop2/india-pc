<template>
	<div class="max-width security_center">
		<div class="mt_28 mb_24 title">
			<svg-icon name="user-security" color="#fff" size="24px" />
			<span>安全中心</span>
		</div>
		<div class="content">
			<div @click="modifyHandle('password')">
				<span>登陆密码</span>
				<span><svg-icon name="arrow_right" size="14px" /> </span>
			</div>
			<div @click="modifyHandle('phone')">
				<span>手机号</span>
				<span v-if="userGlobalSetInfo.phone">
					<span class="info">
						<span class="mr_8">+{{ userGlobalSetInfo.areaCode }}</span> {{ userGlobalSetInfo.phone }}
					</span>
					<span class="modifyBtn">修改</span>
				</span>
				<span v-else><svg-icon name="arrow_right" size="14px" /> </span>
			</div>
			<div @click="modifyHandle('email')">
				<span>电子邮箱</span>
				<span v-if="userGlobalSetInfo.email">
					<span class="info"> {{ userGlobalSetInfo.email }} </span>
					<span class="modifyBtn">修改</span>
				</span>
				<span v-else><svg-icon name="arrow_right" size="14px" /> </span>
			</div>
			<div @click="modifyHandle('withdrawPwd')">
				<span>交易密码</span>
				<span v-if="userGlobalSetInfo.isSetPwd">
					<span class="modifyBtn">修改</span>
				</span>
				<span v-else><svg-icon name="arrow_right" size="14px" /> </span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref } from "vue";
import { useUserStore } from "/@/stores/modules/user";
import { userApi } from "/@/api/user";

interface userGlobalSetInfoType {
	areaCode: string | null;
	email: string | null;
	isSetPwd: Boolean;
	nickName: string | null;
	phone: string | null;
	userAccount: string | null;
}
const userStore = useUserStore();
const userGlobalSetInfo: userGlobalSetInfoType = reactive({
	areaCode: null,
	email: null,
	isSetPwd: false,
	nickName: null,
	phone: null,
	userAccount: null,
});

onMounted(() => {
	getUserGlobalSetInfo();

	nextTick(() => {
		getUserGlobalSetInfo();
	});
});
const getUserGlobalSetInfo = () => {
	userApi.getUserGlobalSetInfo().then((res) => {
		userStore.setUserGlobalSetInfo(res.data);
		Object.assign(userGlobalSetInfo, res.data);
	});
};

const modifyHandle = (type: string) => {
	switch (type) {
		case "password":
			modalStore.openModal("ChangePassword");
			break;
		case "phone":
			modalStore.openModal("setPhone");
			break;
		case "email":
			modalStore.openModal("setEmail");
			break;
		case "withdrawPwd":
			modalStore.openModal("setWithdrawPwd");
			break;
	}
};
</script>

<style scoped lang="scss">
.security_center {
	color: var(--Text_s);
	.title {
		font-size: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-weight: 500;
	}
	.content {
		background: var(--Bg1);
		padding: 40px 28px;
		border-radius: 12px;

		> div {
			height: 88px;
			background: var(--Bg3);
			margin-bottom: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 24px;
			border-radius: 4px;
			font-size: 16px;
			color: var(--Text1);
			cursor: pointer;
		}
		> div:hover {
			background: rgba(0, 0, 0, 0.05);
		}
		.modifyBtn {
			background: var(--Theme);
			font-size: 16px;
			border-radius: 4px;
			color: var(--Text_a);
			padding: 5px 30px;
			margin-left: 16px;
		}
	}
}

.bounce-in {
	transform: translateY(100%);
	animation: bounceIn 1s forwards;
}
</style>
