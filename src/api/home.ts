import useAxiosApi from "/@/utils/useAxiosApi";

export const HomeApi = {
	// 首页分类热门游戏
	queryLobbyTopGame: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/game_lobby/api/queryLobbyTopGame`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 获取热门游戏
	queryGameInfoDetail: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/game_lobby/api/queryGameInfoDetail`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 收藏游戏
	collection: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/game/api/collection`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 跑马灯消息
	horseRaceLampList: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/client/user/notice/getUserNoticeHeadList`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 公告
	noticeList: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/client/user/notice/getForceUserNoticeHeadList`, {
			method: "POST",
			data,
			headers,
		});
	},
};
