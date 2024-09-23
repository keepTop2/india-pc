import { WorkerName } from "/@/enum/workerTransferEnum";
import { WorkerItem } from "/@/models/webWorkerModel";
// 体育视图处理线程
import sportViewProcessWorker from "/@/webWorker/module/sportViewProcessWorker/sportViewProcessWorker?worker&url";
//体育购物车处理线程
import sportShopCartProcessWorker from "/@/webWorker/module/sportShopCartProcessWorker/sportShopCartProcessWorker?worker&url";
//体育购物车处理线程
import sidebarWorker from "/@/webWorker/module/sidebarWorker/sidebarWorker?worker&url";
//彩票线程
import lotteryWorker from "/@/webWorker/module/lotteryWorker/lotteryWorker?worker&url";

/**
 * @description 线程字典
 */
export const WorkerMap = {
	/**
	 * @description 体育视图处理线程
	 */
	sportViewProcessWorker: {
		workerName: WorkerName.sportViewProcessWorker,
		url: sportViewProcessWorker,
	} as WorkerItem,

	/**
	 * @description 体育购物车处理线程
	 */
	sportShopCartProcessWorker: {
		workerName: WorkerName.sportShopCartProcessWorker,
		url: sportShopCartProcessWorker,
	} as WorkerItem,

	/**
	 * @description 侧边栏处理线程
	 */
	sidebarWorker: {
		workerName: WorkerName.sidebarWorker,
		url: sidebarWorker,
	} as WorkerItem,

	/**
	 * @description 彩票线程名称及文件路径
	 */
	lotteryWorker: {
		workerName: WorkerName.lottery,
		url: lotteryWorker,
	} as WorkerItem,
};
