import useAxiosApi from "/@/utils/useAxiosApi";

export const uploadApi = {
	// 登录
	upload: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/file/api/upload`, {
			method: "POST",
			data,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},
};
