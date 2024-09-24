import useAxiosApi from "/@/utils/useAxiosApi";

export const activityApi = {
	// 活动列表
	activityPageList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/activityPageList`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 活动列表
	activityTabsList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityLabs/api/queryList`, {
			method: "GET",
			data,
			headers,
		});
	},
};
