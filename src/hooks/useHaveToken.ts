import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息状态
import { useModalStore } from "/@/stores/modules/modalStore";

export const useHaveToken = () => {
	const userStore = useUserStore();
	const modalStore = useModalStore();

	/**
	 * @description 判断用户是否有 token（即是否登录）
	 * 如果用户未登录，则弹出登录框
	 * @returns {boolean} 是否已登录
	 */
	return (): boolean => {
		if (!userStore.getUserInfo.token) {
			modalStore.openModal("LoginModal"); // 弹出登录框
			return false; // 未登录
		}
		return true; // 已登录
	};
};
