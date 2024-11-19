import useAxiosApi from "/@/utils/useAxiosApi";

export const bannerApi = {
	queryBannerList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game_lobby/api/queryBannerList`, {
			method: "POST",
			data,
			headers,
		});
	},
	queryUnBannerList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game_lobby/api/queryUnBannerList`, {
			method: "POST",
			data,
			headers,
		});
	},
};
