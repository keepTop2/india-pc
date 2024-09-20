import useAxiosApi from "/@/utils/useAxiosApi";

export const gameApi = {
	// 登录
	loginGame: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/third/api/loginGame`, {
			method: "POST",
			data,
			headers: {
				needLogin: true,
			},
		});
	},
	queryGameInfoByOneClassId: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game_lobby/api/queryGameInfoByOneClassId`, {
			method: "POST",
			data,
			headers,
		});
	},
};
