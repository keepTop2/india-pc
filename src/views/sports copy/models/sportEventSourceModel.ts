/**
 * @description 体育SSE 相关模型
 */

import { SportPushApi, WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";

/**
 * @description 体育SSE集合实体 模型
 */
export interface SportEventSourceInstanceModel {
	/**
	 * @description SSE连接名称
	 */
	sportPushApi: SportPushApi;

	/**
	 * @description 前端业务名称
	 */
	webToPushApi: WebToPushApi;

	/**
	 * @description sse 实例
	 */
	sourceInstance: EventSource | null;
}

/**
 * @description 开启SSE 请求参数模型
 */
export interface OpenSportEventSourceParams {
	/**
	 * @description 请求域名
	 */
	apiUrl: string;

	/**
	 * @description token
	 */
	token: string;

	/**
	 * @description 语言
	 */
	language: string;

	/**
	 * @description SSE连接名称
	 */
	sportPushApi: SportPushApi;

	/**
	 * @description 前端业务名称
	 */
	webToPushApi: WebToPushApi;

	/**
	 * 查询语句参数
	 */
	params?: SSESelectParamse;

	/**
	 * 版本号
	 */
	version?: string;

	/**
	 * 是否开启单个 true 单个 false 多个
	 */
	isMultiple?: boolean;

	/**
	 * 清理赔率状态
	 */
	oddsChange?: object;
}

/**
 * @description SSE 返回数据 模型
 */
export interface SportEventSourceResponse {
	/**
	 * @description SSE连接名称
	 */
	sportPushApi: SportPushApi;

	/**
	 * @description 前端业务名称
	 */
	webToPushApi: WebToPushApi;

	payload: {
		sports?: {
			add: Array<any>;
			change: Array<any>;
			remove: Array<any>;
		};
		events?: {
			add: Array<any>;
			change: Array<any>;
			remove: Array<any>;
		};
		markets?: {
			add: Array<any>;
			change: Array<any>;
			remove: Array<any>;
		};
		outrights?: {
			add: Array<any>;
			change: Array<any>;
			remove: Array<any>;
		};
	};
}

/**
 * @description SSE查询参数
 */
interface SSESelectParamse {
	query?: string;
	from?: string;
	until?: string;
	includeMarkets?: string;
}
