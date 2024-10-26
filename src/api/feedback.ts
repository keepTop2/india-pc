import useAxiosApi from "/@/utils/useAxiosApi";

export const feedbackApi = {
	// 意见反馈提交
	submitFeedback(data = {}, headers = {}) {
		return useAxiosApi(`/app/userFeedback/api/submit`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 意见反馈列表
	FeedbackList(data = {}, headers = {}) {
		return useAxiosApi(`/app/userFeedback/api/pageList`, {
			method: "POST",
			data,
			headers: {
				showLoading: false,
			},
		});
	},
	// 历史意见反馈详情
	FeedbackDetail(data = {}, headers = {}) {
		return useAxiosApi(`/app/userFeedback/api/detail`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
	// 意见反馈问题下拉
	getDownBox(data = {}, headers = {}) {
		return useAxiosApi(`/app/userFeedback/api/getDownBox`, {
			method: "GET",
			data,
			headers,
		});
	},
	// 删除意见反馈
	delFeedback(data = {}, headers = {}) {
		return useAxiosApi(`/app/userFeedback/api/del`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
};
