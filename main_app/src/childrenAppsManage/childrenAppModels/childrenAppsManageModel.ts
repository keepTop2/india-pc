import { Func } from "@micro-app/types";
import ChildrenAppNameEnum from "/@/childrenAppsManage/childrenAppEnums/childrenAppNameEnum";
/**
 * @description 渲染子应用参数
 */
export interface RenderAppOptions {
	/**
	 * @description  应用名称，必传
	 */
	name: ChildrenAppNameEnum;
	/**
	 * @description 应用地址，必传
	 */
	url: string;

	/**
	 * @description // 应用容器或选择器，必传
	 */
	container: string | Element;

	/**
	 * @description 是否切换为iframe沙箱，可选
	 */
	iframe?: boolean;

	/**
	 * @description 开启内联模式运行js，可选
	 */
	inline?: boolean;

	/**
	 * @description 关闭样式隔离，可选
	 */
	"disable-scopecss"?: boolean;

	/**
	 * @description 关闭沙箱，可选
	 */
	"disable-sandbox"?: boolean;

	/**
	 * @description 关闭虚拟路由系统，可选
	 */
	"disable-memory-router"?: boolean;

	/**
	 * @description 指定默认渲染的页面，可选
	 */
	"default-page"?: string;

	/**
	 * @description 保留路由状态，可选
	 */
	"keep-router-state"?: boolean;

	/**
	 * @description 关闭子应用请求的自动补全功能，可选
	 */
	"disable-patch-request"?: boolean;

	/**
	 * @description 开启keep-alive模式，可选
	 */
	"keep-alive"?: boolean;

	/**
	 * @description 卸载时强制删除缓存资源，可选
	 */
	destroy?: boolean;

	/**
	 * @description 开启fiber模式，可选
	 */
	fiber?: boolean;

	/**
	 * @description 设置子应用的基础路由，可选
	 */
	baseroute?: string;

	/**
	 * @description 开启ssr模式，可选
	 */
	ssr?: boolean;

	/**
	 * @description 开启shadowDOM，可选
	 */
	shadowDOM?: boolean;

	/**
	 * @description 传递给子应用的数据，可选
	 */
	data?: Record<PropertyKey, unknown> | undefined;

	/**
	 * @description 获取子应用发送数据的监听函数，可选
	 */
	onDataChange?: Func | undefined;

	/**
	 * @description 注册子应用的生命周期
	 */
	lifeCycles?: {
		/**
		 * @description 加载资源前触发
		 * @param e
		 */
		created?(e: CustomEvent): void;
		/**
		 * @description 加载资源完成后，开始渲染之前触发
		 * @param e
		 */
		beforemount?(e: CustomEvent): void;
		/**
		 * @description 子应用渲染结束后触发
		 * @param e
		 */
		mounted?(e: CustomEvent): void;
		/**
		 * @description 子应用卸载时触发
		 * @param e
		 */
		unmount?(e: CustomEvent): void;
		/**
		 * @description 子应用渲染出错时触发
		 * @param e
		 */
		error?(e: CustomEvent): void;
		/**
		 * @description  子应用推入前台之前触发（keep-alive模式特有）
		 * @param e
		 */
		beforeshow?(e: CustomEvent): void;
		/**
		 * @description 子应用推入前台之后触发（keep-alive模式特有）
		 * @param e
		 */
		aftershow?(e: CustomEvent): void;

		/**
		 * @description 子应用推入后台时触发（keep-alive模式特有）
		 * @param e
		 */
		afterhidden?(e: CustomEvent): void;
	};
}

/**
 * @description 手动卸载应用参数
 */
export interface UnmountAppParams {
	/**
	 * destroy: 是否强制卸载应用并删除缓存资源，默认值：false
	 * 优先级: 高于 clearAliveState
	 * 对于已经卸载的应用: 当子应用已经卸载或keep-alive应用已经推入后台，则清除应用状态及缓存资源
	 * 对于正在运行的应用: 当子应用正在运行，则卸载应用并删除状态及缓存资源
	 */
	destroy?: boolean;

	/**
	 * clearAliveState: 是否清空应用的缓存状态，默认值：false
	 * 解释: 如果子应用是keep-alive，则卸载并清空状态，并保留缓存资源，如果子应用不是keep-alive，则执行正常卸载流程，并保留缓存资源
	 * 补充: 无论keep-alive应用正在运行还是已经推入后台，都将执行卸载操作，清空应用缓存状态，并保留缓存资源
	 */
	clearAliveState?: boolean;
}

/**
 * @description 主应用收消息的集合
 */
export interface ChildrenToMainDataListItem {
	name: ChildrenAppNameEnum;
	fn: Function;
}

/**
 * @description 预加载app参数
 */
export interface PreFetchApp {
	/**
	 * @description 应用名称，必传
	 */
	name: string;

	/**
	 * @description 应用地址，必传
	 */
	url: string;

	/**
	 * @description 是否使用iframe沙箱，vite应用必传，其它应用可选
	 */
	iframe: boolean;

	/**
	 * @description 是否使用内联模式运行js，可选
	 */
	inline?: boolean;

	/**
	 * @description 是否关闭样式隔离，可选
	 */
	"disable-scopecss"?: boolean;

	/**
	 * @description 是否关闭沙盒，可选
	 */
	"disable-sandbox"?: boolean;

	/**
	 * @description 预加载等级，可选（分为三个等级：1、2、3，1表示只加载资源，2表示加载并解析，3表示加载解析并渲染，默认为2）
	 */
	level?: number;

	/**
	 * @description  指定默认渲染的页面，level为3时才会生效，可选
	 */
	"default-page"?: string;

	/**
	 * @description 关闭子应用请求的自动补全功能，level为3时才会生效，可选
	 */
	"disable-patch-request"?: boolean;
}

/**
 * @description 子应用字典值
 */
export interface ChildrenAppsMapValue {
	/**
	 * @description 加载子应用参数
	 */
	renderAppOptions: RenderAppOptions;

	/**
	 * @description 预加载子应用参数
	 */
	preFetchApp: PreFetchApp;
}
