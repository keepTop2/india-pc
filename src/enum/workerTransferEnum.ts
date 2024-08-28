/**
 * @description  线程通信枚举类文件
 */

/**
 * @description 线程名称 枚举类
 */
export enum WorkerName {
	/**
	 *体育视图处理线程
	 */
	sportViewProcessWorker = "sportViewProcessWorker",

	/**
	 * @description 体育购物车处理线程
	 */
	sportShopCartProcessWorker = "sportShopCartProcessWorker",

	/**
	 * @description 彩票线程名称
	 */
	lottery = "lottery",
}

/**
 * @description 线程公用指令
 */
export enum WorkerCommonCommadnType {
	/**
	 * @description 开始loading
	 */
	startLoading = "startLoading",
	/**
	 * @description 取消loading
	 */
	stopLoading = "stopLoading",
}

/**
 * @description 体育视图处理线程 指令名称 枚举类
 */
export enum SportViewProcessWorkerCommandType {
	/**
	 * @description 体育视图处理线程 eventSource 指令
	 */
	sportEventSource = "sportEventSource",

	/**
	 * @description 体育视图处理线程 赔率变更 指令
	 */
	sportOddsChange = "sportOddsChange",
}

/**
 * @description 体育购物车处理线程 指令名称 枚举类
 */
export enum SportShopCartProcessWorkerCommandType {
	/**
	 * @description 购物车视图 eventSource 指令
	 */
	sportsShopCartViewChanges = "sportsShopCartViewChanges",
	/**
	 * @description 冠军购物车视图 eventSource 指令
	 */
	championShopCartViewChanges = "championShopCartViewChanges",
}
