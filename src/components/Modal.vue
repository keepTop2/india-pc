<template>
	<div class="modal-manager" v-if="modals">
		<div class="modal-content fade-in">
			<component :is="modals.component" v-bind="modals.props" @close="closeModal" />
			<span class="close_btn" @click="modalStore.closeModal()" v-if="hasCloseBtn.includes(modals.component.__name)">
				<img src="/@/assets/common/close_btn_bg.png" alt="" />
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useModalStore } from "/@/stores/modules/modalStore"; // 确保路径正确
const modalStore = useModalStore(); // 使用 Pinia store
const modals = computed(() => modalStore.modals);
const hasCloseBtn = ["LoginModal", "RegisterModal", "ForgetPassword", "setLang", "InviteFriends", "ChangePassword", "setEmail", "setPhone", "setWithdrawPwd", "FindWithdrawPwd"];
const closeModal = () => {
	modalStore.closeModal(); // 调用 store 中的 closeModal 方法
};
</script>

<style scoped lang="scss">
.modal-manager {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
	z-index: 1002; /* 确保在模态框之下 */
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	overflow: hidden;
	.modal-content {
		background-color: var(--Bg);
		border-radius: 12px;
		position: relative;
		.close_btn {
			position: absolute;
			right: 0;
			top: 0;
			height: 45px;
			img {
				height: 45px;
				cursor: pointer;
			}
		}
	}
}
</style>
