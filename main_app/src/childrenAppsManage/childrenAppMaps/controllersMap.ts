import { ControllersEnum } from "/@/childrenAppsManage/childrenAppEnums/controllersEnum";
import { Controller } from "/@/childrenAppsManage/childrenAppModels/controllersModel";

import ChildrenAppController1 from "/@/childrenAppsManage/childrenAppControllers/demo_app1/childrenAppController1";
import SportAContainerChangeController from "/@/childrenAppsManage/childrenAppControllers/sportAControllers/sportAContainerChangeController";
import SportAPreFetchSportAViewController from "/@/childrenAppsManage/childrenAppControllers/sportAControllers/sportAPreFetchSportAViewController";
import ToLoginOrRegisterController from "/@/childrenAppsManage/childrenAppControllers/childrenCommonControllers/toLoginOrRegisterController";
import RequestErrorCommonController from "/@/childrenAppsManage/childrenAppControllers/childrenCommonControllers/requestErrorCommonControllers";
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
	[ControllersEnum.childrenAppController1]: ChildrenAppController1,
	[ControllersEnum.SportAContainerChangeController]: SportAContainerChangeController,
	[ControllersEnum.SportAPreFetchSportAViewController]: SportAPreFetchSportAViewController,
	[ControllersEnum.ToLoginOrRegisterController]: ToLoginOrRegisterController,
	[ControllersEnum.RequestErrorCommonController]: RequestErrorCommonController,
};

export default controllerMap;
