// import microApp from "@micro-zoe/micro-app";
import { RenderAppOptions, UnmountAppParams, ChildrenToMainDataListItem, PreFetchApp } from "/@/childrenAppsManage/childrenAppModels/childrenAppsManageModel";
import { MainTochildrenCommon, MainToChildrenGlobal } from "/@/childrenAppsManage/childrenAppDTOs/mainToChildren/mainTochildrenCommon";
import { ChildrenToMainCommon, ChildrenToMainRouterPush, ChildrenToMainLoading } from "/@/childrenAppsManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import ChildrenAppNameEnum from "/@/childrenAppsManage/childrenAppEnums/childrenAppNameEnum";
import { TransactionNameCommonEnum } from "/@/childrenAppsManage/childrenAppEnums/transactionNameCommonEnum";
import ControllerFactory from "/@/childrenAppsManage/Extensions/controllerFactory";
import { ControllersEnum } from "/@/childrenAppsManage/childrenAppEnums/controllersEnum";
import childrenAppsMap from "/@/childrenAppsManage/childrenAppMaps/childrenAppsMap";
import { useLoading } from "/@/directive/loading/hooks";
import LengthWatcherArray from "/@/utils/lengthWatcherArray";
const { startLoading, stopLoading } = useLoading();

/**
 * 子应用管理器
 */
class ChildrenAppsManage {
	// 单例实例变量
	private static instance: ChildrenAppsManage;
	private observerList: LengthWatcherArray<MainTochildrenCommon>;
	// 私有构造函数，确保单例模式
	private constructor() {
		this.observerList = new LengthWatcherArray<MainTochildrenCommon>(this.observerListChange);
	}
	// 获取单例实例的静态方法
	public static getInstance(): ChildrenAppsManage {
		if (!ChildrenAppsManage.instance) {
			// 如果实例不存在，则创建
			ChildrenAppsManage.instance = new ChildrenAppsManage();
		}
		// 返回单例实例
		return ChildrenAppsManage.instance;
	}

	private childrenToMainDataList: Array<ChildrenToMainDataListItem> = [];

	/**
	 * @description 手动卸载应用
	 * @param appName 应用名称
	 * @param options 参数
	 * @returns
	 */
	public unmountApp(appName: ChildrenAppNameEnum, options?: UnmountAppParams): Promise<boolean> {
		// const that = this;
		// return new Promise((resolve, reject) => {
		// 	if (!options) {
		// 		options = {};
		// 		options["destroy"] = true;
		// 	}
		// 	console.log(options, "===========");
		// 	microApp
		// 		.unmountApp(appName, { ...options })
		// 		.then(() => {
		// 			//解除对应子应用数据监听
		// 			const idx = that.childrenToMainDataList.findIndex((item) => item.name == appName);
		// 			if (idx != -1) {
		// 				microApp.removeDataListener(appName, that.childrenToMainDataList[idx].fn);
		// 				that.childrenToMainDataList.splice(idx, 1);
		// 			}
		// 			//获取子应用
		// 			const preFetchApp: PreFetchApp = childrenAppsMap.get(appName)?.preFetchApp as PreFetchApp;
		// 			preFetchApp.level = 3;
		// 			//卸载后直接执行预加载
		// 			// microApp.preFetch([preFetchApp], 100);
		// 			resolve(true);
		// 		})
		// 		.catch(() => {
		// 			reject(false);
		// 		});
		// });
	}

	/**
	 * @description 卸载所有子应用
	 * @param options 参数
	 */
	public unmountAllApps(options?: UnmountAppParams): Promise<boolean> {
		// const that = this;
		// return new Promise((resolve, reject) => {
		// 	if (options?.destroy !== false) {
		// 		options!.destroy = true;
		// 	}
		// 	const appList: Array<ChildrenAppNameEnum> = microApp.getActiveApps() as Array<ChildrenAppNameEnum>;
		// 	//去除所有子应用数据监听
		// 	appList.forEach((item: ChildrenAppNameEnum) => {
		// 		const idx = that.childrenToMainDataList.findIndex((i) => i.name == item);
		// 		if (idx != -1) {
		// 			microApp.removeDataListener(item, that.childrenToMainDataList[idx].fn);
		// 			that.childrenToMainDataList.splice(idx, 1);
		// 		}
		// 	});
		// 	microApp
		// 		.unmountAllApps({ ...options })
		// 		.then(() => {
		// 			resolve(true);
		// 		})
		// 		.catch(() => {
		// 			reject(false);
		// 		});
		// });
	}

