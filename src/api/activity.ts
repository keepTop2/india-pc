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
	// 活动分类
	activityTabsList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityLabs/api/queryList`, {
			method: "GET",
			data,
			headers,
		});
	},
	// 活动详情
	getConfigDetail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/getConfigDetail`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 领取活动
	getActivityReward: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/getActivityReward`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 红包雨活动信息
	getRedBagInfo: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityRedBag/api/clientInfo`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 红包雨校验
	redBagParticipate: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityRedBag/api/participate`, {
			method: "POST",
			data,
			headers,
		});
	},
};
