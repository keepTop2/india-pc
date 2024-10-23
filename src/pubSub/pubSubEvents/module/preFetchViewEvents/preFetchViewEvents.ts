import PubSubEventType from "/@/pubSub/pubSubEvents/pubSubEventType";

/**
 * @description 子应用预加载页面事件
 */
const PreFetchViewEvents = {
	/**
	 * @description 子应用预加载页面渲染完成
	 */
	preFetchViewMount: { eventName: "preFetchViewMount", params: {} } as PubSubEventType<any>,
};

export default PreFetchViewEvents;
