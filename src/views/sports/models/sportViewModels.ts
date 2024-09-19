/**
 * @description 体育视图模型
 */
import { SportPushApi, WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { Selection } from "/@/views/sports/models/interface";
/**
 * @description 球类 模型
 */
export interface Sports {
	sportType: number;
	liveGameCount: number;
	icon: string;
	activeIcon: string;
	sportName: string;
}

/**
 * @description 体育视图数据模型
 */
export interface SportViewModels {
	viewSportData: {
		/**
		 * @description 外层Sports组件视图数据
		 */
		sports: Sports[];

		leagues: Array<any>;
		events: Array<any>;
		markets: Array<any>;
		outrights: Array<any>;
		results: Array<any>;

		/**
		 * @description 各个子路由视图数据
		 */
		childrenViewData: [];
	};
}
/**
 * @description 线程处理好的数据到视图 模型
 */
export interface WorkerToviewSport {
	/**
	 *@description  体育视图数据模型
	 */
	state: SportViewModels;

	/**
	 * @description SSE连接名称
	 */
	sportPushApi: SportPushApi;

	/**
	 * @description 前端业务名称
	 */
	webToPushApi: WebToPushApi;
}

/**
 * @description 线程处理好的数据到视图 模型
 */
export interface WorkerToViewSportsShopCart<T> {
	/**
	 *@description  体育视图数据模型
	 */
	data: Array<T>;

	/**
	 * @description SSE连接名称
	 */
	sportPushApi: SportPushApi;

	/**
	 * @description 前端业务名称
	 */
	webToPushApi: WebToPushApi;
}

/**
 * @description 清理赔率状态参数 模型
 */
export interface OddsChangeParam {
	/**
	 * @description 前端业务名称
	 */
	webToPushApi: WebToPushApi;
	/**
	 * @description 盘口Id
	 */
	marketId?: Number;

	/**
	 * @description 盘口玩法详细数据
	 */
	selection?: Selection;
	/**
	 * @description 联赛id 用于冠军赛事赔率变化处理
	 */
	leagueId?: Number;
	/**
	 * 	@description 冠军队伍信息
	 */
	team?: {
		orid: Number;
	};
}
