import useAxiosApi from "/@/utils/useAxiosApi";

export const userApi = {
	/**
	 * @description 查询会员登录设备记录
	 */
	queryUserLoginDevice: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/user-info/global/queryUserLoginDevice`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description 全局设置基本信息
	 */
	getUserGlobalSetInfo: (headers = {}) => {
		return useAxiosApi(`/app-foreign/user-info/global/getUserGlobalSetInfo`, {
			method: "POST",
			headers,
		});
	},
	/**
	 * @description 修改密码
	 */
	changePassword(data = {}, header = {}) {
		return useAxiosApi(`/app-foreign/user-info/global/changePassword`, {
			method: "POST",
			data,
			headers: header,
		});
	},
	/**
	 * @description 绑定邮箱或手机
	 */
	bindAccount(data = {}, header = {}) {
		return useAxiosApi(`/app-foreign/user-info/global/bindAccount`, {
			method: "POST",
			data,
			headers: header,
		});
	},
	/**
	 * @description 删除设备
	 */
	deleteDevice(data = {}, header = {}) {
		return useAxiosApi(`/app-foreign/user-info/global/deleteUserLoginDevice`, {
			method: "POST",
			data,
			headers: header,
		});
	},
};
