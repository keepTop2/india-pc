import { MainTochildrenCommon } from "/@/childrenAppsManage/childrenAppDTOs/mainToChildren/mainTochildrenCommon";
import ChildrenAppNameEnum from "/@/childrenAppsManage/childrenAppEnums/childrenAppNameEnum";
import childrenAppsManage from "/@/childrenAppsManage/childrenAppsManage";
import { SportARouterChangeDTO } from "/@/childrenAppsManage/childrenAppDTOs/mainToChildren/sportADTOS/sportARouterChangeDTO";
import microApp from "@micro-zoe/micro-app";
/**
 * @description 通知sportA 路由跳转hooks
 */
function useSportARouterChangeHooks() {
	/**
	 * @description 发消息给子应用 让子应用sportA做路由跳转
	 * @param data
	 */
	const sportARouterChange = (data: SportARouterChangeDTO) => {
		const MainTochildrenCommonData: MainTochildrenCommon = {
			name: ChildrenAppNameEnum.sportA,
			//子应用控制器名称
			transactionName: "SportARouterChangeController",
			//子应用 控制器里面具体处理方法名称
			apiName: "routerChangeProcess",
			data,
		};
		childrenAppsManage.forceSetData(ChildrenAppNameEnum.sportA, MainTochildrenCommonData);
	};

	return { sportARouterChange };
}

export default useSportARouterChangeHooks;
