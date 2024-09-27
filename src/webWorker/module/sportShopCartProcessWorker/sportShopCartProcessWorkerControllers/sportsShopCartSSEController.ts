import qs from "qs";
import { WebResponse } from "/@/models/commonInterface";
import { OpenSportEventSourceParams, SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";
import ResCode from "/@/utils/resCode";
import SportsShopCartSSEServices from "/@/webWorker/module/sportShopCartProcessWorker/services/sportsShopCartSSEServices";
export default (function () {
	class SportsShopCartSSEController {
		/**
		 * @description sse 实例
		 */
		public static sourceInstance: EventSource | null = null;

		public static timer: null | NodeJS.Timeout = null;

		/**
		 * @description 业务处理
		 */
		private static sportEventSourceService = new SportsShopCartSSEServices();

		// 体育购物车推送开启
		public static startSEE = ({ sportPushApi, webToPushApi, params = {}, version = "V1", apiUrl, language, token }: OpenSportEventSourceParams) => {
			//返回数据
			const resPonsedata: WebResponse = {};
			//连接必传的参数
			const requireParams = {
				token,
				// language: userStore.getLang,
				language,
			};
			//合并参数
			const requestParams = Object.assign({}, requireParams, params);
			// console.log("requestParams", requestParams);

			// console.log(requestParams, "推送前的参数");
			this.sourceInstance = new EventSource(`${apiUrl}/sports/stream/${version}/${sportPushApi}?${qs.stringify(requestParams)}`);
			//打开通道 promise返回成功
			this.sourceInstance.onopen = () => {
				resPonsedata.code = ResCode.SUCCESS;
				this.sourceInstance!.onmessage = (event) => {
					const data: SportEventSourceResponse = {
						sportPushApi,
						webToPushApi,
						payload: event.data === "KEEPALIVE" ? {} : JSON.parse(event.data).payload,
					};
					this.sportEventSourceService.startSEEProcess(data);
				};
			};

			//通道报错
			this.sourceInstance.onerror = (err) => {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.timer = setTimeout(() => {
					this.startSEE({ sportPushApi, webToPushApi, params, version, apiUrl, language, token });
				}, 5000);
			};
		};

		// 冠军推送开启
		public static startOutrightSEE = ({ sportPushApi, webToPushApi, params = {}, version = "V1", apiUrl, language, token }: OpenSportEventSourceParams) => {
			//返回数据
			const resPonsedata: WebResponse = {};
			//连接必传的参数
			const requireParams = {
				token,
				// language: userStore.getLang,
				language,
			};
			//合并参数
			const requestParams = Object.assign({}, requireParams, params);

			this.sourceInstance = new EventSource(`${apiUrl}/sports/stream/${version}/${sportPushApi}?${qs.stringify(requestParams)}`);
			this.sourceInstance.onopen = () => {
				resPonsedata.code = ResCode.SUCCESS;
				this.sourceInstance!.onmessage = (event) => {
					if (event.data == "KEEPALIVE") return;
					const data: SportEventSourceResponse = {
						sportPushApi,
						webToPushApi,
						payload: JSON.parse(event.data).payload,
					};
					this.sportEventSourceService?.startOutrightSEEProcess(data);
				};
			};

			//通道报错
			this.sourceInstance.onerror = (err) => {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.timer = setTimeout(() => {
					this.startSEE({ sportPushApi, webToPushApi, params, version, apiUrl, language, token });
				}, 5000);
			};
		};
	}
	return SportsShopCartSSEController;
})();
