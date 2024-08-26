import axios from "axios";
import { ElMessage } from "element-plus";

import { useUserStore } from "/@/stores/modules/user";
import router from "/@/router";

// 获取 config 配置请求 api
function getUrl() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return window["PLATFROM_CONFIG"].developmentBaseURL;
		case "production":
			return window["PLATFROM_CONFIG"].productionBaseURL;
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
		//判断当前请求头是否设置了不显示 Loading，没有设置则默认加载
		if (config.headers.showLoading !== false) {
		}

		const UserStore = useUserStore();
		const language = UserStore.getLang;
		if (language) {
			config["headers"]["Accept-Language"] = language;
		}
		return config;
	},
	(error) => {
		console.log(error, "做一些请求错误的事情");
		//判断当前请求是否设置了不显示 Loading
		if (error.headers.showLoading !== false) {
		}
		return Promise.reject(error);
	}
);

// 响应拦截器
instance.interceptors.response.use(
	(response) => {
		const UserStore = useUserStore();
		console.log("请求成功");
		//判断当前请求是否设置了不显示 Loading（不显示自然无需隐藏）
		if (response.config.headers.showLoading !== false) {
		}
		const res = response.data;
		return res;
	},
	(error) => {
		// console.log("请求失败", error);
		//判断当前请求是否设置了不显示 Loading（不显示自然无需隐藏）
		if (error.config.headers.showLoading !== false) {
		}
		ElMessage.error(error.message);
		return Promise.reject(error);
	}
);

export default instance;
