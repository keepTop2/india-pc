import PubSubEventType from "/@/pubSub/pubSubEvents/pubSubEventType";

/**
 * @description 子应用sportA事件
 */
const SportAEvents = {
	/**
	 * @description SportA子应用要切换大容器事件
	 */
	toSportAContainer: { eventName: "SportAContainerChangeController", params: {} } as PubSubEventType<any>,

	/**
	 * @description SportA子应用要切换小容器事件
	 */
	SportAContainerToSport: { eventName: "SportAContainerToSport", params: {} } as PubSubEventType<any>,
};

export default SportAEvents;
