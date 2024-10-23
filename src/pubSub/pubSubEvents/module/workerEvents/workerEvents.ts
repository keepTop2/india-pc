import PubSubEventType from "/@/pubSub/pubSubEvents/pubSubEventType";
import { WorkerTransfer } from "/@/models/webWorkerModel";

const WorkerEvents = {
	/**
	 * @description 视图发送到线程管理器事件(主题)
	 */
	viewToWorker: { eventName: "viewToWorker", params: {} as WorkerTransfer<any, any> } as PubSubEventType<WorkerTransfer<any, any>>,

	/**
	 * @description 线程管理器发送到视图事件(主题)
	 */
	workerToView: { eventName: "workerToView", params: {} as WorkerTransfer<any, any> } as PubSubEventType<WorkerTransfer<any, any>>,
};

export default WorkerEvents;
