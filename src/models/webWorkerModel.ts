/**
 * @description 线程模型
 */

import { WorkerName } from "/@/enum/webworkerEnum/workerTransferEnum";
import { WebWorkerControllerE } from "/@/enum/webworkerEnum/webworkerControllerE";

/**
 * @description 主线程与子通信模型
 */
export interface WorkerTransfer<Data = any, ApiName = any> {
	/**
	 * @description 线程名称
	 */
	workerName: WorkerName;

	/**
	 * @description 控制器名称
	 */
	controllerName: WebWorkerControllerE;

	/**
	 * @description 接口名称
	 */
	apiName: ApiName;

	/**
	 * @description 数据
	 */
	data: Data;
}

/**
 * @description 线程池对象
 */
export interface WorkerItem {
	/**
	 * @description 线程名称
	 */
	workerName: WorkerName;

	/**
	 * @description 线程文件路径
	 */
	url: string;

	/**
	 * @description 线程实例
	 */
	worker?: Worker | null;
}
