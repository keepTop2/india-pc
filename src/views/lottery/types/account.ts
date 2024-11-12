import { CurrencyCode } from "./base";

/**
 * @description 交易类型枚举
 */
export enum TransferType {
	PT = 1, // 普通投注
	ZH = 2, // 追号投注
	JJ = 3, // 奖金派发
	HJ = 4, // 和局退款
	GR = 5, // 个人撤单
	XT = 6, // 系统撤单
}

/**
 * @description 收支类型枚举
 */
export enum InOutType {
	IN = 1, // 收入
	OUT = 2, // 支出
}

/**
 * @description 账变错误码
 */
export enum AccountChangeErrorCode {
	EMPTY_PARAMS = "39001", // 入参为空
	INVALID_SIGN = "39041", // md5签名验证失败
	INVALID_USER = "39027", // 用户数据无效
	INVALID_INOUT = "39013", // 收入或支出类型有误
	INVALID_CURRENCY = "39040", // 币种有误
	INSUFFICIENT_BALANCE = "39028", // 用户余额不足
	SAVE_FAILED = "39038", // 保存数据失败
}

/**
 * @description 交易明细项
 */
export interface TransferDetail {
	transferType: TransferType; // 交易类型
	orderNo: string; // 订单号
	gameCode: string; // 彩种编号
	playCode: string; // 玩法编号
	tradeAmount: number; // 交易金额
	inOut: InOutType; // 收入或支出
}

/**
 * @description 账变请求参数
 */
export interface AccountChangeRequest {
	merchantCode: string; // 商户号
	userName: string; // 用户名称
	transferReference: string; // 交易凭证
	md5Sign: string; // md5签名
	transferType: TransferType; // 交易类型
	inOut: InOutType; // 收入或支出（总）
	totalAmount: number; // 总金额（大于0）
	currencyCode: CurrencyCode; // 币种
	timestamp: number; // 时间戳
	detail: TransferDetail[]; // 交易清单
}
