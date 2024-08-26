import { Controller } from "/@/childrenAppsManage/childrenAppModels/controllersModel";
import { ChildrenToMainCommon } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import pubsub from "/@/pubSub/pubSub";

/**
 * @description 处理sportA去容器切换 控制器
 */
class SportAContainerChangeController implements Controller {
	handleRequest(childrenToMainCommonData: ChildrenToMainCommon): void {
		if (childrenToMainCommonData.apiName) {
			//直接映射到对应方法
			(this[childrenToMainCommonData.apiName as keyof SportAContainerChangeController] as Function)(childrenToMainCommonData);
		}
	}

	//跳转去大容器
	public toSportAcontainerProcess(childrenToMainCommonData: ChildrenToMainCommon) {
		//发送事件给视图
		pubsub.publish(pubsub.PubSubEvents.SportAEvents.toSportAContainer.eventName, childrenToMainCommonData);
	}
}

export default SportAContainerChangeController;
