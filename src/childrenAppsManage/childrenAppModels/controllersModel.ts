import { ChildrenToMainCommon } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
/**
 * @description 控制器接口
 */
export interface Controller {
	/**
	 * @description 请求处理
	 */
	handleRequest(childrenToMainCommonData: ChildrenToMainCommon): void;
}
