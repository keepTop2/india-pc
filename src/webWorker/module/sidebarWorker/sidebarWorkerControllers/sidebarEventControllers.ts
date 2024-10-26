//分割
import SidebarEventService from "/@/webWorker/module/sidebarWorker/services/sidebarEventService";
import { WorkerControllerI } from "/@/interface/WorkerControllerI";
import { WorkerTransfer } from "/@/models/webWorkerModel";
import SSEUtil from "/@/utils/webworkerUtils/SSEUtil";

/**
 * @description 体育SSE 控制器 (工具类)
 */
class SidebarEventControllers implements WorkerControllerI {
	handleRequest<Data, ApiName>(workerTransferData: WorkerTransfer<Data, ApiName>): void {
		if (workerTransferData.apiName) {
			//映射对应api处理方法
			(this[workerTransferData.apiName as keyof SidebarEventControllers] as Function)(workerTransferData);
		}
	}

	/**
	 * @description 体育视图处理线程 eventSource 接口
	 */
	public sidebarEventSource(workerTransferData: WorkerTransfer<any, any>) {
		const sseUTil: SSEUtil = new SSEUtil();
		SidebarEventService.getInstance();
		sseUTil.openSportEventSource(workerTransferData.data);
	}
}

export default SidebarEventControllers;
