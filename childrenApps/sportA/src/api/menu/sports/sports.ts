import useAxiosApi from "/@/utils/useAxiosApi";
import useAxiosSabaApi from "/@/utils/useAxiosSabaApi";
import qs from "qs";
class SportsApi {
	/**
	 *@description 体育登录
	 */
	static sportsLogin = (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app-foreign/third/api/loginGame`, {
			headers,
			method: "POST",
			data,
		});
	};
	/**
	 *@description 沙巴体育匿名登陆
	 */
	static sbaAnonLogin = (data = {}) => {
		return useAxiosApi(`/app-foreign/anon/api/sbaAnonLogin`, {
			method: "POST",
			data,
		});
	};
	//获取关注列表
	static getAttentionList = (data = {}) => {
		return useAxiosApi(`/app-foreign/publicSetting/api/getSportsFollowDetail`, {
			method: "POST",
			data,
		});
	};

	//关注赛事
	static saveFollow = (data = {}) => {
		return useAxiosApi(`/app-foreign/publicSetting/api/saveFollow`, {
			method: "POST",
			data,
		});
	};
	//取消关注赛事
	static unFollow = (data = {}) => {
		return useAxiosApi(`/app-foreign/publicSetting/api/unFollow`, {
			method: "POST",
			data,
		});
	};
	/**
	 * @description: 公告获取
	 */
	static GetAnnouncement = (params) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/sports/V1/GetAnnouncement?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};
	/**
	 *@description 获取热门赛事
	 */
	static GetHotEvents = (params) => {
		const requireParams = {};
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/sports/V1/GetHotEvents?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};

	/**
	 *@description 获取热门赛事(可指定sportType 体育类型；以及其它参数；)
	 */
	static GetPromotions = (params) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/sports/V1/GetPromotions?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};

	/**
	 *@description 获取赛果数量
	 */
	static GetSportResults = (params) => {
		const requireParams = {};
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/sports/V1/GetSportResults?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};
	/**
	 *@description 获取赛果
	 */
	static GetEventResults = (params) => {
		const requireParams = {};
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/sports/V1/GetEventResults?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};
	/**
	 *@description 获取联赛数量
	 */
	static GetLeagues = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/sports/V1/GetLeagues?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};

	/**
	 *@description 获取赛事信息
	 */
	static GetEventInfo = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/sports/V1/GetEvents?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};
	/**
	 *@description 获取视频地址或视频流地址;
	 */
	static GetStreaming = (params?: object) => {
		const requireParams: any = {};
		const requestParams = Object.assign({}, requireParams, params);
		if (!requestParams.channelCode) {
			return Promise.reject({ status: 0, data: {} });
		}
		return useAxiosSabaApi(`/sports/V1/GetStreaming?${qs.stringify(requestParams)}`, {
			method: "GET",
			// data: requestParams,
		});
	};
	/**
	 *@description 赛果获取已完成的赛事信息
	 */
	// /betting/{version}/GetGameDetails?eventids=12345,6789
	static GetResultEvents = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1/GetGameDetails?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};

	/**
	 *@description 更新单注的盘口数据
	 */
	static GetSingleTicket = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1/GetSingleTicket?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};

	/**
	 *@description 单注-注单的下注
	 */
	static PlaceBet = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1/PlaceBet?${qs.stringify(requestParams)}`, {
			method: "POST",
			data: requestParams,
		});
	};
	/**
	 *@description 更新串关注单的相关信息
	 */
	static GetParlayTickets = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1/GetParlayTickets`, {
			method: "POST",
			data: requestParams,
		});
	};
	/**
	 *@description 用于下注串关的注单（多单-注单的下注）
	 */
	static PlaceParlayBet = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		// ?${qs.stringify(requestParams)}
		return useAxiosSabaApi(`/betting/V1/PlaceParlayBet`, {
			method: "POST",
			data: {
				betInfo: requestParams,
			},
		});
	};

	/**
	 *@description 此API用于更新-冠军- 单注的盘口数据
	 */
	static GetOutrightTicket = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1//GetOutrightTicket?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};

	/**
	 *@description 此API用于冠军单注注单的下注
	 */
	static PlaceOutrightBet = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1//PlaceOutrightBet?${qs.stringify(requestParams)}`, {
			method: "POST",
			// data: requestParams,
		});
	};

	/**
	 * @description: 获获取沙巴体育注单ID(获取vendorTransId)
	 * @param {object} data
	 * @return {*}
	 */
	static getBetOrderId = (data?: object, headers = { showLoading: false }) => {
		return useAxiosApi(`/app-foreign/third/api/getBetOrderId`, {
			method: "POST",
			data,
			headers,
		});
	};

	/**
	 * @description: 获取会员首页信息(获取 余额 )
	 * @param {object} data
	 * @return {*}
	 */
	static getIndexInfo = (data?: object, headers = { showLoading: false }) => {
		return useAxiosApi(`/app-foreign/user-info/api/getIndexInfo`, {
			method: "POST",
			data,
			headers,
		});
	};

	/**
	 * @description 查询体育购物车赔率变化配置
	 */
	static getPublicSetting = (data?: object) => {
		return useAxiosApi(`/app-foreign/publicSetting/api/getPublicSetting`, {
			method: "POST",
			data,
		});
	};

	/**
	 * @description 新增体育购物车赔率变化配置
	 */
	static saveSetting = (data?: object) => {
		return useAxiosApi(`/app-foreign/publicSetting/api/saveSetting`, {
			method: "POST",
			data,
		});
	};
}
export default SportsApi;
