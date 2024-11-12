import useAxiosApi from "/@/utils/useAxiosApi";

export const bannerApi = {
	// 手机验证码请求
	queryBannerList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/game_lobby/api/queryBannerList`, {
			method: "POST",
			data,
			headers,
		});
	},
};
