// 注单记录
import useAxiosSabaApi from "/@/utils/useAxiosSabaApi";
import qs from "qs";

class BetRecordApi {
	/**
	 *@description 用于获取注单详细信息，包含未结算或已结算之注单。最多可查询六个月内之注单。但查询区间(start 与 end)限30日内。
	 */
	static GetBetDetails = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1/GetBetDetails?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};
}

export default BetRecordApi;
