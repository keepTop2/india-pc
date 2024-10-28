import useAxiosApi from "/@/utils/useAxiosApi";

export const MessageApi = {
	// // 首页分类热门游戏
	// messageList: (data = {}, headers = { showLoading: false }) => {
	// 	return useAxiosApi(`/app/client/user/notice/getUserNoticeHeadList`, {
	// 		method: "POST",
	// 		data,
	// 		headers,
	// 	});
	// },
	// 信息列表
	messageList: (data = {}, headers = { showLoading: true }) => {
		return useAxiosApi(`/app/client/user/notice/getUserNoticeList`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 一键已读
	setReadAll: (data = {}, headers = { showLoading: true }) => {
		return useAxiosApi(`/app/client/user/notice/setDelStateAll`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 一键删除
	setDelStateAll: (data = {}, headers = { showLoading: true }) => {
		return useAxiosApi(`/app/client/user/notice/setReadStateAll`, {
			method: "POST",
			data,
			headers,
		});
	},
};
