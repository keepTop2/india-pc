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
};
