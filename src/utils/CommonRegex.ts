// 输入验证正则
export default {
	userAccountRegex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,11}$/,
	passWordregex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/,
};
