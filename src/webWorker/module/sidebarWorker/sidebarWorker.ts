import { WorkerTransfer } from "/@/models/webWorkerModel";
import { SportViewProcessWorkerCommandType } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import sidebarEventControllers from "/@/webWorker/module/sidebarWorker/sidebarWorkerControllers/sidebarEventControllers";
/**
 * @description 体育视图处理线程
 */
export default (function () {
	/**
	 * @description 接收主线程 线程管理器消息 数据唯一入口
	 */
	onmessage = <Data, ApiName>(event) => {
		const strData: string = new TextDecoder().decode(event.data);

		const jsonData: WorkerTransfer<Data, ApiName> = JSON.parse(strData);

		// console.error("第四步 体育线程收到了数据 到对应controller", jsonData);
		//收到体育sportEventSource 指令
		if (jsonData.apiName == SportViewProcessWorkerCommandType.sidebarEventSource) {
			const data: WorkerTransfer<OpenSportEventSourceParams, SportViewProcessWorkerCommandType> = jsonData as WorkerTransfer<
				OpenSportEventSourceParams,
				SportViewProcessWorkerCommandType
			>;
			const params: OpenSportEventSourceParams = {
				...data.data,
			};
			sidebarEventControllers.openSportEventSource(params);
		}
	};

	/**
	 * @description  数据唯一出口
	 * @param data
	 */
	const senDataMain = <Data, ApiName>(data: WorkerTransfer<Data, ApiName>) => {
		postMessage(JSON.stringify(data));
	};

	return senDataMain;
})();
