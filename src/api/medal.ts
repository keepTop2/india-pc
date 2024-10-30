import useAxiosApi from "/@/utils/useAxiosApi";

export const MedalApi = {
	// 获取勋章信息
	getUserMedalInfo: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/api/getUserMedalInfo`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 点亮勋章
	lightUpMedal: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/api/lightUpMedal`, {
			method: "POST",
			data,
			headers,
		});
	},

	/**
	 *@description 获取前几个勋章
	 */
	topNList: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-info/api/topNList`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 *@description 获取前几个勋章
	 */
	openMedalReward: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-info/api/openMedalReward`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
};
