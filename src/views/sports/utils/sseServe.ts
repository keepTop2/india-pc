import { WebResponse } from "/@/models/commonInterface";
import { SportEventSourceInstanceModel, OpenSportEventSourceParams, SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";
import ResCode from "/@/utils/resCode";
import qs from "qs";

/**
 * @description 开单个SSE推送通道
 * @param sportPushApi 数据源推送通道名称
 * @param webToPushApi 前端业务名称
 * @param params 查询参数 默认为{}
 * @param version 版本号 默认为V1
 */
export const openSingleSportEventSource = ({
	sportPushApi,
	webToPushApi,
	params = {},
	version = "V1",
	apiUrl,
	language,
	token,
}: OpenSportEventSourceParams): Promise<SportEventSourceInstanceModel> => {
	return new Promise((resove, reject) => {
		//返回数据
		const resPonsedata: WebResponse = {};
		try {
			//连接必传的参数
			const requireParams = {
				token,
				// language: userStore.getLang,
				language,
			};
			//后端语言列表
			// ZH_CN("zh-CN", "CN", "中文"),
			// EN_US("en-US", "US", "英语-美国"),
			// HI_IN("hi-IN", "IN", "北印度语-印度"),
			// ID_ID("id-ID", "ID", "印尼-印尼"),
			// PT_BR("pt-BR", "BR", "葡萄牙语-巴西");
			//合并参数
			const requestParams = Object.assign({}, requireParams, params);
			// SSE连接实体
			const sportSource: SportEventSourceInstanceModel = {
				sportPushApi,
				webToPushApi,
				sourceInstance: null,
			};
			// console.log(requestParams, "推送前的参数");
			sportSource.sourceInstance = new EventSource(`${apiUrl}/sports/stream/${version}/${sportPushApi}?${qs.stringify(requestParams)}`);
			//打开通道 promise返回成功
			sportSource.sourceInstance.onopen = () => {
				resPonsedata.code = ResCode.SUCCESS;
				resove(sportSource);
			};
			// sportSource.sourceInstance.onmessage = (e) => {
			// };
			//通道报错
			sportSource.sourceInstance.onerror = (err) => {
				resPonsedata.code = ResCode.ERR;
				reject(resPonsedata);
			};
		} catch (err) {
			console.error(err);
			resPonsedata.code = ResCode.ERR;
			reject(resPonsedata);
		}
	});
};