	/**
	 * @description 重新渲染子应用
	 * @param appName
	 * @param destroy
	 */
	public reload(appName: ChildrenAppNameEnum, destroy?: boolean): Promise<boolean> {
		// return new Promise((resolve, reject) => {
		// 	microApp
		// 		.reload(appName, destroy)
		// 		.then(() => {
		// 			resolve(true);
		// 		})
		// 		.catch(() => {
		// 			reject(false);
		// 		});
		// });
	}

	/**
	 * @description 手动渲染子应用
	 * @param options
	 * @returns
	 */
	public renderApp(options: RenderAppOptions): Promise<boolean> {
		// const that = this;
		// startLoading();
		// return new Promise((resolve, reject) => {
		// 	microApp
		// 		.renderApp({ ...options })
		// 		.then((res) => {
		// 			if (res) {
		// 				that.childrenToMainDataList.push({ name: options.name, fn: that.childrenToMainData.bind(that) });
		// 				const childrenToMainDataListItem: ChildrenToMainDataListItem = that.childrenToMainDataList.find((item) => item.name == options.name) as ChildrenToMainDataListItem;
		// 				//添加数据接收
		// 				microApp.addDataListener(options.name, childrenToMainDataListItem.fn);
		// 				stopLoading();
		// 				resolve(res);
		// 			} else {
		// 				reject(res);
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			reject(err);
		// 		});
		// });
	}

	/**
	 * 强制发送数据给指定子应用
	 * @param name 子应用名称
	 * @param mainTochildrenCommon 数据
	 */
	public forceSetData<Data>(name: ChildrenAppNameEnum, mainTochildrenCommon: MainTochildrenCommon<Data>) {
		// microApp.forceSetData(name, { ...mainTochildrenCommon });
		// this.observerList.push({ ...mainTochildrenCommon });
	}

	private observerListChange = (newLength: number) => {
		// const that = this;
		// if (newLength > 0) {
		// 	microApp.forceSetData(that.observerList.getArray()[0].name, { ...that.observerList.getArray()[0] }, () => {
		// 		that.observerList.shift();
		// 	});
		// }
	};

	/**
	 * @description 强制发送全局数据
	 * @param data
	 */
	public forceSetGlobalData(data: MainToChildrenGlobal) {
		// microApp.forceSetGlobalData({ ...data });
	}

	/**
	 * @description 预加载
	 * @param appList 预加载app参数
	 * @param delay 延迟
	 */
	public preFetch(appList: Array<PreFetchApp>, delay: number = 3000) {
		// microApp.preFetch(appList, delay);
	}

	/**
	 * 接收子应用发送的数据
	 * @param childrenToMainCommonData 数据
	 */
	private childrenToMainData(childrenToMainCommonData: ChildrenToMainCommon): any {
		// // console.log("收到子应用数据", childrenToMainCommonData);
		// //收到子应用通知主应用路由跳转业务(仅限于A应用跳转b应用路由)
		// if (childrenToMainCommonData.transactionName == TransactionNameCommonEnum.routerPush) {
		// 	this.childrenToMainRouter(childrenToMainCommonData);
		// }
		// //收到子应用通知主营用Loading业务
		// else if (childrenToMainCommonData.transactionName == TransactionNameCommonEnum.childrenAppLoading) {
		// 	this.childrenToMainLoading(childrenToMainCommonData);
		// }
		// //走 控制器
		// else {
		// 	const Controller = ControllerFactory.createController(childrenToMainCommonData.transactionName as ControllersEnum);
		// 	Controller.handleRequest(childrenToMainCommonData);
		// }
		// //收完之后 清空数据缓存
		// microApp.clearData(childrenToMainCommonData.name);
	}

	/**
	 * @description 子应用通知主应用跳转子应用路由
	 */
	public childrenToMainRouter(childrenToMainCommonData: ChildrenToMainCommon<ChildrenToMainRouterPush>) {
		// console.log("收到子应用路由跳转子应用路由", childrenToMainCommonData, childrenToMainCommonData.data?.path);
		// microApp.router.push({
		// 	name: childrenToMainCommonData.name,
		// 	path: "#" + childrenToMainCommonData.data?.path,
		// });
	}

	/**
	 * @description 子应用通知主应用loading状态改变
	 */
	private childrenToMainLoading(childrenToMainCommonData: ChildrenToMainCommon<ChildrenToMainLoading>) {
		// console.log("收到子应用通知主应用loading", childrenToMainCommonData);
		// if (childrenToMainCommonData.data?.loading == "1") {
		// 	startLoading();
		// } else {
		// 	stopLoading();
		// }
	}
}

/**
 * @description 子应用管理器
 */
const childrenAppsManage = ChildrenAppsManage.getInstance();

export default childrenAppsManage;
