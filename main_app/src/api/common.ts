import useAxiosApi from '/@/utils/useAxiosApi';

export const CommonApi = {
	// 手机验证码请求
	sendSms: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/sendSms`, {
			method: 'POST',
			data,
			headers,
		});
	},

	// 邮箱验证码请求
	sendMail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/sendMail`, {
			method: 'POST',
			data,
			headers,
		});
	},

	/**
	 *@description 根据 ip 获取语言
	 */
	getLanguage: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/lang/api/getLang`, {
			method: 'POST',
			data,
			headers,
		});
	},
};
