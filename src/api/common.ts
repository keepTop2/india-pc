import useAxiosApi from "/@/utils/useAxiosApi";

export const CommonApi = {
	// 手机验证码请求
	sendSms: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/sendSms`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 邮箱验证码请求
	sendMail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/sendMail`, {
			method: "POST",
			data,
			headers,
		});
	},

	/**
	 *@description 获取通用配置
	 */
	getCommonBusinessDownBox: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/common/getCommonBusinessDownBox`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 *@description 获取国家区号
	 */
	getAreaCodeDownBox: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/common/getAreaCodeDownBox`, {
			method: "POST",
			data,
			headers,
		});
	},

	/**
	 *@description 获取游戏菜单
	 */
	queryLobbyLabelList: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/game_lobby/api/queryLobbyLabelList`, {
			method: "POST",
			data,
			headers,
		});
	},
};
