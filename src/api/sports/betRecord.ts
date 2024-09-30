// 注单记录
import useAxiosSabaApi from "/@/utils/useAxiosSabaApi";
import qs from "qs";

class BetRecordApi {
	// 注单记录
	static GetBetDetails = (params?: object) => {
		const requireParams = { language: "zhcn" };
		const requestParams = Object.assign({}, requireParams, params);
		return useAxiosSabaApi(`/betting/V1/GetBetDetails?${qs.stringify(requestParams)}`, {
			method: "GET",
		});
	};
}

export default BetRecordApi;
