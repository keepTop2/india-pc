import useAxiosApi from "/@/utils/useAxiosApi";

export const HomeApi = {
	// 首页分类热门游戏
	queryLobbyTopGame: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game_lobby/api/queryLobbyTopGame`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 获取热门游戏
	queryGameInfoDetail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game_lobby/api/queryGameInfoDetail`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 收藏游戏
	collection: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game/api/collection`, {
			method: "POST",
			data,
			headers,
		});
	},
};
