import useAxiosApi from "/@/utils/useAxiosApi";

export const CommonApi = {
	/**
	 *@description 根据 ip 获取语言
	 */
	getLanguage: (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/lang/api/getLang`, {
			method: "POST",
			data,
			headers,
		});
	},
};
