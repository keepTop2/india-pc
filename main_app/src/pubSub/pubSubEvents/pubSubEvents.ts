import LoginEvents from "./module/loginEvents/loginEvents";

import LotteryEvents from "./module/lotteryEvents/lotteryEvents";
import TaskEvents from "./module/taskEvents/taskEvents";
import SportAEvents from "./module/sportAEvents/sportAEvents";
import PreFetchViewEvents from "/@/pubSub/pubSubEvents/module/preFetchViewEvents/preFetchViewEvents";
/**
 * @description 统一订阅事件(主题)出口
 */
const PubSubEvents = {
	/**
	 * @description — 登录模块发布订阅事件名(主题)
	 */
	LoginEvents,
	/**
	 * @description — 抽奖发布订阅事件名(主题)
	 */
	LotteryEvents: LotteryEvents,
	/**
	 * @description — 任务订阅事件名
	 */
	TaskEvents,
	/**
	 * @description 体育子应用A事件
	 */
	SportAEvents,
	/**
	 * @description 子页面预加载页面事件
	 */
	PreFetchViewEvents,
};

export default PubSubEvents;
