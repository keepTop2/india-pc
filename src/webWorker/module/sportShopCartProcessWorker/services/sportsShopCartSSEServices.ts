/**
 * @description 体育SSE service  业务层
 */

import shopCartProcess from "/@/webWorker/module/utils/dataProcess/shopCartProcess";
import shopOutrightProcess from "/@/webWorker/module/utils/dataProcess/shopOutrightProcess";
import { WorkerToViewSportsShopCart } from "/@/views/sports/models/sportViewModels";
import { SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";

import { WorkerTransfer } from "/@/models/webWorkerModel";

import { SportShopCartProcessWorkerCommandType, WorkerName } from "/@/enum/workerTransferEnum";
// import { WebResponse } from "/@/models/commonInterface";
import senDataMain from "/@/webWorker/module/sportShopCartProcessWorker/sportShopCartProcessWorker";

export default (function () {
	/**
	 * @description 体育购物车SSE service业务处理类
	 */
	class SportsShopCartSSEServices {
		/**
		 * @description 购物车sse 消息处理业务
		 */
		public startSEEProcess(data: SportEventSourceResponse) {
			// console.log("第六步 对应service处理对应业务");

			const processData = shopCartProcess(data) as Array<any>;
			// console.log("processData---------------->", processData);

			// senDataMain(processData, jsonData);
			// console.log(workerToViewData);
			// console.warn("第七步 service处理完业务 往线程管理器发送");
			//数据返回拼装
			const workerToViewData: WorkerTransfer<WorkerToViewSportsShopCart<any>, SportShopCartProcessWorkerCommandType> = {
				workerName: WorkerName.sportShopCartProcessWorker,
				commandType: SportShopCartProcessWorkerCommandType.sportsShopCartViewChanges,
				data: {
					webToPushApi: data.webToPushApi,
					sportPushApi: data.sportPushApi,
					data: processData,
				},
			};
			senDataMain(workerToViewData);
		}

		/**
		 * @description 冠军购物车sse 消息处理业务
		 */
		public startOutrightSEEProcess(data: SportEventSourceResponse) {
			// console.log("第六步 对应service处理对应业务");

			const processData = shopOutrightProcess(data) as Array<any>;
			// console.log("processData---------------->", processData);

			// senDataMain(processData, jsonData);
			// console.log(workerToViewData);
			// console.warn("第七步 service处理完业务 往线程管理器发送");
			//数据返回拼装
			const workerToViewData: WorkerTransfer<WorkerToViewSportsShopCart<any>, SportShopCartProcessWorkerCommandType> = {
				workerName: WorkerName.sportShopCartProcessWorker,
				commandType: SportShopCartProcessWorkerCommandType.outrightShopCartViewChanges,
				data: {
					webToPushApi: data.webToPushApi,
					sportPushApi: data.sportPushApi,
					data: processData,
				},
			};
			senDataMain(workerToViewData);
		}
	}

	return SportsShopCartSSEServices;
})();
