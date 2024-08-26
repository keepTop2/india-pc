import useAxiosApi from '/@/utils/useAxiosApi';

export const loginApi = {
	// 验证码验证
	verifyCode: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/verifyCode`, {
			method: 'POST',
			data,
			headers,
		});
	},

	// 登录
	userLogin: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/userLogin`, {
			method: 'POST',
			data,
			headers,
		});
	},
};
