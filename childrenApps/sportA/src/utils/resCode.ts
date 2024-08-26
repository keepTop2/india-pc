/**
 *@description 后端返回code枚举
 */
enum ResCode {
	/**
	 * @description 成功
	 */
	SUCCESS = 10000,

	/**
	 * @description token为空
	 */
	TOKEN_MISSION = 10006,

	/**
	 * @description 令牌错误
	 */
	TOKEN_INVALID = 10007,

	/**
	 * @description 登陆过期
	 */
	LOGIN_EXPIRE = 10008,

	/**
	 * @description 授权失败
	 */
	Authorization_Failed = 10014,

	/**
	 * @description 服务异常,请稍后再试
	 */
	ERR = 500,
	/**
	 * @description 服务维护
	 */
	SERVICE_MAINTENANCE = 10030,
	/**
	 * @description 区域限制
	 */
	REGIONAL_RESTRICTIONS = 10031,
}

export default ResCode;
