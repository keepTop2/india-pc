import { WorkerTransfer } from "/@/models/webWorkerModel";
/**
 * @description 线程处理控制器
 */
export interface WorkerControler<Data, ApiName> {
	/**
	 * @description 请求处理
	 * @param data
	 */
	handleRequest(data: WorkerTransfer<Data, ApiName>): WorkerControler<Data, ApiName>;
}
