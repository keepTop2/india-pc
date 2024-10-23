import useAxiosApi from "/@/utils/useAxiosApi";

export const userApi = {
	// 登录
	getIndexInfo: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/user-info/api/getIndexInfo`, {
			method: "POST",
			data,
			headers,
		});
	},
	getCurrentBasicInfo: (data = {}, headers = { showLoading: false }) => {
		return useAxiosApi(`/app/common/getCurrentBasicInfo`, {
			method: "POST",
			data,
			headers,
		});
	},
	//安全中心基本信息
	getUserGlobalSetInfo: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/getUserGlobalSetInfo`, {
			method: "POST",
			data,
			headers,
		});
	},
	//修改密码
	changePassword: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/changePassword`, {
			method: "POST",
			data,
			headers,
		});
	},
	//发送手机验证码
	globalSendSms: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/sendSms`, {
			method: "POST",
			data,
			headers,
		});
	},
	//发送手机验证码
	globalSendMail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/sendMail`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 修改邮箱手机号码校验
	checkVerifyCode: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/checkVerifyCode`, {
			method: "POST",
			data,
			headers,
		});
	},

	// 绑定修改邮箱或手机
	bindAccount: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/bindAccount`, {
			method: "POST",
			data,
			headers,
		});
	},

	//绑定交易密码
	setWithdrawPwd: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/setWithdrawPwd`, {
			method: "POST",
			data,
			headers,
		});
	},
	//修改交易密码
	changeWithdrawPwd: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/changeWithdrawPwd`, {
			method: "POST",
			data,
			headers,
		});
	},
	//校验登陆密码
	reFindWithdrawPwd: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/reFindWithdrawPwd`, {
			method: "POST",
			data,
			headers,
		});
	},
	//重置交易密码
	reSetWithdrawPwd: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/user-info/global/reSetWithdrawPwd`, {
			method: "POST",
			data,
			headers,
		});
	},
	//意见反馈提交
	userFeedbackSubmit: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userFeedback/api/submit`, {
			method: "POST",
			data,
			headers,
		});
	},

	//意见反馈提交
	userFeedbackPageList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userFeedback/api/pageList`, {
			method: "POST",
			data,
			headers,
		});
	},
	//意见反馈提交
	userFeedbackDetail: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/userFeedback/api/detail`, {
			method: "POST",
			data,
			headers,
		});
	},
};
