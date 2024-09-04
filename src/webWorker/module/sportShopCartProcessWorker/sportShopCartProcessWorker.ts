import { WorkerTransfer } from "/@/models/webWorkerModel";
import { SportShopCartProcessWorkerCommandType } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import SportEventSourceController from "/@/webWorker/module/sportShopCartProcessWorker/sportShopCartProcessWorkerControllers/sportsShopCartSSEController";
/**
 * @description 体育购物车线程
 */
export default (function () {
	/**
	 * @description 接收主线程 线程管理器消息 数据唯一入口
	 */
	onmessage = <Data, CommandType>(event) => {
		const strData: string = new TextDecoder().decode(event.data);
		const jsonData: WorkerTransfer<Data, CommandType> = JSON.parse(strData);
		// console.warn("第四步 体育线程收到了数据 到对应controller", jsonData);
		//收到体育sportEventSource 指令
		if (jsonData.commandType == SportShopCartProcessWorkerCommandType.sportsShopCartViewChanges) {
			const data: WorkerTransfer<OpenSportEventSourceParams, SportShopCartProcessWorkerCommandType> = jsonData as WorkerTransfer<
				OpenSportEventSourceParams,
				SportShopCartProcessWorkerCommandType
			>;
			const params: OpenSportEventSourceParams = {
				...data.data,
			};
			SportEventSourceController.startSEE(params);
		}

		//收到冠军购物车 outrightShopCartViewChanges 指令
		if (jsonData.commandType == SportShopCartProcessWorkerCommandType.outrightShopCartViewChanges) {
			const data: WorkerTransfer<OpenSportEventSourceParams, SportShopCartProcessWorkerCommandType> = jsonData as WorkerTransfer<
				OpenSportEventSourceParams,
				SportShopCartProcessWorkerCommandType
			>;
			const params: OpenSportEventSourceParams = {
				...data.data,
			};
			SportEventSourceController.startOutrightSEE(params);
		}
	};

	/**
	 * @description  数据唯一出口
	 * @param data
	 */
	const senDataMain = <Data, CommandType>(data: WorkerTransfer<Data, CommandType>) => {
		postMessage(JSON.stringify(data));
	};

	return senDataMain;
})();
