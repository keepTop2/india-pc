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
			headers: {
				needLogin: true,
			},
		});
	},
	// 申请活动校验
	getToActivity: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/toActivity`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 申请活动校验
	getSpindetail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activity/spin/api/detail`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 申请转盘校验
	getToSpinActivity: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activity/spin/api/toActivity`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 获取转盘结果
	getSpinprizeResult: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activity/spin/api/prizeResult`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 获取转盘记录
	querySpinWheelOrderRecord: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/querySpinWheelOrderRecord`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
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
