import { MainTochildrenCommon } from "/@/ChildrenAppportAManage/childrenAppDTOs/mainToChildren/mainTochildrenCommon";
import { Controller } from "/@/ChildrenAppportAManage/childrenAppModels/controllersModel";
import pubsub from "/@/pubSub/pubSub";

/**
 * @description 处理sportA 路由跳转控制器
 */
class SportARouterChangeController implements Controller {
	public handleRequest(mainToChildrenData: MainTochildrenCommon): void {
		if (mainToChildrenData.apiName) {
			//直接映射到对应方法
			(this[mainToChildrenData.apiName as keyof SportARouterChangeController] as Function)(mainToChildrenData);
		}
	}

	/**
	 * 处理sportA路由跳转
	 * @param mainToChildrenData
	 */
	public routerChangeProcess(mainToChildrenData: MainTochildrenCommon) {
		//发送事件给视图
		console.log(mainToChildrenData, "子应用sportA路由跳转控制器 routerChangeProcess 收到数据");
		pubsub.publish(pubsub.PubSubEvents.SportAEvents.routerChangeProcessEvent.eventName, mainToChildrenData);
	}
}

export default SportARouterChangeController;
