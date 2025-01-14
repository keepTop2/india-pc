/**
 * @description 线程模型
 */

import { WorkerName } from "../../../enum/webworkerEnum/workerTransferEnum";
/**
 * @description 主线程与子通信模型
 */
export interface WorkerTransfer<Data, ApiName> {
	/**
	 * @description 线程名称
	 */
	workerName: WorkerName;

	/**
	 * @description 指令名称
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
