//分割
import SportEventSourceService from "/@/webWorker/module/sportViewProcessWorker/services/sportEventSourceService";
import { WorkerControllerI } from "/@/interface/WorkerControllerI";
import { WorkerTransfer } from "/@/models/webWorkerModel";
import SSEUtil from "/@/utils/webworkerUtils/SSEUtil";
//分割2

/**
 * @description 体育SSE 控制器 (工具类)
 */
class SportEventSourceController implements WorkerControllerI {
	public handleRequest(workerTransferData: WorkerTransfer<any, any>) {
		if (workerTransferData.apiName) {
			//映射对应api处理方法
			(this[workerTransferData.apiName as keyof SportEventSourceController] as Function)(workerTransferData);
		}
	}

	/**
	 * @description 体育视图处理线程 eventSource 接口
	 */
	public sportEventSource(workerTransferData: WorkerTransfer<any, any>) {
		const sseUTil: SSEUtil = new SSEUtil();
		SportEventSourceService.getInstance();
		sseUTil.openSportEventSource(workerTransferData.data);
	}
}

export default SportEventSourceController;
