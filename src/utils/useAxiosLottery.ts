import axios from "axios";
import showToast from "../hooks/useToast";
import { useLoading } from "/@/directive/loading/hooks";

const { startLoading, stopLoading } = useLoading();

export const SUCCESS_STATUS = 200; // http 状态码
export const SUCCESS_CODE = 0; // 业务状态码

// 获取 config 配置请求 api
function getUrl() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return (window as any)["PLATFROM_CONFIG"].developmentLotteryBaseURL;
		case "production":
			return (window as any)["PLATFROM_CONFIG"].productionLotteryBaseUrl;
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
		if (config.headers.showLoading !== false) {
			startLoading();
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
		const { status, data } = response;
		const { code } = data;

		if (status !== SUCCESS_STATUS) {
			showToast(String(status));
		}

		if (code !== SUCCESS_CODE) {
			showToast(String(status));
		}

		stopLoading();

		return data;
	},
	(error) => {
		stopLoading();
		showToast(error.message);
		return Promise.reject(error);
	}
);

export default instance;
