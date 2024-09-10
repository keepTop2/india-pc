import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息状态
import Common from "../utils/common";
import pubSub from "/@/pubSub/pubSub";
export function useToLogin() {
	const store = useUserStore();

	interface TokenResponse {
		code: number;
	}

	/**
	 * @description 判断登录状态
	 */
	const isHaveToken = () => {
		return new Promise<TokenResponse>((resolve, reject) => {
			if (!store.userInfo.token) {
				pubSub.publish(pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.params[1]);
				reject({ code: Common.ResCode.ERR });
				console.log("token校验失败；未登录状态");
			} else {
				resolve({ code: Common.ResCode.SUCCESS });
			}
		});
	};

	/**
	 * @description 前往登录
	 */
	const toLogin = () => {
		pubSub.publish(pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.params[1]);
	};

	/**
	 * @description 前往注册
	 */
	const toRegister = () => {
		pubSub.publish(pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.params[0]);
	};

	return {
		isHaveToken,
		toLogin,
		toRegister,
	};
}
