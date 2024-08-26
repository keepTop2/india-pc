import useAxiosApi from '/@/utils/useAxiosApi';

export const registerApi = {
	// 会员注册
	userRegister: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/userRegister`, {
			method: 'POST',
			data,
			headers,
		});
	},

	// 会员注册
	submitRegister: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/submitRegister`, {
			method: 'POST',
			data,
			headers,
		});
	},
};
