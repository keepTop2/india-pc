import { WebWorkerControllerE } from "/@/enum/webworkerEnum/webworkerControllerE";
import webworkerControllerM from "/@/maps/webworkerMap/WebworkerControllerM";
import { WorkerControllerI } from "/@/interface/WorkerControllerI";
/**
 * @description 线程控制器工厂
 */
class WebWorkerControllerFactory {
	/**
	 * @description 根据控制器类型创建具体的控制器实例
	 * @param controllerName 控制器名称
	 */
	public static createController(controllerName: WebWorkerControllerE): WorkerControllerI {
		const WorkerController = webworkerControllerM[controllerName];
		return new WorkerController();
	}
}

export default WebWorkerControllerFactory;
