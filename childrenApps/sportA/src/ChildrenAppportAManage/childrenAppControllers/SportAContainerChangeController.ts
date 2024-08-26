import { MainTochildrenCommon } from "/@/ChildrenAppportAManage/childrenAppDTOs/mainToChildren/mainTochildrenCommon";
import { Controller } from "/@/ChildrenAppportAManage/childrenAppModels/controllersModel";
import pubsub from "/@/pubSub/pubSub";

/**
 * @description 处理sportA容器切换 控制器
 */
class SportAContainerChangeController implements Controller {
	public handleRequest(mainToChildrenData: MainTochildrenCommon): void {
		if (mainToChildrenData.apiName) {
			//直接映射到对应方法
			(this[mainToChildrenData.apiName as keyof SportAContainerChangeController] as Function)(mainToChildrenData);
		}
	}

	//跳转去大容器
	public toSportAcontainerProcess(mainToChildrenData: MainTochildrenCommon) {
		//发送事件给视图
		console.log(mainToChildrenData, "绕了一圈收到了,去视图跳转路由");
		pubsub.publish(pubsub.PubSubEvents.SportAEvents.toSportAContainer.eventName, mainToChildrenData);
	}
}

export default SportAContainerChangeController;
