import axios from "axios";
import { useLoading } from "/@/directive/loading/hooks";

const { startLoading, stopLoading } = useLoading();

// 获取 config 配置请求 api
function getUrl() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return (window as any)["PLATFROM_CONFIG"].developmentLotteryBaseURL;
		case "production":
			return (window as any)["PLATFROM_CONFIG"].developmentLotteryBaseURL;
		default:
			return "";
	}
}

//当前正在请求的数量
let LoadingRequestCount = 0;

//显示 loading
function showLoading(target: any) {
	if (LoadingRequestCount === 0) {
		startLoading();
	}
	LoadingRequestCount++;
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
		if (config.headers.showLoading !== "false") {
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
		if (response.config.headers.showLoading !== false) {
			stopLoading();
		}
		return response.data;
	},
	(error) => {
		stopLoading();
		return Promise.reject(error);
	}
);

export default instance;
