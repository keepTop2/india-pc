import controllerMap from "/@/childrenAppsManage/childrenAppMaps/controllersMap";
import { ControllersEnum } from "/@/childrenAppsManage/childrenAppEnums/controllersEnum";
/**
 * @description 控制器工厂 负责生产控制器实例
 */
class ControllerFactory {
	/**
	 * @description 根据控制器类型创建具体的控制器实例
	 * @param controllerName 控制器名称
	 */
	public static createController(controllerName: ControllersEnum) {
		const Controller = controllerMap[controllerName];
		return new Controller();
	}
}

export default ControllerFactory;
