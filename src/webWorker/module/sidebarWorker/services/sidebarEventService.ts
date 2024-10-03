/**
 * @description 体育SSE service  业务层
 */
import sportsProcess from "/@/webWorker/module/utils/dataProcess/sportsProcess";
// import leaguesProcess from "/@/webWorker/module/utils/dataProcess/leaguesProcess";
import eventsProcess from "/@/webWorker/module/utils/dataProcess/eventsProcess";
import marketsProcess from "/@/webWorker/module/utils/dataProcess/marketsProcess";
import outrightsProcess from "/@/webWorker/module/utils/dataProcess/outrightsProcess";
// import shopCartProcess from "/@/webWorker/module/utils/dataProcess/shopCartProcess";
import { SportViewModels, Sports, WorkerToviewSport } from "/@/views/sports/models/sportViewModels";
import { SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";

import { WorkerTransfer } from "/@/models/webWorkerModel";

import { SportViewProcessWorkerCommandType, WorkerCommonCommadnType, WorkerName } from "/@/enum/workerTransferEnum";
import { WebResponse } from "/@/models/commonInterface";
import senDataMain from "/@/webWorker/module/sportViewProcessWorker/sportViewProcessWorker";
import viewSportDataU from "/@/webWorker/module/utils/viewSportDataU";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";

export default (function () {
	/**
	 * @description 体育SSE service业务处理类
	 */
	class SportEventSourceService {
		/**
		 * @description sse 消息处理业务
		 */
		public eventSourceOnMessageProcess(data: SportEventSourceResponse) {
			// console.error("第六步 对应service处理对应业务");
			// console.log("data eventSourceOnMessageProcess ===========>", data);

			if (data.payload?.sports) {
				/**
				 * 今日 早盘 滚球 冠军 都走的这里，需要将 webToPushApi 传给 senDataMain 判断 一下是否为冠军，处理冠军的赛事count展示
				 */
				const processData = sportsProcess(data, viewSportDataU.viewSportData, data.webToPushApi) as SportViewModels;
				//处理好的数据赋值给state
				viewSportDataU.viewSportData.sports = processData.viewSportData.sports as Array<Sports>;

				// console.log(viewSportDataU.viewSportData.sports, "看下头部处理");
			}

			// 处理events数据变化方法
			if (data.payload?.events) {
				const processData = eventsProcess(data, viewSportDataU.viewSportData) as SportViewModels;
				// console.log("processData===========processData", processData);
				if (data.webToPushApi === WebToPushApi.promotionsEvent) {
					viewSportDataU.viewSportData.hotEvents = processData.viewSportData.hotEvents as never[];
				} else {
					//处理好的数据赋值给state
					viewSportDataU.viewSportData.events = processData.viewSportData.events as never[];
				}
			}
			// 处理markets数据变化方法
			if (data.payload?.markets && data.sportPushApi == "GetMarkets") {
				const processData = marketsProcess(data, viewSportDataU.viewSportData) as SportViewModels;
				//处理好的数据赋值给state
				viewSportDataU.viewSportData.markets = processData.viewSportData.markets as never[];
			}
			// 处理outrights数据变化方法
			if (data.payload?.outrights) {
				const processData = outrightsProcess(data, viewSportDataU.viewSportData) as SportViewModels;
				//处理好的数据赋值给state
				viewSportDataU.viewSportData.outrights = processData.viewSportData.outrights as never[];
				// senDataMain(processData, jsonData);
			}
			//数据返回拼装
			const workerToViewData: WorkerTransfer<WorkerToviewSport, SportViewProcessWorkerCommandType> = {
				workerName: WorkerName.sidebarWorker,
				commandType: SportViewProcessWorkerCommandType.sidebarEventSource,
				data: {
					webToPushApi: data.webToPushApi,
					sportPushApi: data.sportPushApi,
					state: {
						viewSportData: {
							/**
							 * @description 外层Sports组件视图数据
							 */
							sports: viewSportDataU.viewSportData.sports,
							leagues: [],
							events: [],
							markets: [],
							outrights: viewSportDataU.viewSportData.outrights,
							results: [],
							/**
							 * @description 各个子路由视图数据
							 */
							childrenViewData: viewSportDataU.viewSportData.childrenViewData,
							promotionsViewData: viewSportDataU.viewSportData.promotionsViewData,
						},
					},
				},
			};

			// console.log(workerToViewData);
			console.warn("侧边栏 第七步 service处理完业务 往线程管理器发送");
			senDataMain(workerToViewData);
		}

		/**
		 * @description 取消loading
		 */
		public cancelLoading(data: WebResponse) {
			//数据返回拼装
			const workerToViewData: WorkerTransfer<WebResponse, WorkerCommonCommadnType> = {
				workerName: WorkerName.sidebarWorker,
				commandType: WorkerCommonCommadnType.stopLoading,
				data: data,
			};
			senDataMain(workerToViewData);
		}
	}

	return SportEventSourceService;
})();
