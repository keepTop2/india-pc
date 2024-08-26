import { Controller } from "/@/childrenAppsManage/childrenAppModels/controllersModel";
import { ChildrenToMainCommon } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import pubsub from "/@/pubSub/pubSub";

/**
 * @description 处理sportA去容器切换 控制器
 */
class SportAPreFetchSportAViewController implements Controller {
	handleRequest(childrenToMainCommonData: ChildrenToMainCommon): void {
		if (childrenToMainCommonData.apiName) {
			//直接映射到对应方法
			(this[childrenToMainCommonData.apiName as keyof SportAPreFetchSportAViewController] as Function)(childrenToMainCommonData);
		}
	}

	//sportA 预加载空页面加载完成
	public sportAPreFetchSportAViewMount(childrenToMainCommonData: ChildrenToMainCommon) {
		//发送事件给视图
		pubsub.publish(pubsub.PubSubEvents.PreFetchViewEvents.preFetchViewMount.eventName, childrenToMainCommonData);
	}
}

export default SportAPreFetchSportAViewController;
