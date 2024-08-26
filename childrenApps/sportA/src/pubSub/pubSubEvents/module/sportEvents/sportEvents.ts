import PubSubEventType from "/@/pubSub/pubSubEvents/pubSubEventType";
import { SportViewModels } from "/@/models/sportViewModels";

const SportEvemts = {
	/**
	 * @description 子路由发送到Sports
	 */
	childrenToSports: { eventName: "childrenToSports", params: {} as SportViewModels } as PubSubEventType<SportViewModels>,

	/**
	 * @description sports发送到子路由
	 */
	sportsToChildren: { eventName: "sportsToChildren", params: {} as SportViewModels } as PubSubEventType<SportViewModels>,

	/**
	 * @description 子路由初始化视图 事件
	 */
	initChildrenView: { eventName: "initChildrenView", params: {} as SportViewModels } as PubSubEventType<SportViewModels>,

	/**
	 * @description 子路由视图数据变化 事件
	 */
	childrenViewChange: { eventName: "childrenViewChange", params: {} as SportViewModels } as PubSubEventType<SportViewModels>,
	/**
	 * @description 关注触发事件
	 */
	attentionChange: { eventName: "attentionChange", params: {} },
	/**
	 * @description 全部折叠与展开事件
	 */
	onExpandAngCollapse: { eventName: "onExpandAngCollapse", params: {} },
	/**
	 * @description 视频/动画视频全屏或关闭
	 */
	onFullScreenOrExit: { eventName: "onFullscreenOrExit", params: {} as { isFullScreen: boolean } },
};

export default SportEvemts;
