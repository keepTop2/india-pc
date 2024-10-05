import { WorkerMap } from "/@/webWorker/workerMap";
import { WorkerName } from "/@/enum/workerTransferEnum";
import { WebResponse } from "/@/models/commonInterface";
import { WorkerTransfer, WorkerItem } from "/@/models/webWorkerModel";
import pubsub from "/@/pubSub/pubSub";
import ResCode from "../utils/resCode";
/**
 * @description 线程管理
 */
class WorkerManage {
	// 单例实例变量
	private static instance: WorkerManage;
	// 私有构造函数，确保单例模式
	private constructor() {
		//订阅 Sports视图发送数据事件
		pubsub.subscribe(pubsub.PubSubEvents.WorkerEvents.viewToWorker.eventName, this.viewToWorker.bind(this));
	}
	// 获取单例实例的静态方法
	public static getInstance(): WorkerManage {
		if (!WorkerManage.instance) {
			// 如果实例不存在，则创建
			WorkerManage.instance = new WorkerManage();
		}
		// 返回单例实例
		return WorkerManage.instance;
	}

	/**
	 * @description 线程池
	 */
	private workerList: Array<WorkerItem> = [];

	/**
	 * @description 最大线程数
	 */
	private maxWorkerCount: number = 5;

	/**
	 * @description 线程字典
	 */
	public WorkerMap = WorkerMap;
	public getWorkerList() {
		return this.workerList;
	}
	/**
	 * @description 启动线程
	 * @param name  线程名称
	 */
	public startWorker(workerName: WorkerName) {
		// return new Promise((resolve, reject) => {
		const resPonsedata: WebResponse = {};

		if (this.workerList.length < this.maxWorkerCount) {
			const idx = this.workerList.findIndex((item) => item.workerName == workerName);
			if (idx != -1) {
				// console.error(`已经启动该线程:${name}`);
				resPonsedata.code = ResCode.ERR;
				resPonsedata.message = "已经启动该线程";
				console.error(resPonsedata.message);
				// reject(resPonsedata);
			}
			// console.log(this.workerList, "看下线程池");
			resPonsedata.code = ResCode.SUCCESS;
			// setTimeout(() => {
			const url = this.WorkerMap[workerName].url;
			this.WorkerMap[workerName].worker = new Worker(url, {
				name: workerName,
				type: "module",
			});
			this.WorkerMap[workerName].worker!.onmessage = this.onMessage;
			this.workerList.push(this.WorkerMap[workerName]);
			//console.warn("线程启动成功", workerName);
			// resolve(resPonsedata);
			// }, 0);
		} else {
			resPonsedata.code = ResCode.ERR;
			resPonsedata.message = "超过最大线程数";
			console.error(resPonsedata.message);
			// console.error("超过最大线程数");
		}
		// });
	}

	/**
	 * @description 停止线程
	 * @param 线程名称
	 */
	public stopWorker(workerName: WorkerName): void {
		// return new Promise((resolve, reject) => {
		const resPonsedata: WebResponse = {};
		const idx = this.workerList.findIndex((item) => item.workerName == workerName);
		if (idx == -1) {
			console.error("未找到该线程");
			resPonsedata.code = ResCode.ERR;
			resPonsedata.message = "未找到该线程";
			// 匹配不到线程就退出
			return;
			// reject(resPonsedata);
		}
		//关闭线程
		this.workerList[idx]?.worker?.terminate();
		//释放主线程内存
		this.workerList[idx]!.worker = null;
		//移出线程池
		this.workerList.splice(idx, 1);
		// setTimeout(() => {
		resPonsedata.code = ResCode.SUCCESS;
		// resolve(resPonsedata);
		// }, 0);
		// });
	}

	/**
	 * @description 收到视图数据
	 */
	private viewToWorker<T1, T2>(receiverData: WorkerTransfer<T1, T2>) {
		// console.error("第三步 线程管理器收到了视图数据 准备发送到对应线程", receiverData);
		//体育视图处理线程
		// if (receiverData.workerName == WorkerName.sportViewProcessWorker) {
		//找到线程实例
		const idx = this.workerList.findIndex((item) => item.workerName == receiverData.workerName);
		if (idx != -1) {
			//json序列化
			const strData: string = JSON.stringify(receiverData);
			// Transferable Objects  允许将所有权从主线程转移到 worker 线程
			const objectToArrayBuffer: ArrayBuffer = new TextEncoder().encode(strData).buffer;
			//将数据发送到子线程
			this.workerList[idx].worker?.postMessage(objectToArrayBuffer, [objectToArrayBuffer]);
		}
		// }
	}

	/**
	 * @description 接收子线程发送到主线程的数据
	 * @param data
	 */
	public onMessage<T1, T2>(data) {
		console.error("第八步  线程管理器收到处理好的数据准备发送到视图", JSON.parse(data.data));
		const workerToViewData: WorkerTransfer<T1, T2> = JSON.parse(data.data);
		// // 将处理好的体育数据发送到Vue组件
		// if (childrenWorkerData.serverType == "sportServer") {
		// 	//处理好的数据 赋值给视图
		pubsub.PubSubEvents.WorkerEvents.workerToView.params = workerToViewData;
		pubsub.publish(pubsub.PubSubEvents.WorkerEvents.workerToView.eventName, pubsub.PubSubEvents.WorkerEvents.workerToView.params);
		// console.log(workerToViewData, "收到子线程数据");
		// 	//发布体育线子程处理好数据到Spprts组件的事件
		// pubsub.publish(pubsub.PubSubEvents.SportEvents.receiverSportWorkerData.eventName, pubsub.PubSubEvents.SportEvents.receiverSportWorkerData.params);
		// }
	}
}

/**
 * @description 线程管理
 */
const workerManage = WorkerManage.getInstance();

export default workerManage;
