import { Controller } from "/@/childrenAppsManage/childrenAppModels/controllersModel";
import { ChildrenToMainCommon } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import { useRequestError } from "/@/hooks/requestError";

/**
 * @description 处理子应用去登录页 控制器
 */
class RequestErrorCommonController implements Controller {
	handleRequest(childrenToMainCommonData: ChildrenToMainCommon): void {
		if (childrenToMainCommonData.apiName) {
			//直接映射到对应方法
			this[childrenToMainCommonData.apiName](childrenToMainCommonData);
		}
	}

	public requestErrorCommon(childrenToMainCommonData: ChildrenToMainCommon) {
		const { handleRequestError } = useRequestError();
		handleRequestError({
			name: childrenToMainCommonData.name,
			res: childrenToMainCommonData.data.res,
		});
	}
}

export default RequestErrorCommonController;
