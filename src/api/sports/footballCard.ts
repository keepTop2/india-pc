import useAxiosApi from "/@/utils/useAxiosApi";

export const FootballCardApi = {
	/**
	 *@description 体育卡片收藏
	 */
	saveFollow: (data = {}) => {
		return useAxiosApi(`/app/publicSetting/api/saveFollow`, {
			method: "POST",
			data,
		});
	},
	/**
	 *@description 体育卡片取消收藏
	 */
	unFollow: (data = {}) => {
		return useAxiosApi(`/app/publicSetting/api/unFollow`, {
			method: "POST",
			data,
		});
	},

	/**
	 *@description 体育卡片收藏列表
	 */
	getAttentionList: (data = {}) => {
		return useAxiosApi(`/app/publicSetting/api/getSportsFollowDetail`, {
			method: "POST",
			data,
		});
	},
};
