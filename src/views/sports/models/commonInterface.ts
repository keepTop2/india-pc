import ResCode from "/@/utils/resCode";
//主题色类型
export type ThemeKey = "default" | "dark";
//语言包
// export type LangType = "zh" | "en" | "Türkiye";
export type LangType = "zh" | "en" | "Türkiye" | "zh-CN";
/**
 * @description 数据源服务推送类型
 */
export type ServeType = "sportServer" | "lotteryServer";

/**
 * @description 服务类型
 */
export interface ServerData {
	/**
	 * @description sportServer 体育数据源数据
	 * @description lotteryServer 彩票数据源数据
	 */
	serverType: ServeType;

	/**
	 * @description 体育SSE接口名称
	 */
	sportPushApi?: string;

	/**
	 * @description 前端业务名称
	 */
	webToPushApi?: string;

	data: any;
}

/**
 * @description 常用于前端Promise返回
 */
export interface WebResponse {
	/**
	 * @description 响应状态码
	 */
	code?: ResCode;

	/**
	 * @description 响应数据
	 */
	data?: any;

	/**
	 * @description 响应提示
	 */
	message?: string;
}
