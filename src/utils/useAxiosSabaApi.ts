import axios from "axios";
import _ from "lodash-es";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import { jsonlint } from "./jsonlint";
// 获取 config 配置请求 api
function getUrl() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return window["PLATFROM_CONFIG"].developSportUrl;
		case "production":
			return window["PLATFROM_CONFIG"].productionSportUrl;
		default:
			return "";
	}
}

// 创建 axios 实例
const instance = axios.create({
	baseURL: getUrl(),
	withCredentials: false,
	timeout: 30000,
	transformResponse: [
		function (data) {
			try {
				// 转换并校验JSON格式
				const parsedData = jsonlint.parse(data);
				return parsedData;
			} catch (error) {
				// 捕获解析错误
				console.error("Response JSON parsing failed", error);
				return data; // 如果失败，返回原始数据
			}
		},
	],
});

// 请求拦截器
instance.interceptors.request.use(
	(config) => {
		const UserStore = useUserStore();
		const sportsInfoStore = useSportsInfoStore();
		const modalStore = useModalStore();
		// 需要登录的处理
		if (config["headers"]["needLogin"] == "true" && !UserStore.getUserInfo.token) {
			modalStore.openModal("LoginModal");
			return Promise.reject();
		}
		if (sportsInfoStore.getSportsToken) {
			config["headers"]["Authorization"] = `Bearer ${sportsInfoStore.getSportsToken}`;
		}
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
