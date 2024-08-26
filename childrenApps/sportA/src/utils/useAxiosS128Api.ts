import axios from "axios";
import _ from "lodash-es";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";

/**s128 服务地址 */
// https://kss.cfb2.net (沙盒)
// https://css.digmaan.biz(实时)
// https://css.sabongderby.com (实时)

// 获取 config 配置请求 api
function getUrl() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return window["PLATFROM_CONFIG"].developS128Url;
		case "production":
			return window["PLATFROM_CONFIG"].productionS128Url;
		default:
			return "";
	}
}

// 创建 axios 实例
const instance = axios.create({
	baseURL: getUrl(),
	withCredentials: false,
	timeout: 30000,
});

// 请求拦截器
instance.interceptors.request.use(
	(config) => {
		const sportsInfoStore = useSportsInfoStore();
		// if (sportsInfoStore.getSportsToken) {
		// 	config["headers"]["Authorization"] = `Bearer ${sportsInfoStore.getSportsToken}`;
		// }
		return config;
	},
	(error) => {
		// console.log(error, "做一些请求错误的事情");
		return Promise.reject(error);
	}
);

// 响应拦截器
instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// console.log("请求失败", error);
		//判断当前请求是否设置了不显示 Loading（不显示自然无需隐藏）
		return Promise.reject(error);
	}
);

export default instance;
