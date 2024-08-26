import { MainTochildrenCommon } from "/@/ChildrenAppportAManage/childrenAppDTOs/mainToChildren/mainTochildrenCommon";
import { ChildrenToMainCommon, ChildrenToMainRouterPush, ChildrenToMainLoading } from "/@/ChildrenAppportAManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import { TransactionNameCommonEnum } from "/@/ChildrenAppportAManage/childrenAppEnums/transactionNameCommonEnum";
import ControllerFactory from "/@/ChildrenAppportAManage/Extensions/controllerFactory";
import { ControllersEnum } from "/@/ChildrenAppportAManage/childrenAppEnums/controllersEnum";
import childrenAppNameEnum from "/@/ChildrenAppportAManage/childrenAppEnums/childrenAppNameEnum";
import LengthWatcherArray from "/@/utils/lengthWatcherArray";
/**
 * 子应用管理器
 */
class ChildrenAppportAManage {
	// 单例实例变量
	private static instance: ChildrenAppportAManage;
	private observerList: LengthWatcherArray<ChildrenToMainCommon>;
	// 私有构造函数，确保单例模式
	private constructor() {
		this.observerList = new LengthWatcherArray<ChildrenToMainCommon>(this.observerListChange);
	}

	// 获取单例实例的静态方法
	public static getInstance(): ChildrenAppportAManage {
		if (!ChildrenAppportAManage.instance) {
			// 如果实例不存在，则创建
			ChildrenAppportAManage.instance = new ChildrenAppportAManage();
		}
		// 返回单例实例
		return ChildrenAppportAManage.instance;
	}

	/**
	 * @description 发送数据给主应用
	 */
	public forceDispatch(data: ChildrenToMainCommon) {
		data.name = childrenAppNameEnum.sportA;
		this.observerList.push(data);
		window.microApp?.clearData();
		// console.log(data, "子应用sportA发送数据给主营用");
		// window?.microApp.dispatch(data);
	}

	private observerListChange = (newLength: number) => {
		const that = this;
		if (newLength > 0) {
			window.microApp?.dispatch(that.observerList.getArray()[0], () => {
				that.observerList.shift();
			});
		}
	};

	/**
	 * @description 子应用通知主应用跳转其它子应用路由
	 */
	public childrenToMainRouter(childrenToMainCommonData: ChildrenToMainCommon<ChildrenToMainRouterPush>) {
		childrenToMainCommonData.name = childrenAppNameEnum.sportA;
		childrenToMainCommonData.transactionName = TransactionNameCommonEnum.routerPush;
		this.forceDispatch(childrenToMainCommonData);
	}

	/**
	 * @description 子应用通知主应用loading状态改变
	 */
	public childrenToMainLoading(childrenToMainCommonData: ChildrenToMainCommon<ChildrenToMainLoading>) {
		childrenToMainCommonData.transactionName = TransactionNameCommonEnum.childrenAppLoading;
		this.forceDispatch(childrenToMainCommonData);
	}

	/**
	 * 接主应用发送的数据
	 * @param childrenToMainCommonData 数据
	 */
	public mainToChildrenData(mainTochildrenCommon: MainTochildrenCommon): any {
		// console.log("收到主应用数据", mainTochildrenCommon);
		//走 控制器
		const Controller = ControllerFactory.createController(mainTochildrenCommon.transactionName as ControllersEnum);
		Controller.handleRequest(mainTochildrenCommon);
	}
}

/**
 * @description 子应用管理器
 */
const childrenAppportAManage = ChildrenAppportAManage.getInstance();

export default childrenAppportAManage;
