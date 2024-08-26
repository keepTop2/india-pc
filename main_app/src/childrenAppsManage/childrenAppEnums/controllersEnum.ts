/**
 * @description 所有控制器 枚举
 */
export enum ControllersEnum {
	/**
	 * @description demo_app1下的childrenAppController1控制器
	 */
	childrenAppController1 = "childrenAppController1",
	/**
	 * @description 体育A容器切换 控制器
	 */
	SportAContainerChangeController = "SportAContainerChangeController",

	/**
	 * @description 体育A 预加载页面渲染完成控制器
	 */
	SportAPreFetchSportAViewController = "SportAPreFetchSportAViewController",

	/**
	 * @description 子应用跳转登录或注册控制器
	 */
	ToLoginOrRegisterController = "ToLoginOrRegisterController",

	/**
	 * @description 子应用的接口错误控制器
	 */
	RequestErrorCommonController = "RequestErrorCommonController",
}
