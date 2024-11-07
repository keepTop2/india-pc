// src/store/modalStore.ts
import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
// 定义模态框组件的类型
interface ModalComponent {
	component: any; // Vue 组件类型
	props?: Record<string, any>; // 允许传递任意属性
}
const walletCenter: Record<string, () => Promise<any>> = {
	hintDialog: () => import("/@/views/wallet/components/hintDialog.vue"),
};
const message_center: Record<string, () => Promise<any>> = {
	messageCenter: () => import("/@/views/messageCenter/index.vue"),
};
const user: Record<string, () => Promise<any>> = {
	userInfo: () => import("/@/views/user/userInfo/index.vue"),
	medal: () => import("/@/views/user/medal/index.vue"),
	vip: () => import("/@/views/user/vip/index.vue"),
	vipHierarchy: () => import("/@/views/user/vip/vipHierarchy.vue"),
};

const security_center: Record<string, () => Promise<any>> = {
	ChangePassword: () => import("/@/views/user/security_center/components/ChangePassword.vue"),
	setEmail: () => import("/@/views/user/security_center/components/setEmail.vue"),
	setPhone: () => import("/@/views/user/security_center/components/setPhone.vue"),
	setWithdrawPwd: () => import("/@/views/user/security_center/components/setWithdrawPwd.vue"),
	FindWithdrawPwd: () => import("/@/views/user/security_center/components/FindWithdrawPwd.vue"),
};
// 活动弹窗
const activityModal: Record<string, () => Promise<any>> = {
	RED_BAG_RAIN: () => import("/@/views/activity/activityType/RED_BAG_RAIN/index.vue"),
	FIRST_DEPOSIT: () => import("/@/views/activity/activityType/FIRST_DEPOSIT.vue"),
	SECOND_DEPOSIT: () => import("/@/views/activity/activityType/SECOND_DEPOSIT.vue"),
	FREE_WHEEL: () => import("/@/views/activity/activityType/FREE_WHEEL.vue"),
	ASSIGN_DAY: () => import("/@/views/activity/activityType/ASSIGN_DAY.vue"),
	LOSS_IN_SPORTS: () => import("/@/views/activity/activityType/LOSS_IN_SPORTS.vue"),
	RECHARGE_BONUS: () => import("/@/views/activity/activityType/RECHARGE_BONUS.vue"),
	DAILY_COMPETITION: () => import("/@/views/activity/activityType/DAILY_COMPETITION/index.vue"),
	SPIN_WHEEL: () => import("../../views/activity/activityType/SPIN_WHEEL/index.vue"),
	TASK: () => import("../../views/activity/activityType/TASK/index.vue"),
};

// 定义可用的模态框组件
const modalComponents: Record<string, () => Promise<any>> = {
	LoginModal: () => import("/@/views/loginModal/LoginModal.vue"),
	RegisterModal: () => import("/@/views/loginModal/RegisterModal.vue"),
	ForgetPassword: () => import("/@/views/loginModal/ForgetPassword.vue"),
	setLang: () => import("../../views/loginModal/setLang.vue"),
	InviteFriends: () => import("/@/views/user/invite_friends/InviteFriends.vue"),
	...activityModal,
	...security_center,
	...walletCenter, // 钱包弹窗
	...user,
	...message_center,
};

// 创建 Pinia store
export const useModalStore = defineStore("modal", () => {
	const modals = ref<ModalComponent | null>(null);
	const modalCache = new Map<string, any>(); // 缓存已加载的组件
	// 打开模态框
	const openModal = async (modalName: string, props: Record<string, any> = {}) => {
		if (modalCache.has(modalName)) {
			const cachedModal = modalCache.get(modalName);
			modals.value = { component: cachedModal, props };
		} else {
			const modalComponent = modalComponents[modalName];
			if (modalComponent) {
				const component = await modalComponent();
				modalCache.set(modalName, component.default);
				modals.value = { component: shallowRef(component.default), props };
			}
		}
	};

	// 关闭模态框
	const closeModal = () => {
		modals.value = null;
	};

	return { modals, openModal, closeModal };
});
