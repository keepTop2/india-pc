import { Controller } from "/@/childrenAppsManage/childrenAppModels/controllersModel";
import { ChildrenToMainCommon } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import { useToLogin } from "/@/hooks/toLogin";

/**
 * @description 处理子应用去登录页 控制器
 */
class ToLoginOrRegisterController implements Controller {
	handleRequest(childrenToMainCommonData: ChildrenToMainCommon): void {
		if (childrenToMainCommonData.apiName) {
			//直接映射到对应方法
			this[childrenToMainCommonData.apiName](childrenToMainCommonData);
		}
	}

	//跳转去登录
	public toLogin(childrenToMainCommonData: ChildrenToMainCommon) {
		const { toLogin } = useToLogin();
		//发送事件给视图
		toLogin();
	}

	//跳转去注册
	public toRegister(childrenToMainCommonData: ChildrenToMainCommon) {
		const { toRegister } = useToLogin();
		//发送事件给视图
		toRegister();
	}
}

export default ToLoginOrRegisterController;
