import SportEvents from "./module/sportEvents/sportEvents";
import LotteryEvents from "./module/lotteryEvents/lotteryEvents";
import TaskEvents from "./module/taskEvents/taskEvents";
import WorkerEvents from "./module/workerEvents/workerEvents";
import PreFetchViewEvents from "/@/pubSub/pubSubEvents/module/preFetchViewEvents/preFetchViewEvents";
/**
 * @description 统一订阅事件(主题)出口
 */
const PubSubEvents = {
	/**
	 * @description — 抽奖发布订阅事件名(主题)
	 */
	LotteryEvents: LotteryEvents,
	/**
	 * @description — 任务订阅事件名
	 */
	TaskEvents,
	/**
	 * @description -体育事件
	 */
	SportEvents,
	/**
	 * @description -线程事件
	 */
	WorkerEvents,
	/**
	 * @description 子页面预加载页面事件
	 */
	PreFetchViewEvents,
};

export default PubSubEvents;
