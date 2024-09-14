import { Controller } from "/@/childrenAppsManage/childrenAppModels/controllersModel";
import { ChildrenToMainCommon } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import ChildrenAppService from "/@/childrenAppsManage/childrenAppServices/demo_app1/childrenAppService";
/**
 * @description 控制器1 实现控制器接口
 */
class ChildrenAppController1 implements Controller {
	public handleRequest(childrenToMainCommonData: ChildrenToMainCommon) {
		// console.log(childrenToMainCommonData, "看看数据过来");
		if (childrenToMainCommonData.apiName) {
			//直接映射到对应方法
			this[childrenToMainCommonData.apiName](childrenToMainCommonData);
		}
	}

	/**
	 * @description 处理业务1
	 */
	public process1(childrenToMainCommonData: ChildrenToMainCommon) {
		//创建childrenAppService实例
		const childrenAppService = new ChildrenAppService();
		//处理业务
		childrenAppService.process1(childrenToMainCommonData);
	}
}

export default ChildrenAppController1;
