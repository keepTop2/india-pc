import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息状态
import Common from "/@/utils/common";
import { ChildrenToMainCommon } from "/@/ChildrenAppportAManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import childrenAppportAManage from "/@/ChildrenAppportAManage/ChildrenAppportAManage";

export function useToLogin() {
	const store = useUserStore();

	/**
	 * @description 前往登录
	 */
	const toLogin = () => {
		const childrenToMainCommonData: ChildrenToMainCommon = {
			transactionName: "ToLoginOrRegisterController",
			apiName: "toLogin",
			data: {},
		};
		childrenAppportAManage.forceDispatch(childrenToMainCommonData);
	};

	/**
	 * @description 前往注册
	 */
	const toRegister = () => {
		const childrenToMainCommonData: ChildrenToMainCommon = {
			transactionName: "ToLoginOrRegisterController",
			apiName: "toRegister",
			data: {},
		};
		childrenAppportAManage.forceDispatch(childrenToMainCommonData);
	};

	interface TokenResponse {
		code: number;
	}
	/**
	 * @description 判断登录状态
	 * @param isLogin 是否需要登录入
	 */
	const isHaveToken = (isLogin = true) => {
		return new Promise<TokenResponse>((resolve, reject) => {
			if (!store.token) {
				if (isLogin) {
					toLogin();
				}
				reject({ code: Common.ResCode.ERR });
			} else {
				resolve({ code: Common.ResCode.SUCCESS });
			}
		});
	};

	return {
		toLogin,
		toRegister,
		isHaveToken,
	};
}
