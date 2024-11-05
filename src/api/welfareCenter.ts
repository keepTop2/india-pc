import useAxiosApi from "/@/utils/useAxiosApi";

export const welfareCenterApi = {
	// 福利中心-分页查询
	pageQuery: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-welfareCenter/api/pageQuery`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
	// 一键领取
	oneClickReceive: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-welfareCenter/api/oneClickReceive`, {
			method: "GET",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
	// 获取下拉
	getDownBox: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-welfareCenter/api/getDownBox`, {
			method: "GET",
			data,
			headers,
		});
	},
	// 查询详情
	detail: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-welfareCenter/api/detail`, {
			method: "POST",
			data,
			headers,
		});
	},
	// 点击领取
	clickReceive: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-welfareCenter/api/clickReceive`, {
			method: "POST",
			data,
			headers,
		});
	},
		// 投注记录 类型目录
		requestGetTypeList: (data = {}, headers = { showLoading: true }) => {
			return useAxiosApi(`/app/common/getDownBox`, {
				method: "POST",
				data,
				headers,
			});
	},
	// 投注记录-分页查询
	tzPageQuery: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/order/api/client/orderRecord`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},
};
