import axios from "axios";
import { debounce } from "lodash-es";
import showToast from "../hooks/useToast";
import ResCode from "./resCode";
import { useLoading } from "/@/directive/loading/hooks";
import { useModalStore } from "/@/stores/modules/modalStore";
import { useUserStore } from "/@/stores/modules/user";
import EncryptionFn from "/@/utils/encryption";

// import { useRequestError } from "/@/hooks/requestError";

const { startLoading, stopLoading } = useLoading();
// const { handleRequestError } = useRequestError();

// 获取 config 配置请求 api
function getUrl() {
	switch (import.meta.env.VITE_BASEENV) {
		case "development":
			return (window as any)["PLATFROM_CONFIG"].developmentBaseURL;
		case "production":
			return (window as any)["PLATFROM_CONFIG"].productionBaseURL;
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

//隐藏 loading
function hideLoading() {
	LoadingRequestCount--;
	LoadingRequestCount = Math.max(LoadingRequestCount, 0); //防止小于 0 的情况发生
	if (LoadingRequestCount === 0) {
		//关闭 loading
		toHideLoading();
	}
}

//防抖
const toHideLoading = debounce(() => {
	stopLoading();
}, 200);

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
			showLoading(config.headers.loadingTarget);
		}
		const UserStore = useUserStore();
		const modalStore = useModalStore();
		// 需要登录的处理
		if (config["headers"]["needLogin"] == "true" && !UserStore.getUserInfo.token) {
			hideLoading();
			modalStore.openModal("LoginModal");
			return Promise.reject();
		}
		config["headers"]["Sign"] = EncryptionFn.encryption();
		const language = UserStore.getLang;
		if (language) {
			config["headers"]["Accept-Language"] = language;
		}
		// console.log(config);
		return config;
	},
	(error) => {
		console.log(error, "做一些请求错误的事情");
		//判断当前请求是否设置了不显示 Loading
		if (error.headers.showLoading !== false) {
			hideLoading();
		}
		return Promise.reject(error);
	}
);

// 响应拦截器
instance.interceptors.response.use(
	(response) => {
		//判断当前请求是否设置了不显示 Loading（不显示自然无需隐藏）
		if (response.config.headers.showLoading !== false) {
			hideLoading();
		}
		const res = response.data;
		// 如果自定义代码不是 200，则判断为错误。
		const userStore = useUserStore();
		switch (res.code) {
			// 登录过期
			case ResCode.LOGIN_EXPIRE:
				userStore.logOut();
				break;
			// 令牌错误
			case ResCode.TOKEN_INVALID:
				userStore.logOut();
				break;
		}

		if (res.code !== ResCode.SUCCESS) {
			if (res.type == "image/png") {
				return res;
			}
			// if (!response.config.headers.hideToast) {
			// 	handleRequestError({
			// 		name: "mainApp",
			// 		res,
			// 	});
			// }

			if (!response.config.headers.hideToast) showToast(res.message);
			return res;
		} else {
			return res;
		}
	},
	(error) => {
		console.log("请求失败", error);
		//判断当前请求是否设置了不显示 Loading（不显示自然无需隐藏）
		hideLoading();
		error && showToast(error.message);
		// ElMessage.error(error.message);
		return Promise.reject(error);
	}
);

export default instance;
