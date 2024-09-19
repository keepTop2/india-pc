import PubSubEvents from "./pubSubEvents/pubSubEvents";

type EventHandler = (...args: any[]) => void;

/**
 * @description 发布订阅+单例
 */
class PubSub {
	// 单例实例变量
	private static instance: PubSub;
	// 订阅者字典，键为事件名，值为回调函数数组
	private subscribers: { [event: string]: EventHandler[] };
	// 私有构造函数，确保单例模式
	private constructor() {
		// 初始化订阅者字典
		this.subscribers = {};
	}

	// 获取单例实例的静态方法
	public static getInstance(): PubSub {
		if (!PubSub.instance) {
			// 如果实例不存在，则创建
			PubSub.instance = new PubSub();
		}
		// 返回单例实例
		return PubSub.instance;
	}

	/**
	 * @description 事件名称模块集合
	 */
	public PubSubEvents = PubSubEvents;

	/**
	 * @description 订阅事件(主题)
	 * @param event 事件名(主题)
	 * @param handler 参数
	 */
	public subscribe(event: string, handler: EventHandler): void {
		// 如果事件尚未有订阅者，则创建订阅者数组
		if (!this.subscribers[event]) {
			// 将回调函数加入订阅者数组
			this.subscribers[event] = [];
		}

		this.subscribers[event].push(handler);
	}

	/**
	 * @description 取消订阅事件(主题)
	 * @param event 事件名(主题)
	 * @param handler 参数
	 * @returns
	 */
	public unsubscribe(event: string, handler: EventHandler): void {
		const handlers = this.subscribers[event];
		if (!handlers) return;
		// 查找特定回调函数在数组中的索引
		const index = handlers.indexOf(handler);
		if (index !== -1) {
			// 如果找到，则从数组中移除
			handlers.splice(index, 1);
		}
	}

	/**
	 * @description 发布事件(主题)
	 * @param event 事件名(主题)
	 * @param args 参数
	 * @returns
	 */
	public publish(event: string, ...args: any[]): void {
		// 获取特定事件的订阅者数组
		const handlers = this.subscribers[event];
		if (!handlers) return;

		handlers.forEach((handler) => {
			// 对每个订阅者执行回调函数
			handler(...args);
		});
	}
}

const pubsub = PubSub.getInstance();
export default pubsub;
