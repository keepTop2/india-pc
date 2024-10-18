import useAxiosApi from "/@/utils/useAxiosApi";

export const vipApi = {
	// 获取vip信息
	getUserVipInfo: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-vip/api/getUserVipInfo`, {
			method: "GET",
			data,
			headers,
		});
	},
	// 获取vip等级制度
	getUserVipBenefitDetail: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-vip/api/getUserVipBenefitDetail`, {
			method: "GET",
			data,
			headers,
		});
	},
};
