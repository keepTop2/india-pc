// import PubSubEventType from '/@/pubSub/pubSubEvents/pubSubEventType';
import { showOrHiddenLoginDialog } from './type'
/**
 * @description 登录模块发布订阅事件名(主题)
 */
const LoginEvents = {
	/**
	 * @description 显示隐藏登录注册弹框事件
	 */
	showOrHiddenLoginDialog: showOrHiddenLoginDialog,
};

export default LoginEvents;
