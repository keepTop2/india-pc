import useAxiosApi from "/@/utils/useAxiosApi";
class LoginApi {
	/**
	 *@description 验证码验证
	 */
	static verifyCode = (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/verifyCode`, {
			method: "POST",
			data,
			headers,
		});
	};

	/**
	 *@description 登录
	 */
	static userLogin = (data = {}, headers = {}) => {
		return useAxiosApi(`/app-foreign/login/api/userLogin`, {
			method: "POST",
			data,
			headers,
		});
	};
}
export default LoginApi;
