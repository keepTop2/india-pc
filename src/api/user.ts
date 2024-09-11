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
};
