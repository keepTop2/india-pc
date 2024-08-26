import SportARouterChangeController from "/@/ChildrenAppportAManage/childrenAppControllers/SportARouterChangeController";
import SportAContainerChangeController from "/@/ChildrenAppportAManage/childrenAppControllers/SportAContainerChangeController";
import { ControllersEnum } from "/@/ChildrenAppportAManage/childrenAppEnums/controllersEnum";
import { Controller } from "/@/ChildrenAppportAManage/childrenAppModels/controllersModel";
// import
/**
 * @description 控制器配置类型定义
 */
type ControllerMap = {
	[key in ControllersEnum]: new () => Controller;
};

/**
 * @description 控制器枚举类映射到具体控制器类
 */
const controllerMap: ControllerMap = {
	[ControllersEnum.SportAContainerChangeController]: SportAContainerChangeController,
	[ControllersEnum.SportARouterChangeController]: SportARouterChangeController,
};

export default controllerMap;
