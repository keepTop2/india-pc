import ChildrenAppNameEnum from "/@/ChildrenAppportAManage/childrenAppEnums/childrenAppNameEnum";
import { ThemesStore } from "/@/stores/modules/themes";
import { StoreUser } from "/@/stores/modules/user";
/**
 * @description 发送给指定子应用 最外层接口定义
 */
export interface MainTochildrenCommon<Data = any> {
	/**
	 * @description 子应用名称
	 */
	name: ChildrenAppNameEnum;

	/**
	 * @description 前端业务名称 对应到某个子应用 controller
	 */
	transactionName: string;

	/**
	 * @description 接口名称
	 */
	apiName?: string;

	/**
	 * @description 发送的数据
	 */
	data?: Data;
}

/**
 * @description 发送全局数据 定义接口
 */
export interface MainToChildrenGlobal extends StoreUser, ThemesStore {}
