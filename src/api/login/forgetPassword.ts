import useAxiosApi from '/@/utils/useAxiosApi';

export const ForgetPasswordApi = {
	// 验证邮箱｜手机号
	checkAccount: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/checkAccount`, {
			method: 'POST',
			data,
			headers,
		});
	},

	// 验证码校验
	checkVerifyCode: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/checkVerifyCode`, {
			method: 'POST',
			data,
			headers,
		});
	},

	// 重置密码
	resetPassword: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/resetPassword`, {
			method: 'POST',
			data,
			headers,
		});
	},
};
