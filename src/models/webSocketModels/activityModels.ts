import { webSocketMsgTopicEnum } from "/@/enum/webSocketEnum";

export interface activityModels {
	/**
	 * 唯一标记
	 */
	msgTopic: webSocketMsgTopicEnum;
	/**
	 * @description 开始时间
	 */
	data: {};
}
