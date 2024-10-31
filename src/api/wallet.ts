import useAxiosApi from "/@/utils/useAxiosApi";

export const walletApi = {
	// 获取会员金额信息
	getUserBalance: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/api/getUserBalance`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 用户充值方式列表
	rechargeWayList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userRecharge/api/rechargeWayList`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 获取充值配置信息
	getRechargeConfig: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userRecharge/api/getRechargeConfig`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 用户充值
	userRecharge: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userRecharge/api/userRecharge`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 撤销充值订单
	cancelDepositOrder: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userRecharge/api/cancelDepositOrder`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 获取充值订单详情
	depositOrderDetail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userRecharge/api/depositOrderDetail`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 上传凭证接口
	uploadVoucher: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userRecharge/api/uploadVoucher`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 催单
	urgeOrder: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userRecharge/api/urgeOrder`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	/**
	 * @description 提款接口 ⬇️
	 */
	// 获取提款方式列表
	withdrawWayList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userWithdraw/api/withdrawWayList`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 获取提款详情配置
	getWithdrawConfig: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userWithdraw/api/getWithdrawConfig`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 会员提款申请
	withdrawApply: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userWithdraw/api/withdrawApply`, {
			method: "POST",
			data,
			headers: {
				showLoading: true,
			},
		});
	},

	// 获取提款汇率
	getWithdrawExchange: (data = {}, headers = { showLoading: true }) => {
		return useAxiosApi(`/app/userWithdraw/api/getWithdrawExchange`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 获取余额
	getUserPlatformBalance: (data = {}, headers = { showLoading: true }) => {
		return useAxiosApi(`/app/userPlatformCoin/api/getUserPlatformBalance`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 平台币转换
	transferAmount: (data = {}, headers = { showLoading: true }) => {
		return useAxiosApi(`/app/userPlatformCoin/api/transfer`, {
			method: "POST",
			data,
			headers,
		});
	},
};
