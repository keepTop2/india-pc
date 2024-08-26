/**
 * @description 通用事件名类型
 */
export default interface PubSubEventType<T> {
	eventName: string;
	params?: T;
}
