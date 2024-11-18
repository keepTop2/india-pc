<template>
	<div class="max-width security_center">
		<div class="mt_24 mb_20 title">
			<svg-icon name="user-security" color="#fff" size="24px" />
			<span> {{ $t(`security_center['安全中心']`) }}</span>
		</div>
		<div class="content">
			<div @click="modifyHandle('password')">
				<span>{{ $t(`security_center['登录密码']`) }}</span>
				<span><svg-icon name="common-arrow_right" size="14px" /> </span>
			</div>
			<div @click="modifyHandle('phone')">
				<span>{{ $t(`security_center['手机号']`) }}</span>
				<span v-if="userGlobalSetInfo.phone">
					<span class="info">
						<span class="mr_8">+{{ userGlobalSetInfo.areaCode }}</span> {{ Common.maskString(userGlobalSetInfo.phone) }}
					</span>
					<span class="modifyBtn">{{ $t(`security_center['修改']`) }}</span>
				</span>
				<span v-else><svg-icon name="common-arrow_right" size="14px" /> </span>
			</div>
			<div @click="modifyHandle('email')">
				<span>{{ $t(`security_center['电子邮箱']`) }}</span>
				<span v-if="userGlobalSetInfo.email">
					<span class="info"> {{ Common.maskEmail(userGlobalSetInfo.email) }} </span>
					<span class="modifyBtn">{{ $t(`security_center['修改']`) }}</span>
				</span>
				<span v-else><svg-icon name="common-arrow_right" size="14px" /> </span>
			</div>
			<div @click="modifyHandle('withdrawPwd')">
				<span>{{ $t(`security_center['交易密码']`) }}</span>
				<span v-if="userGlobalSetInfo.isSetPwd">
					<span class="modifyBtn">{{ $t(`security_center['修改']`) }}</span>
				</span>
				<span v-else><svg-icon name="common-arrow_right" size="14px" /> </span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref } from "vue";
import { useUserStore } from "/@/stores/modules/user";
import { userApi } from "/@/api/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import Common from "/@/utils/common";
const modalStore = useModalStore();

const userStore = useUserStore();
const userGlobalSetInfo = computed(() => userStore.getUserGlobalSetInfo);

onMounted(() => {
	getUserGlobalSetInfo();
});
const getUserGlobalSetInfo = () => {
	userApi.getUserGlobalSetInfo().then((res) => {
		userStore.setUserGlobalSetInfo(res.data);
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
	color: var(--Text-s);
	.title {
		font-size: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-weight: 500;
	}
	.content {
		background: var(--Bg-1);
		padding: 30px 28px 10px;
		border-radius: 12px;

		> div {
			height: 88px;
			background: var(--Bg-3);
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 24px;
			border-radius: 4px;
			font-size: 16px;
			color: var(--Text-1);
			cursor: pointer;
		}
		> div:hover {
			background: rgba(0, 0, 0, 0.05);
		}
		.modifyBtn {
			background: var(--Theme);
			font-size: 16px;
			border-radius: 4px;
			color: var(--Text-a);
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
