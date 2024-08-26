import ChildrenAppNameEnum from "/@/ChildrenAppportAManage/childrenAppEnums/childrenAppNameEnum";

/**
 * @description 子应用向主应用发送数据
 */
export interface ChildrenToMainCommon<Data = any> {
	/**
	 * @description 子应用名称
	 */
	name?: ChildrenAppNameEnum;

	/**
	 * @description  前端业务名称 对应到某个子应用 controller
	 */
	transactionName: string;

	/**
	 * @description 接口名称
	 */
	apiName?: string;

	/**
	 * @description 发送的数据
	 */
	data?: Data;
}

/**
 * @description 子应用通知主营用路由跳转
 */
export interface ChildrenToMainRouterPush {
	/**
	 * @description 路由名称
	 */
	path: string;
}

type isLoading = "1" | "2";
/**
 * @description 子应用通知主营用loading
 */
export interface ChildrenToMainLoading {
	/**
	 * @description 1开启loading  2关闭loading
	 */
	loading: isLoading;
}
