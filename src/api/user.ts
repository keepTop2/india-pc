import useAxiosApi from "/@/utils/useAxiosApi";

export const userApi = {
	// 登录
	getIndexInfo: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/api/getIndexInfo`, {
			method: "POST",
			data,
			headers,
		});
	},
	//安全中心基本信息
	getUserGlobalSetInfo: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/getUserGlobalSetInfo`, {
			method: "POST",
			data,
			headers,
		});
	},
	//修改密码
	changePassword: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/changePassword`, {
			method: "POST",
			data,
			headers,
		});
	},
	//发送手机验证码
	globalSendSms: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/sendSms`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 修改邮箱手机号码校验
	checkVerifyCode: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/checkVerifyCode`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 绑定修改邮箱或手机
	bindAccount: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/bindAccount`, {
			method: "POST",
			data,
			headers,
		});
	},

	//修改交易密码
	setWithdrawPwd: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/setWithdrawPwd`, {
			method: "POST",
			data,
			headers,
		});
	},
};
