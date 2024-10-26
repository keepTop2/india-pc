import { WebWorkerControllerE } from "/@/enum/webworkerEnum/webworkerControllerE";

import { WorkerControllerI } from "/@/interface/WorkerControllerI";

import SportEventSourceController from "/@/webWorker/module/sportViewProcessWorker/sportViewProcessWorkerControllers/sportEventSourceController";
import SportOddsChangeController from "/@/webWorker/module/sportViewProcessWorker/sportViewProcessWorkerControllers/sportOddsChangeController";
import SportsShopCartSSEController from "/@/webWorker/module/sportShopCartProcessWorker/sportShopCartProcessWorkerControllers/sportsShopCartSSEController";
import SidebarEventControllers from "/@/webWorker/module/sidebarWorker/sidebarWorkerControllers/sidebarEventControllers";
/**
 * @description 控制器配置类型定义
 */
type WebworkerControllerM = {
	[key in WebWorkerControllerE]: new () => WorkerControllerI;
};

/**
 * @description 控制器枚举类映射到具体控制器类 字典
 */
const webworkerControllerM: WebworkerControllerM = {
	[WebWorkerControllerE.SportEventSourceController]: SportEventSourceController,
	[WebWorkerControllerE.SportOddsChangeController]: SportOddsChangeController,
	[WebWorkerControllerE.SportsShopCartSSEController]: SportsShopCartSSEController,
	[WebWorkerControllerE.SidebarEventControllers]: SidebarEventControllers,
};

export default webworkerControllerM;
