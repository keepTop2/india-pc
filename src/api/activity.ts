import useAxiosApi from "/@/utils/useAxiosApi";
import { ActivityBasePartReqVO, ResponseVOPageActivityBasePartRespVO } from "./apiInterfaces";
export const activityApi = {
	// 活动列表
	activityPageList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/activityPageList`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 活动校验
	queryLobbyLabelActivitySwitch: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game_lobby/api/queryLobbyLabelActivitySwitch`, {
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
			headers: {
				hideToast: true,
			},
		});
	},
	// 获取转盘结果
	getSpinprizeResult: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activity/spin/api/prizeResult`, {
			method: "POST",
			data,
			headers: {
				hideToast: true,
			},
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
		// return useAxiosApi(`/app/activityParticipate/api/getActivityReward`, {
		// 	method: "POST",
		// 	data,
		// 	headers,
		// });
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

	// 每日竞赛分类
	queryActivityDailyContestVenueCode: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/queryActivityDailyContestVenueCode`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
	// 每日竞赛信息
	queryActivityDailyContest: (data = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/queryActivityDailyContest`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
	// 每日竞赛奖池
	queryActivityDailyPrizePool: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/queryActivityDailyPrizePool`, {
			method: "POST",
			data,
			headers: {
				showLoading: false,
			},
		});
	},
	// 每日竞赛奖池
	queryActivityDailyRecord: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/activityParticipate/api/queryActivityDailyRecord`, {
			method: "POST",
			data,
			headers: {
				showLoading: false,
			},
		});
	},
	// 任务详情
	getTaskDetail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/task/api/detail`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
	// 领取任务奖励
	receiveTask: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/task/api/receive`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
};
