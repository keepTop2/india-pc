import useAxiosApi from "/@/utils/useAxiosApi";

export const loginApi = {
	// 登录
	userLogin: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/userLogin`, {
			method: "POST",
			data,
			headers,
		});
	},
	verifyCode: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/verifyCode`, {
			method: "POST",
			data,
			headers,
		});
	},
	userRegister: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/userRegister`, {
			method: "POST",
			data,
			headers,
		});
	},
	submitAccount: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/submitAccount`, {
			method: "POST",
			data,
			headers,
		});
	},
	sendMail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/sendMail`, {
			method: "POST",
			data,
			headers,
		});
	},
	sendSms: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/sendSms`, {
			method: "POST",
			data,
			headers,
		});
	},
	checkVerifyCode: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/checkVerifyCode`, {
			method: "POST",
			data,
			headers,
		});
	},
	resetPassword: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/login/api/resetPassword`, {
			method: "POST",
			data,
			headers,
		});
	},
};
