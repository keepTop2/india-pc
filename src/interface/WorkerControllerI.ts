import { WorkerTransfer } from "/@/models/webWorkerModel";
/**
 * @description 线程处理控制器 接口
 */
export interface WorkerControllerI {
	/**
	 * @description 请求处理映射
	 * @param data
	 */
	handleRequest<Data, ApiName>(workerTransferData: WorkerTransfer<Data, ApiName>): void;
}
