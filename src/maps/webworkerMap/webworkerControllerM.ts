import { WebWorkerControllerE } from "/@/enum/webworkerEnum/webworkerControllerE";

import { WorkerControllerI } from "/@/interface/workerControllerI";

import SportEventSourceController from "/@/webWorker/module/sportViewProcessWorker/sportViewProcessWorkerControllers/sportEventSourceController";

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
};

export default webworkerControllerM;
