/**
 * @description 线程控制器 枚举
 */
export enum WebWorkerControllerE {
	/**
	 * sportViewProcessWorkerControllers 体育视图处理线程 控制器
	 */

	/**
	 * @description 体育SSE控制器
	 */
	SportEventSourceController = "SportEventSourceController",

	/**
	 * @description 体育赔率变更控制器
	 */
	SportOddsChangeController = "SportOddsChangeController",

	/**
	 * ---------------------------------------
	 */

	/**
	 * sportShopCartProcessWorker 体育购物车线程 控制器
	 */

	/**
	 * @description 体育购物车 冠军 控制器
	 */
	SportsShopCartSSEController = "SportsShopCartSSEController",

	/**
	 * ---------------------------------------
	 */

	/**
	 *sidebarWorker
	 */
	SidebarEventControllers = "SidebarEventControllers",
	/**
	 * ---------------------------------------
	 */
}
