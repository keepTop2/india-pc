export interface CurrentRequestBasicInfoVO {
	/** 当前语言 */
	language?: string;
	/** 当前代理 */
	userAgent?: string;
	/** 当前域名 */
	referer?: string;
	/** 当前用户编号 */
	userId?: string;
	/** 当前用户账号 */
	userAccount?: string;
	/** 当前登录IP */
	loginIp?: string;
	/** 当前站点编号 */
	siteCode?: string;
	/** 当前时区 */
	timezone?: string;
	/** 设备类型 */
	deviceType?: number;
	/** 当前平台币种名称 */
	platCurrencyName?: string;
	/** 当前平台币种符号 */
	platCurrencySymbol?: string;
	/** 当前平台币种图标 */
	platCurrencyIcon?: string;
	/** 当前平台币种图标全路径 */
	platCurrencyIconFileUrl?: string;
	/** 数据脱敏 true 需要脱敏 false 不需要脱敏 */
	dataDesensitization?: boolean;
}

export interface ResponseVOCurrentRequestBasicInfoVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: CurrentRequestBasicInfoVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ResponseVOListWithdrawWayListVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: WithdrawWayListVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface WithdrawWayListVO {
	/** 提现类型CODE bank_card银行卡 electronic_wallet电子钱包 crypto_currency加密货币  */
	withdrawTypeCode?: string;
	/** 提现方式Id */
	id?: string;
	/** 提现方式 */
	withdrawWay?: string;
	/** 图标 */
	wayIcon?: string;
	/** 手续费 5 代表5% */
	wayFee?: number;
	/** 快捷金额，逗号隔开 */
	quickAmount?: string;
	/** 是否推荐 0:未推荐 1:推荐 */
	recommendFlag?: number;
	/** 网络协议类型 TRC20 ERC20 */
	networkType?: string;
	/** 币种 */
	currencyCode?: string;
}

export interface UserWithDrawApplyVO {
	/** 提现金额 */
	amount: number;
	/** 取款方式id */
	withdrawWayId?: string;
	/** 银行名称 */
	bankName?: string;
	/** 银行编码 */
	bankCode?: string;
	/** 银行卡号 */
	bankCard?: string;
	/** 姓 */
	surname?: string;
	/** 名 */
	userName?: string;
	/** 邮箱 */
	userEmail?: string;
	/** 手机区号 */
	areaCode?: string;
	/** 手机号 */
	userPhone?: string;
	/** 省 */
	provinceName?: string;
	/** 市 */
	cityName?: string;
	/** 详细地址 */
	detailAddress?: string;
	/** 电子账户 */
	userAccount?: string;
	/** 网络协议 */
	networkType?: string;
	/** 加密货币收款地址 */
	addressNo?: string;
	/** 取款密码 */
	withdrawPassWord?: string;
	/** 短信验证码 */
	smsCode?: string;
	/** 无注释 */
	origin?: number;
	/** 无注释 */
	applyIp?: string;
	/** 无注释 */
	deviceType?: string;
	/** 无注释 */
	deviceName?: string;
	/** 无注释 */
	applyDomain?: string;
	/** 无注释 */
	userId?: string;
}

export interface ResponseVOInteger {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: number;
	/** 无注释 */
	ok?: boolean;
}

export interface ResponseVOBigDecimal {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: number;
	/** 无注释 */
	ok?: boolean;
}

export interface WithdrawConfigRequestVO {
	/** 提款方式ID */
	withdrawWayId?: string;
	/** 无注释 */
	userId?: string;
}

export interface BankManageVO {
	/** 银行名称 */
	bankName?: string;
	/** 银行代码 */
	bankCode?: string;
	/** 图标 */
	icon?: string;
	/** 图标完整url */
	iconFileUrl?: string;
}

export interface LastWithdrawInfoVO {
	/** 银行名称 */
	bankName?: string;
	/** 银行编码 */
	bankCode?: string;
	/** 银行卡号 */
	bankCard?: string;
	/** 姓 */
	surname?: string;
	/** 名 */
	userName?: string;
	/** 邮箱 */
	userEmail?: string;
	/** 手机区号 */
	areaCode?: string;
	/** 手机号 */
	userPhone?: string;
	/** 省 */
	provinceName?: string;
	/** 市 */
	cityName?: string;
	/** 详细地址 */
	detailAddress?: string;
	/** 电子账户 */
	userAccount?: string;
	/** 网络协议 */
	networkType?: string;
	/** 加密货币收款地址 */
	addressNo?: string;
}

export interface ResponseVOWithdrawConfigVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: WithdrawConfigVO;
	/** 无注释 */
	ok?: boolean;
}

export interface WithdrawCollectInfoVO {
	/** code字段 */
	filedCode?: string;
	/** 名称 */
	filedCodeText?: string;
	/** 校验标志 */
	checkFlag?: boolean;
}

export interface WithdrawConfigVO {
	/** 提款方式ID */
	withdrawWayId?: string;
	/** 余额 */
	balance?: number;
	/** 汇率 */
	exchangeRate?: number;
	/** 提款最小值 */
	withdrawMinAmount?: number;
	/** 提款最大值 */
	withdrawMaxAmount?: number;
	/** 剩余流水 */
	remainingFlow?: number;
	/** 手续费率 */
	feeRate?: number;
	/** 是否存在通道 */
	isExistChannel?: boolean;
	/** 单日剩余免费提款次数 */
	singleDayRemindWithdrawCount?: number;
	/** 单日剩余免费提款总额 */
	singleDayRemindMaxWithdrawAmount?: number;
	/** 银行列表 */
	bankList?: BankManageVO[];
	/** 信息收集 bankName银行名称,bankCode 银行代码, bankCard银行卡号,userName姓名,userEmail邮箱,userPhone联系电话 ,provinceName省份,cityName城市,detailAddress详细地址,userAccount电子账户,networkType链网络类型,addressNo收款地址 */
	collectInfoVOS?: WithdrawCollectInfoVO[];
	/** 无注释 */
	lastWithdrawInfoVO?: LastWithdrawInfoVO;
	/** 网络协议类型 TRC20 ERC20 */
	networkType?: string;
}

export interface UserTradeRecordRequestVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 交易类型 全部类型传空 1存款 2取款 3平台币转换 */
	tradeType?: string;
	/** 交易状态 0处理中 1成功 2失败 */
	tradeStatus?: string;
	/** 时间范围(-1:昨天,-7:近7天,-15:近15天 -30:近30天) */
	dateNum?: number;
	/** 开始时间 */
	startTime?: number;
	/** 结束时间 */
	endTime?: number;
	/** 无注释 */
	userId?: string;
}

export interface OrderItem {
	/** 无注释 */
	column?: string;
	/** 无注释 */
	asc?: boolean;
}

export interface PageUserTradeRecordResponseVO {
	/** 无注释 */
	records?: UserTradeRecordResponseVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOPageUserTradeRecordResponseVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: PageUserTradeRecordResponseVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserTradeRecordResponseVO {
	/** 交易类型 1存款 2取款 3平台币转换 */
	tradeType?: string;
	/** 订单编号 */
	orderNo?: string;
	/** 交易时间 */
	tradeTime?: number;
	/** 交易金额 */
	tradeAmount?: number;
	/** 交易方式类型  bank_card_recharge:银行卡存款, electronic_wallet_recharge:电子钱包存款，crypto_currency_recharge:加密货币存款，manual_up:人工加额，superior_transfer:上级转入，manual_down:人工减额，platform_transfer:平台币转换，bank_card_withdraw:银行卡取款，electronic_wallet_withdraw:电子钱包取款，crypto_currency_withdraw:加密货币取款 */
	tradeWayType?: string;
	/** 交易方式类型名称 */
	tradeWayTypeText?: string;
	/** 交易状态 */
	tradeStatus?: string;
	/** 交易状态名称 */
	tradeStatusText?: string;
	/** 汇率 */
	exchangeRate?: number;
}

export interface UserTradeRecordDetailRequestVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 交易类型 取列表里面返回的 tradeType */
	tradeType?: string;
	/** 交易方式类型 取列表里面返回的 tradeWayType */
	tradeWayType?: string;
	/** 订单编号 */
	orderNo?: string;
	/** 无注释 */
	userId?: string;
}

export interface ResponseVOUserTradeRecordDetailResponseVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserTradeRecordDetailResponseVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserManualUpDownDetailVO {
	/** 订单编码 */
	orderNo?: string;
	/** 交易方式类型 */
	tradeWayType?: string;
	/** 交易方式类型名称 */
	tradeWayTypeText?: string;
	/** 到账金额 */
	arriveAmount?: number;
	/** 客户端状态 0处理中 1成功 2失败  */
	customerStatus?: string;
	/** 客户端状态名称 */
	customerStatusText?: string;
	/** 到账时间 */
	updatedTime?: number;
}

export interface UserPlatformTransferDetailVO {
	/** 订单编码 */
	orderNo?: string;
	/** 交易方式类型 */
	tradeWayType?: string;
	/** 交易方式类型名称 */
	tradeWayTypeText?: string;
	/** 到账金额 */
	arriveAmount?: number;
	/** 平台币转换金额 */
	transferAmount?: number;
	/** 转换汇率 */
	transferRate?: number;
	/** 客户端状态 0处理中 1成功 2失败  */
	customerStatus?: string;
	/** 客户端状态名称 */
	customerStatusText?: string;
	/** 转换时间 */
	updatedTime?: number;
}

export interface UserSuperTransferDetailVO {
	/** 订单编码 */
	orderNo?: string;
	/** 交易方式类型 */
	tradeWayType?: string;
	/** 交易方式类型名称 */
	tradeWayTypeText?: string;
	/** 上级代理 */
	superAgentAccount?: string;
	/** 到账金额 */
	arriveAmount?: number;
	/** 客户端状态 0处理中 1成功 2失败  */
	customerStatus?: string;
	/** 客户端状态名称 */
	customerStatusText?: string;
	/** 到账时间 */
	updatedTime?: number;
}

export interface UserTradeRecordDetailResponseVO {
	/** 无注释 */
	withdrawOrderDetailVO?: UserWithdrawDetailVO;
	/** 无注释 */
	manualUpDownDetailVO?: UserManualUpDownDetailVO;
	/** 无注释 */
	superTransferDetailVO?: UserSuperTransferDetailVO;
	/** 无注释 */
	platformTransferDetailVO?: UserPlatformTransferDetailVO;
}

export interface UserWithdrawDetailVO {
	/** 订单编码 */
	orderNo?: string;
	/** 交易方式类型 */
	tradeWayType?: string;
	/** 交易方式类型名称 */
	tradeWayTypeText?: string;
	/** 手续费 */
	feeAmount?: number;
	/** 申请金额 */
	applyAmount?: number;
	/** 到账金额 */
	arriveAmount?: number;
	/** 汇率 */
	exchangeRate?: number;
	/** 银行名称 */
	bankName?: string;
	/** 银行编码 */
	bankCode?: string;
	/** 银行卡号 */
	bankCard?: string;
	/** 姓 */
	surname?: string;
	/** 名 */
	userName?: string;
	/** 邮箱 */
	userEmail?: string;
	/** 手机区号 */
	areaCode?: string;
	/** 手机号 */
	userPhone?: string;
	/** 省 */
	provinceName?: string;
	/** 市 */
	cityName?: string;
	/** 详细地址 */
	detailAddress?: string;
	/** 电子账户 */
	userAccount?: string;
	/** 网络协议 */
	networkType?: string;
	/** 加密货币收款地址 */
	addressNo?: string;
	/** 申请时间 */
	cratedTime?: number;
	/** 到账时间 */
	updatedTime?: number;
	/** 客户端状态 0处理中 1成功 2失败  */
	customerStatus?: string;
	/** 客户端状态名称 */
	customerStatusText?: string;
}

export interface CodeValueVO {
	/** 无注释 */
	type?: string;
	/** 无注释 */
	code?: string;
	/** 无注释 */
	value?: string;
}

export interface ResponseVOMapStringListCodeValueVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: object;
	/** 无注释 */
	ok?: boolean;
}

export interface UserRechargeReqVO {
	/** 存款金额 */
	amount: number;
	/** 方式id */
	depositWayId?: string;
	/** 手机区号 */
	areaCode?: string;
	/** 手机号 */
	telephone?: string;
	/** 存充值名字 */
	depositName?: string;
	/** 无注释 */
	userId?: string;
	/** 无注释 */
	userAccount?: string;
	/** 无注释 */
	origin?: number;
	/** 无注释 */
	applyIp?: string;
	/** 无注释 */
	deviceType?: string;
	/** 无注释 */
	deviceName?: string;
	/** 无注释 */
	applyDomain?: string;
	/** 无注释 */
	siteCode?: string;
	/** 无注释 */
	orderNo?: string;
}

export interface OrderNoVO {
	/** 订单编码 */
	orderNo?: string;
	/** 通道类型 THIRD 三方，OFFLINE 线下 */
	channelType?: string;
	/** 三方支付URL路径 */
	thirdPayUrl?: string;
}

export interface ResponseVOOrderNoVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: OrderNoVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ResponseVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: object;
	/** 无注释 */
	ok?: boolean;
}

export interface DepositOrderFileVO {
	/** 订单编码 */
	orderNo?: string;
	/** 资金流水凭证图片 多个逗号隔开 */
	cashFlowFile?: string;
	/** 留言 */
	cashFlowRemark?: string;
}

export interface RechargeWayListVO {
	/** 充值类型Code bank_card银行卡 electronic_wallet电子钱包 crypto_currency加密货币  */
	rechargeTypeCode?: string;
	/** 充值方式ID */
	id?: string;
	/** 充值方式 */
	rechargeWay?: string;
	/** 图标 */
	wayIcon?: string;
	/** 图标 */
	wayIconUrl?: string;
	/** 手续费 5 代表5% */
	wayFee?: number;
	/** 快捷金额，逗号隔开 */
	quickAmount?: string;
	/** 充值最小值 */
	rechargeMin?: number;
	/** 充值最大值 */
	rechargeMax?: number;
	/** 是否推荐 0:未推荐 1:推荐 */
	recommendFlag?: number;
	/** 网络协议类型 TRC20 ERC20 */
	networkType?: string;
	/** 币种 */
	currencyCode?: string;
}

export interface ResponseVOListRechargeWayListVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: RechargeWayListVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface RechargeConfigRequestVO {
	/** 充值方式ID */
	rechargeWayId?: string;
	/** 无注释 */
	userAccount?: string;
	/** 无注释 */
	mainCurrency?: string;
	/** 无注释 */
	vipGradeCode?: number;
	/** 无注释 */
	siteCode?: string;
	/** 无注释 */
	userId?: string;
}

export interface RechargeConfigVO {
	/** 余额 */
	balance?: number;
	/** 汇率 */
	exchangeRate?: number;
	/** 充值最小值 */
	rechargeMinAmount?: number;
	/** 充值最大值 */
	rechargeMaxAmount?: number;
	/** 手续费率 */
	feeRate?: number;
	/** 是否已有三条充值中订单 0没有 1有 */
	haveThreeHandingOrder?: number;
	/** 加密货币地址 */
	address?: string;
	/** 快捷金额，逗号隔开 */
	quickAmount?: string;
	/** 币种 */
	currencyCode?: string;
	/** 充值方式ID */
	rechargeWayId?: string;
	/** 充值方式 */
	rechargeWay?: string;
	/** 是否提醒 1提醒 0不提醒 */
	isRemind?: number;
}

export interface ResponseVORechargeConfigVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: RechargeConfigVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ResponseVOUserDepositOrderDetailVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserDepositOrderDetailVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserDepositOrderDetailVO {
	/** 充值类型Code bank_card银行卡 electronic_wallet电子钱包 crypto_currency加密货币 bank_card_transfer银行转账  */
	depositWithdrawTypeCode?: string;
	/** 订单编码 */
	orderNo?: string;
	/** 充提方式 */
	depositWithdrawWay?: string;
	/** 存款通道类型(THIRD 三方，OFFLINE 线下） */
	depositWithdrawChannelType?: string;
	/** 实际交易金额 */
	tradeCurrencyAmount?: number;
	/** 订单金额 */
	applyAmount?: number;
	/** 存款汇率 */
	exchangeRate?: number;
	/** 手续费率 */
	feeRate?: number;
	/** 手续费 */
	feeAmount?: number;
	/** 客户端状态 0处理中 1成功 2失败  */
	customerStatus?: string;
	/** 客户端状态名称 */
	customerStatusText?: string;
	/** 充值时间 */
	createdTime?: number;
	/** 更新时间 */
	updatedTime?: number;
	/** 充值剩余时间 单位秒 */
	remindTime?: number;
	/** 充值户名 */
	accountName?: string;
	/** 充值账户地址 */
	accountAddress?: string;
	/** 凭证上传标志  0 未上传 1 已上传 */
	voucherFlag?: number;
	/** 资金流水凭证图片 多个逗号隔开 */
	cashFlowFile?: string;
	/** 资金流水凭证数组 */
	cashFlowFileList?: string[];
	/** 三方支付URL路径 */
	thirdPayUrl?: string;
	/** 催单标志(0未催单 1已催单) */
	urgeOrder?: number;
	/** 目标币种 */
	currencyCode?: string;
	/** 来源币种 */
	coinCode?: string;
}

export interface UserPlatformTransferVO {
	/** 转换金额 */
	transferAmount?: number;
}

export interface ResponseVOString {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: string;
	/** 无注释 */
	ok?: boolean;
}

export interface ResponseVOUserPlatformBalanceRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserPlatformBalanceRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserPlatformBalanceRespVO {
	/** 会员ID */
	userAccount?: string;
	/** 平台币可用金额 */
	platAvailableAmount?: number;
	/** 平台币币种 */
	platCurrency?: string;
	/** 转换汇率 */
	transferRate?: number;
	/** 用户可用金额 */
	userAvailableAmount?: number;
	/** 用户主货币 */
	userCurrencyCode?: string;
}

export interface SiteUserFeedbackAddVO {
	/** 反馈顶层ID */
	feedTopId?: string;
	/** 问题类型 */
	type?: number;
	/** 内容 */
	content?: string;
	/** 订单id */
	orderId?: string;
	/** 图片: 格式: 'picUrl1,picUrl2,picUrl3' */
	picUrls?: string;
}

export interface ResponseVOBoolean {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: boolean;
	/** 无注释 */
	ok?: boolean;
}

export interface SiteUserFeedbackAppPageReqVO {
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
}

export interface PageSiteUserFeedbackAppResVO {
	/** 无注释 */
	records?: SiteUserFeedbackAppResVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOPageSiteUserFeedbackAppResVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: PageSiteUserFeedbackAppResVO;
	/** 无注释 */
	ok?: boolean;
}

export interface SiteUserFeedbackAppResVO {
	/** id */
	id?: string;
	/** 问题类型 */
	type?: number;
	/** 问题类型文本 */
	typeText?: string;
	/** 无注释 */
	createdTime?: number;
	/** 意见内容 */
	content?: string;
	/** 无注释 */
	picUrls?: string;
	/** 是否已读 1 已读 | 0 未读 */
	isRead?: number;
}

export interface IdVO {
	/** id */
	id: string;
	/** 无注释 */
	dataDesensitization?: boolean;
}

export interface ResponseVOListSiteUserFeedbackDetailResVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SiteUserFeedbackDetailResVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface SiteUserFeedbackDetailResVO {
	/** 无注释 */
	id?: string;
	/** 问题类型 */
	type?: number;
	/** 问题类型 */
	typeText?: string;
	/** 相关订单号 */
	orderId?: string;
	/** 无注释 */
	createdTime?: number;
	/** 无注释 */
	content?: string;
	/** 无注释 */
	backContent?: string;
	/** 无注释 */
	backAccount?: string;
	/** 无注释 */
	backTime?: number;
	/** 无注释 */
	picUrls?: string;
	/** 回复层级 */
	sort?: number;
	/** 无注释 */
	userAccount?: string;
	/** 无注释 */
	avatarCode?: string;
}

export interface WelfareCenterRewardPageQueryVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 福利类型 */
	welfareCenterRewardType?: number;
	/** 领取状态 */
	receiveStatus?: number;
	/** 派发时间-开始时间 */
	pfTimeStartTime?: number;
	/** 派发时间-结束时间 */
	pfTimeEndTime?: number;
}

export interface PageWelfareCenterRewardRespVO {
	/** 无注释 */
	records?: WelfareCenterRewardRespVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOWelfareCenterRewardResultVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: WelfareCenterRewardResultVO;
	/** 无注释 */
	ok?: boolean;
}

export interface WelfareCenterRewardRespVO {
	/** 主键 */
	id?: string;
	/** 订单号 */
	orderNo?: string;
	/** 福利类型 */
	welfareCenterRewardType?: number;
	/** 福利类型 */
	welfareCenterRewardTypeText?: string;
	/** 领取状态 */
	receiveStatus?: number;
	/** 领取状态 */
	receiveStatusText?: string;
	/** 币种 */
	currencyCode?: string;
	/** 奖励金额 */
	amount?: number;
	/** 具体类型 */
	detailType?: string;
	/** 派发时间 */
	pfTime?: number;
	/** 可领取时间-为null代表长期 */
	pfEndTime?: number;
	/** 是否长期有效 0.否,1.是 为1时 下面时间差没有值 */
	isPermanentValidity?: number;
	/** 计算距离过期时间时间差,单位毫秒 */
	expiryTimeRemaining?: number;
}

export interface WelfareCenterRewardResultVO {
	/** 笔数 */
	totalSize?: number;
	/** 主货币 */
	mainCurrency?: string;
	/** 主货币总金额 */
	mainCurrencyTotal?: number;
	/** 平台币 */
	platCurrencyCode?: string;
	/** 平台币总金额 */
	platCurrencyTotal?: number;
	/** 待领取奖励数 */
	waitReceiveTotal?: number;
	/** 无注释 */
	pages?: PageWelfareCenterRewardRespVO;
}

export interface ReceiveVO {
	/** 主键 */
	id: string;
	/** 福利类型 */
	welfareCenterRewardType: number;
}

export interface ResponseVOWelfareCenterRewardRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: WelfareCenterRewardRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface SetWithdrawalPasswordReqVO {
	/** 新密码 */
	password: string;
	/** 确认密码 */
	confirmPassword: string;
}

export interface UserGetSmsCodeVO {
	/** 区号, 绑定手机时不能为空，区号和手机分开 */
	areaCode?: string;
	/** 手机号码 */
	phone: string;
}

export interface UserGetMailCodeVO {
	/** 邮箱 */
	email: string;
}

export interface ResponseVOObject {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: object;
	/** 无注释 */
	ok?: boolean;
}

export interface ChangeWithPasswordReqVO {
	/** 新密码 */
	newPassword: string;
	/** 确认密码 */
	confirmPassword: string;
	/** 无注释 */
	verifyCode?: string;
}

export interface ReFindWPwdVO {
	/** 类型  1  邮箱  2 手机号 */
	type: number;
	/** 登录密码 */
	password: string;
}

export interface ResponseVOUserGlobalSetResVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserGlobalSetResVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserGlobalSetResVO {
	/** 会员账号 */
	userAccount?: string;
	/** 昵称 */
	nickName?: string;
	/** 区号 */
	areaCode?: string;
	/** 手机号码, 空表示为绑定 */
	phone?: string;
	/** 邮箱， 空表示为绑定 */
	email?: string;
	/** 是否已交易密码 false 未设置 true 已设置 */
	isSetPwd?: boolean;
}

export interface SafeVerifyCodeVO {
	/** 类型  1  邮箱  2 手机号 */
	type: number;
	/** 无注释 */
	verifyCode: string;
}

export interface ChangePasswordReqVO {
	/** 旧密码 */
	oldPassword: string;
	/** 新密码 */
	newPassword: string;
	/** 确认密码 */
	confirmPassword: string;
	/** 无注释 */
	verifyCode?: string;
}

export interface BindAccountVO {
	/** 区号, 绑定手机时不能为空，区号和手机分开 */
	areaCode?: string;
	/** 邮箱或者手机号 */
	account: string;
	/** 类型  1  邮箱  2 手机号 */
	type: number;
	/** 无注释 */
	verifyCode: string;
}

export interface ResponseVOUserCenterMedalRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserCenterMedalRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserCenterMedalRespDetailVO {
	/** 展示顺序 */
	sortNum?: number;
	/** 站点代码 */
	siteCode?: string;
	/** 会员ID */
	userId?: string;
	/** 会员账号 */
	userAccount?: string;
	/** 勋章代码 */
	medalCode?: string;
	/** 勋章名称 */
	medalName?: string;
	/** 解锁条件名称 */
	unlockCondName?: string;
	/** 奖励金额 */
	rewardAmount?: number;
	/** 打码倍数 */
	typingMultiple?: number;
	/** 达成条件1 N */
	condNum1?: string;
	/** 达成条件2 N */
	condNum2?: string;
	/** 解锁条件说明 */
	medalDesc?: string;
	/** 激活图片 */
	activatedPic?: string;
	/** 激活图片完整路径 */
	activatedPicUrl?: string;
	/** 未激活图片 */
	inactivatedPic?: string;
	/** 未激活图片完整路径 */
	inactivatedPicUrl?: string;
	/** 解锁状态 0:可点亮 1:已点亮 2:未获得 */
	lockStatus?: number;
	/** 无注释 */
	lockStatusSortNum?: number;
	/** 解锁状态名称 */
	lockStatusName?: string;
	/** 勋章达成条件时间戳 */
	completeTimeStamp?: number;
	/** 点亮勋章时间戳 */
	unlockTimeStamp?: number;
	/** 勋章达成条件时间-按照站点时区格式化后的 */
	completeTime?: string;
	/** 点亮勋章时间-按照站点时区格式化后的  */
	unlockTime?: string;
	/** 勋章名称-多语言CODE */
	medalNameI18?: string;
	/** 勋章描述-多语言CODE */
	medalDescI18?: string;
}

export interface UserCenterMedalRespVO {
	/** 可点亮勋章数量 */
	canLightNum?: number;
	/** 用户个人中心TOP N勋章列表 */
	userCenterMedalDetailRespVoList?: UserCenterMedalRespDetailVO[];
}

export interface UserEditNameVO {
	/** 昵称 */
	nickName?: string;
	/** 用户头像code-从/common/getAvaList中获取到的列表的avatarId */
	avatarCode?: string;
}

export interface MedalRewardAcquireReqVO {
	/** 宝箱编号 */
	rewardNo: number;
}

export interface MedalRewardRemarkRespVO {
	/** 解锁数量 */
	unlockMedalNum?: number;
	/** 奖励金额 */
	rewardAmount?: number;
}

export interface ResponseVOMedalRewardRemarkRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: MedalRewardRemarkRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface MedalAcquireReqVO {
	/** 勋章代码 */
	medalCode: string;
}

export interface MedalRemarkRespVO {
	/** 勋章名称 */
	medalName?: string;
	/** 奖励金额 */
	rewardAmount?: number;
}

export interface ResponseVOMedalRemarkRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: MedalRemarkRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface MedalRewardRespVO {
	/** 站点代码 */
	siteCode?: string;
	/** 宝箱编号 */
	rewardNo?: number;
	/** 宝箱解锁条件数 */
	unlockMedalNum?: number;
	/** 奖励金额 */
	rewardAmount?: number;
	/** 打码倍数 */
	typingMultiple?: number;
	/** 会员账号 */
	userAccount?: string;
	/** 宝箱解锁条件数 */
	condNum?: number;
	/** 打开状态 0:可打开 1:已打开 2:未获得 */
	openStatus?: number;
}

export interface ResponseVOUserCenterMedalMyRespVo {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserCenterMedalMyRespVo;
	/** 无注释 */
	ok?: boolean;
}

export interface UserCenterMedalMyRespVo {
	/** 宝箱列表 */
	medalRewardRespVOS?: MedalRewardRespVO[];
	/** 勋章奖励备注列表  */
	rewardRemarkList?: MedalRewardRemarkRespVO[];
	/** 已解锁勋章列表 */
	hasUnlockList?: UserCenterMedalRespDetailVO[];
	/** 未解锁勋章列表 */
	notUnlockList?: UserCenterMedalRespDetailVO[];
}

export interface UserDataReq {
	/** 游戏ID */
	gameId?: string;
}

export interface ResponseVOUserDataVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserDataVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserDataDetailVO {
	/** 总胜利 */
	totalWins?: number;
	/** 总注单 */
	totalBet?: number;
	/** 总注单条数 */
	totalBetCount?: number;
}

export interface UserDataVO {
	/** 总胜利 */
	totalWins?: number;
	/** 总注单 */
	totalBet?: number;
	/** 总注单条数 */
	totalBetCount?: number;
	/** 注单集合 */
	betList?: UserDataDetailVO[];
}

export interface IndexVO {
	/** 余额 */
	balance?: number;
	/** 冻结金额 */
	freezeAmount?: number;
}

export interface ResponseVOIndexVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: IndexVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ResponseVOUserIndexInfoVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserIndexInfoVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserIndexInfoVO {
	/** 无注释 */
	userId?: string;
	/** 昵称 */
	nickName?: string;
	/** vip当前等级段位 */
	vipRank?: number;
	/** vip下一个等级段位 */
	nextVipRank?: number;
	/** 会员ID */
	userAccount?: string;
	/** vip当前等级 */
	vipGradeCode?: number;
	/** vip当前等级名称 */
	vipGradeName?: string;
	/** vip下一等级 */
	vipGradeUp?: number;
	/** vip下一等级名称 */
	vipGradeUpName?: string;
	/** 用户头像CODE */
	avatarCode?: string;
	/** 用户头像图片相对路径 */
	avatarImageUrl?: string;
	/** 用户头像图片完整路径 */
	avatarImageUrlFileUrl?: string;
	/** 总余额 */
	totalBalance?: number;
	/** 当前经验 */
	currentExperience?: number;
	/** 当前等级经验 */
	currentVipExp?: number;
	/** 下一等级经验 */
	nextExperience?: number;
	/** 主货币 */
	mainCurrency?: string;
	/** 主货币符号 */
	currencySymbol?: string;
	/** 主货币标识图片 */
	currencyIcon?: string;
	/** 主货币标识图片全路径 */
	currencyIconFileUrl?: string;
	/** 消息中心-未读消息数量 */
	unReadNoticeNums?: number;
}

export interface TutorialDownBoxResVo {
	/** 无注释 */
	siteCode?: string;
	/** 无注释 */
	categoryId?: number;
	/** 无注释 */
	categoryName?: string;
	/** 无注释 */
	classId?: number;
	/** 无注释 */
	className?: string;
	/** 无注释 */
	tabsId?: number;
	/** 无注释 */
	tabsName?: string;
	/** 无注释 */
	contentId?: number;
	/** 无注释 */
	position?: number;
	/** 无注释 */
	contentName?: string;
}

export interface ResponseVOListTutorialClientShowRspVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: TutorialClientShowRspVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface TutorialClientShowRspVO {
	/** 无注释 */
	id?: string;
	/** 无注释 */
	name?: string;
	/** 无注释 */
	icon?: string;
	/** 无注释 */
	value?: string;
	/** 无注释 */
	subset?: TutorialClientShowVO[];
}

export interface TutorialClientShowVO {
	/** 无注释 */
	id?: string;
	/** 无注释 */
	name?: string;
	/** 无注释 */
	icon?: string;
	/** 无注释 */
	value?: string;
}

export interface LoginVO {
	/** 无注释 */
	userAccount?: string;
	/** 无注释 */
	venueCode: string;
	/** 无注释 */
	gameCode?: string;
	/** 无注释 */
	ip?: string;
	/** 无注释 */
	currencyCode?: string;
	/** 无注释 */
	languageCode?: string;
}

export interface TaskReceiveAppReqVO {
	/** 任务配置id */
	id: string;
	/** 子任务类型 */
	subTaskType: string;
}

export interface ResponseVOTaskReceiveAppResVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: TaskReceiveAppResVO;
	/** 无注释 */
	ok?: boolean;
}

export interface TaskReceiveAppResVO {
	/** 彩金奖励 */
	rewardAmount?: number;
}

export interface APPTaskResponseVO {
	/** 无注释 */
	totalAmount?: number;
	/** 无注释 */
	weeklyTask?: TaskUserConfigAppResVO[];
	/** 无注释 */
	dailyTask?: TaskUserConfigAppResVO[];
	/** 无注释 */
	noviceTask?: TaskUserConfigAppResVO[];
	/** 无注释 */
	currency?: string;
	/** 无注释 */
	currencyName?: string;
	/** 无注释 */
	platCurrencySymbol?: string;
}

export interface ResponseVOAPPTaskResponseVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: APPTaskResponseVO;
	/** 无注释 */
	ok?: boolean;
}

export interface TaskUserConfigAppResVO {
	/** 任务配置Id */
	id?: string;
	/** 任务名称 */
	taskNameI18nCode?: string;
	/** 任务类型 */
	taskType?: string;
	/** 子任务类型 */
	subTaskType?: string;
	/** 最小配置金额/盈利/负盈利 */
	minBetAmount?: number;
	/** 会员在当周或者当日达到的投注金额/盈利/负盈利 */
	achieveAmount?: number;
	/** 彩金奖励 */
	rewardAmount?: number;
	/** 移动端任务图标 */
	taskPictureI18nCode?: string;
	/** PC任务图标 */
	taskPicturePcI18nCode?: string;
	/** 任务说明 */
	taskDescI18nCode?: string;
	/** 任务描述 */
	taskDescriptionI18nCode?: string;
	/** 无注释 */
	sort?: number;
	/** 无注释 */
	status?: number;
	/** 状态 3- 未完成，0-已完成 1-已领取 2-已经过期  */
	taskStatus?: number;
	/** 状态 3未完成，0已完成 1 已领取 2已经过期  */
	taskStatusText?: string;
	/** 过期时间,单位秒  */
	expireTime?: number;
	/** 货币 */
	currency?: string;
	/** 无注释 */
	currencyName?: string;
	/** 无注释 */
	platCurrencySymbol?: string;
}

export interface SportUnFollowReq {
	/** 无注释 */
	thirdId: string[];
}

export interface PublicSettingsReq {
	/** 无注释 */
	type?: string;
	/** 无注释 */
	value?: string;
}

export interface SportFollowReq {
	/** 无注释 */
	thirdId?: string;
	/** 无注释 */
	type?: string;
}

export interface ResponseVOListSportFollowDetailVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SportFollowDetailVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface SportFollowDetailVO {
	/** 无注释 */
	type?: string;
	/** 无注释 */
	list?: SportFollowVO[];
}

export interface SportFollowVO {
	/** 无注释 */
	type?: string;
	/** 无注释 */
	thirdId?: string;
	/** 无注释 */
	id?: string;
}

export interface PublicSettingsVO {
	/** 无注释 */
	type?: string;
	/** 无注释 */
	value?: string;
}

export interface ResponseVOListPublicSettingsVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: PublicSettingsVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface OrderRecordClientReqVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 游戏类别 */
	venueType: number;
	/** 注单状态 数组 */
	orderClassifyList?: integer[];
	/** 投注开始时间 */
	betStartTime: number;
	/** 投注结束时间 */
	betEndTime: number;
}

export interface BasicOrderClientResVO {
	/** 注单号 */
	orderId?: string;
	/** 三方游戏id */
	thirdGameCode?: string;
	/** 游戏名称 */
	gameName?: string;
	/** 投注金额 */
	betAmount?: number;
	/** 输赢金额 */
	winLossAmount?: number;
	/** 投注时间 */
	betTime?: number;
	/** 无注释 */
	orderClassify?: number;
	/** 注单状态-文本 */
	orderClassifyText?: string;
}

export interface ClientOrderTotalVO {
	/** 投注金额 */
	betAmount?: number;
	/** 输赢金额 */
	winLoseAmount?: number;
	/** 投注笔数 */
	betNum?: number;
}

export interface EventOrderClientResVO {
	/** 注单号 */
	orderId?: string;
	/** 赛事信息 */
	eventInfo?: string;
	/** 队伍信息 */
	teamInfo?: string;
	/** 投注内容 */
	betContent?: string;
	/** 投注金额 */
	betAmount?: number;
	/** 输赢金额 */
	winLossAmount?: number;
	/** 赔率 */
	odds?: number;
	/** 投注时间 */
	betTime?: number;
	/** 注单状态 */
	orderClassify?: number;
	/** 注单状态-文本 */
	orderClassifyText?: string;
	/** 是否串关 true:是 false:否 */
	multipleBet?: boolean;
	/** 串关注单信息 */
	orderMultipleBetList?: OrderMultipleBetVO[];
}

export interface OrderMultipleBetVO {
	/** 注单号 */
	orderId?: string;
	/** 赛事信息 */
	eventInfo?: string;
	/** 队伍信息 */
	teamInfo?: string;
	/** 投注内容 */
	betContent?: string;
	/** 投注金额 */
	betAmount?: number;
	/** 输赢金额 */
	winLossAmount?: number;
	/** 赔率 */
	odds?: number;
	/** 输赢状态 赢1 和0 输-1 */
	winlossStatus?: number;
	/** 输赢状态-文本 */
	winlossStatusText?: string;
	/** 注单状态 */
	orderClassify?: number;
	/** 注单状态-文本 */
	orderClassifyText?: string;
}

export interface OrderRecordClientRespVO {
	/** 无注释 */
	eventOrderPage?: PageEventOrderClientResVO;
	/** 赛事注单信息 沙巴专属 */
	sabOrderList?: EventOrderClientResVO[];
	/** 无注释 */
	basicOrderPage?: PageBasicOrderClientResVO;
	/** 无注释 */
	tableOrderPage?: PageTableOrderClientResVO;
	/** 无注释 */
	totalVO?: ClientOrderTotalVO;
}

export interface PageBasicOrderClientResVO {
	/** 无注释 */
	records?: BasicOrderClientResVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface PageEventOrderClientResVO {
	/** 无注释 */
	records?: EventOrderClientResVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface PageTableOrderClientResVO {
	/** 无注释 */
	records?: TableOrderClientResVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOOrderRecordClientRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: OrderRecordClientRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface TableOrderClientResVO {
	/** 注单号 */
	orderId?: string;
	/** 游戏id */
	gameId?: string;
	/** 游戏名称 */
	gameName?: string;
	/** 游戏名称-文本 */
	gameNameText?: string;
	/** 投注内容 */
	betContent?: string;
	/** 局号 */
	gameNo?: string;
	/** 桌号 */
	deskNo?: string;
	/** 投注结果 */
	resultList?: string;
	/** 投注金额 */
	betAmount?: number;
	/** 输赢金额 */
	winLossAmount?: number;
	/** 赔率 */
	odds?: string;
	/** 投注时间 */
	betTime?: number;
	/** 无注释 */
	orderClassify?: number;
	/** 注单状态-文本 */
	orderClassifyText?: string;
}

export interface VerifyReq {
	/** 三方回传的参数 */
	captchaVerifyParam?: string;
}

export interface UserRegisterVO {
	/** 账号 */
	userAccount: string;
	/** 密码 */
	password: string;
	/** 确认登录密码密码 */
	confirmPassword: string;
	/** 无注释 */
	mainCurrency: string;
	/** 无注释 */
	inviteCode?: string;
	/** 设备号 */
	deviceNo?: string;
	/** 验证ID，verifyCode 接口中的参数 */
	certifyId?: string;
	/** 设备版本 */
	deviceVersion?: string;
}

export interface ResponseVOUserLoginRspVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserLoginRspVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserIpVO {
	/** 无注释 */
	countryCode?: string;
	/** 无注释 */
	city?: string;
	/** 无注释 */
	region?: string;
	/** 无注释 */
	ip?: string;
}

export interface UserLoginRspVO {
	/** 会员账号 */
	userAccount?: string;
	/** 会员ID */
	userId?: string;
	/** 账号类型 1测试 2正式 */
	accountType?: number;
	/** 账号状态 1正常 2登录锁定 3游戏锁定 4充提锁定 */
	accountStatus?: string;
	/** 无注释 */
	userIpVO?: UserIpVO;
	/** token */
	token?: string;
	/** 主货币 */
	mainCurrency?: string;
}

export interface UserLoginVO {
	/** 账号 */
	userAccount: string;
	/** 密码 */
	password: string;
	/** 设备号 */
	deviceNo?: string;
	/** 验证ID，verifyCode 接口中的参数 */
	certifyId?: string;
	/** 设备版本 */
	deviceVersion?: string;
}

export interface AccountCheckVO {
	/** 账号 */
	userAccount: string;
}

export interface LoginGetSmsCodeVO {
	/** 账号 */
	userAccount: string;
	/** 手机号码 */
	phone: string;
	/** 区号 */
	areaCode: string;
}

export interface LoginGetMailCodeVO {
	/** 账号 */
	userAccount: string;
	/** 邮箱 */
	email: string;
}

export interface ResetPasswordVO {
	/** 账号 */
	userAccount: string;
	/** 邮箱或者手机号 */
	account: string;
	/** 新密码 */
	newPassword: string;
	/** 确认密码 */
	confirmPassword: string;
}

export interface ResponseVOUserAgreementVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserAgreementVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserAgreementVO {
	/** 无注释 */
	id?: string;
	/** 无注释 */
	creator?: string;
	/** 无注释 */
	createdTime?: number;
	/** 无注释 */
	updater?: string;
	/** 无注释 */
	updatedTime?: number;
	/** siteCode */
	siteCode?: string;
	/** 语言 */
	language?: string;
	/** 协议 */
	agreement?: string;
	/** 语言名称 */
	languageName?: string;
	/** 展示code */
	showCode?: string;
}

export interface VerifyCodeVO {
	/** 会员账号 */
	userAccount: string;
	/** 区号 */
	areaCode?: string;
	/** 邮箱或者手机号 */
	account: string;
	/** 类型  1  邮箱  2 手机号 */
	type: number;
	/** 无注释 */
	verifyCode: string;
}

export interface LobbySportEventsVO {
	/** 赛事ID */
	eventsId: string;
}

export interface ResponseVOListLobbySportEventsVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: LobbySportEventsVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface LobbyPaymentVendorVO {
	/** id */
	id?: string;
	/** 名称 */
	name?: string;
	/** 图标 */
	icon?: string;
}

export interface ResponseVOListLobbyPaymentVendorVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: LobbyPaymentVendorVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface LobbyGameInfoVO {
	/** id */
	id?: string;
	/** 名称 */
	name?: string;
	/** 图标 */
	icon?: string;
	/** 状态:1:开启中,2:维护中,3:已禁用 */
	status?: number;
	/** 备注 */
	remark?: string;
	/** 排序 */
	sort?: number;
	/** 场馆CODE */
	venueCode?: string;
	/** 游戏CODE */
	gameCode?: string;
	/** 标签 0:无,1:热门推荐 2:喜欢的游戏 */
	label?: number;
	/** 角标 0:无,1:News 2:Hot */
	cornerLabels?: number;
	/** 维护开始时间 */
	maintenanceStartTime?: number;
	/** 维护结束时间 */
	maintenanceEndTime?: number;
	/** 是否收藏:true:是,false:否 */
	collect?: boolean;
}

export interface LobbyTopGameVO {
	/** 一级分类ID */
	gameOneId?: string;
	/** 二级分类ID */
	gameTwoId?: string;
	/** 名称 */
	name?: string;
	/** 图片 */
	icon?: string;
	/** 首页排序 */
	homeSort?: number;
	/** 是否更多游戏: true=更多 */
	hasMoreGames?: boolean;
	/** 无注释 */
	modelCode?: string;
	/** 热门游戏-子列表 */
	gameInfoList?: LobbyGameInfoVO[];
}

export interface ResponseVOListLobbyTopGameVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: LobbyTopGameVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface LobbyGameOneVO {
	/** 无注释 */
	gameOneClassId?: string;
	/** 无注释 */
	directoryName?: string;
	/** 无注释 */
	homeName?: string;
	/** 无注释 */
	icon?: string;
	/** 无注释 */
	modelCode?: string;
	/** 二级列表 */
	twoList?: LobbyGameTwoVO[];
	/** 无注释 */
	gameInfo?: LobbyGameInfoVO;
}

export interface LobbyGameTwoVO {
	/** id */
	id?: string;
	/** 名称 */
	name?: string;
	/** 排序 */
	sort?: number;
}

export interface ResponseVOListLobbyGameOneVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: LobbyGameOneVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface LobbyLabelActivitySwitchResVO {
	/**   返回的活动模板代表开启.活动模板:  RED_BAG_RAIN:红包雨     FIRST_DEPOSIT,首存活动     SECOND_DEPOSIT,次存活动     FREE_WHEEL,免费旋转     ASSIGN_DAY,指定日期存款     LOSS_IN_SPORTS,体育负盈利     DAILY_COMPETITION,每日竞赛     SPIN_WHEEL,转盘 */
	activityTemplate?: string[];
}

export interface ResponseVOLobbyLabelActivitySwitchResVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: LobbyLabelActivitySwitchResVO;
	/** 无注释 */
	ok?: boolean;
}

export interface LobbyGameDetailRequestVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 一级分类ID */
	gameOneId?: string;
	/** 二级分类ID */
	gameTwoId?: string;
	/** 标签类型:0:无,1:热门-推荐,2:新游戏 */
	label?: number;
	/** 模糊查询游戏名称 */
	gameNameCode?: string;
}

export interface PageLobbyGameInfoVO {
	/** 无注释 */
	records?: LobbyGameInfoVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOPageLobbyGameInfoVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: PageLobbyGameInfoVO;
	/** 无注释 */
	ok?: boolean;
}

export interface LobbyQueryTwoDetailRequestVO {
	/** 一级分类ID */
	gameOneId: string;
}

export interface LobbyGameTwoDetailVO {
	/** id */
	id?: string;
	/** 名称 */
	name?: string;
	/** 标签:0:无,1:热门,2:新游戏 */
	label?: number;
	/** 是否更多游戏: true=更多 */
	hasMoreGames?: boolean;
	/** 子列表 */
	gameInfoList?: LobbyGameInfoVO[];
}

export interface ResponseVOListLobbyGameTwoDetailVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: LobbyGameTwoDetailVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface LobbyGameNameRequestVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 模糊查询游戏名称 */
	gameName: string;
}

export interface LobbyBannerReqVO {
	/** 一级分类ID,0:首页,SBA:沙巴体育 */
	gameOneClassId: string;
}

export interface LobbyBannerResVO {
	/** 无注释 */
	id?: string;
	/** 是否跳转（0 - 否, 1 - 是） */
	isRedirect?: number;
	/** 无注释 */
	icon?: string;
	/** 无注释 */
	gameCode?: string;
	/** 无注释 */
	venueCode?: string;
	/** 无注释 */
	activityTemplate?: string;
	/** 无注释 */
	template?: number;
	/** 无注释 */
	url?: string;
	/** 无注释 */
	activityId?: string;
}

export interface ResponseVOListLobbyBannerResVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: LobbyBannerResVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface PageVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
}

export interface LobbyGameCollectionRequestVO {
	/** gameId */
	gameId: string;
	/** true:收藏,false:取消收藏 */
	type: boolean;
}

export interface ResponseVOMapStringObject {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: object;
	/** 无注释 */
	ok?: boolean;
}

export interface ClientCustomerChannelVO {
	/** 通道代码 */
	channelCode?: string;
	/** 通道名称 */
	channelName?: string;
	/** 客服类型;1-在线客服 */
	customerType?: number;
	/** 客服类型名称 */
	customerTypeText?: string;
	/** 通道地址 */
	channelAddr?: string;
}

export interface ResponseVOClientCustomerChannelVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ClientCustomerChannelVO;
	/** 无注释 */
	ok?: boolean;
}

export interface CommonDownBoxIosVO {
	/** 无注释 */
	types: string[];
}

export interface ResponseVOListSiteCurrencyInfoRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SiteCurrencyInfoRespVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface SiteCurrencyInfoRespVO {
	/** 主键ID */
	id?: string;
	/** 创建人 */
	creator?: string;
	/** 创建时间 */
	createdTime?: number;
	/** 修改人 */
	updater?: string;
	/** 修改时间 */
	updatedTime?: number;
	/** 无注释 */
	siteCode?: string;
	/** 无注释 */
	platCurrencyCode?: string;
	/** 平台币简称 */
	platCurrencyName?: string;
	/** 平台币符号 */
	platCurrencySymbol?: string;
	/** 平台币图标 */
	platCurrencyIcon?: string;
	/** 平台币图标全路径 */
	platCurrencyIconFileUrl?: string;
	/** 货币代码 */
	currencyCode?: string;
	/** 货币名称 中文 */
	currencyName?: string;
	/** 货币名称 多语言 */
	currencyNameI18?: string;
	/** 货币符号 */
	currencySymbol?: string;
	/** 精度 TWO:2位小数 K:千位 */
	currencyDecimal?: string;
	/** 精度描述 */
	currencyDecimalText?: string;
	/** 图标 */
	currencyIcon?: string;
	/** 图标全路径 */
	currencyIconFileUrl?: string;
	/** 排序 */
	sortOrder?: number;
	/** 状态 0:禁用 1:启用 */
	status?: number;
	/** 状态描述多语言 */
	statusText?: string;
	/** 转换汇率 */
	finalRate?: number;
}

export interface AreaSiteLangVO {
	/** 区号 */
	areaCode?: string;
	/** 国家名称 */
	countryName?: string;
	/** 国家简写 */
	countryCode?: string;
	/** 图标地址 */
	icon?: string;
	/** 无注释 */
	maxLength?: number;
	/** 无注释 */
	minLength?: number;
}

export interface ResponseVOListAreaSiteLangVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: AreaSiteLangVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface UserNoticeSetReadStateReqVO {
	/** 无注释 */
	targetId?: string;
	/** 无注释 */
	deviceTerminal?: string;
	/** 无注释 */
	status?: number;
}

export interface UserNoticeReqVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 无注释 */
	noticeType: number;
	/** 无注释 */
	deviceTerminal?: string;
}

export interface PageUserNoticeRespVO {
	/** 无注释 */
	records?: UserNoticeRespVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOPageUserNoticeRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: PageUserNoticeRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserNoticeRespVO {
	/** 无注释 */
	targetId?: string;
	/** 无注释 */
	noticeType?: number;
	/** 无注释 */
	noticeTitleI18nCode?: string;
	/** 无注释 */
	messageContentI18nCode?: string;
	/** 无注释 */
	readState?: number;
	/** 无注释 */
	createdTime?: number;
	/** 无注释 */
	createdTimeStr?: string;
}

export interface ResponseVOUserNoticeHeadRspVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserNoticeHeadRspVO;
	/** 无注释 */
	ok?: boolean;
}

export interface UserNoticeHeadRspVO {
	/** 无注释 */
	userNoticeList?: UserNoticeRespVO[];
}

export interface RedBagParticipateReqVO {
	/** 场次id */
	redbagSessionId?: string;
}

export interface ResponseVOToActivityVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ToActivityVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ToActivityVO {
	/** 状态CODE,10000=success,30045=很抱歉。您不符合参与活动条件 参与活动前需要验证绑定您的手机号,请尽快完善资料30053=很抱歉。您不符合参与活动条件 参与活动前需要验证绑定您的邮箱，请尽快完善资料30046=很抱歉。您不符合参与活动条件 您所在IP已有账号参与该活动30048 = 很抱歉。您不符合参与活动条件30047 = 很抱歉。不可以重复参与30049=您还未存款80027:活动未开启 */
	status?: number;
	/** 说明 */
	message?: string;
}

export interface RedBagRainClientInfoVO {
	/** 倒计时 进行中活动 秒 */
	advanceTime?: number;
	/** 红包掉落时间 秒 */
	dropTime?: number;
	/** 进行中活动sessionId */
	redbagSessionId?: string;
	/** 当前状态 0 活动未开始 1 活动进行中 2 活动已全部结束，advanceTime为 -1 */
	clientStatus?: number;
	/** 场次信息 */
	sessionInfoList?: RedBagSessionInfoVO[];
	/** 中奖名单 */
	winnerList?: RedBagWinnerVO[];
	/** 活动title */
	activityNameI18nCode?: string;
	/** 活动规则 */
	ruleDesc?: string;
	/** 活动头图-移动端 */
	headPictureI18nCode?: string;
	/** 活动头图-PC */
	headPicturePcI18nCode?: string;
}

export interface RedBagSessionInfoVO {
	/** 红包场次id */
	redbagSessionId?: string;
	/** 开始时间 时间戳 */
	startTime?: number;
	/** 结束时间 时间戳 */
	endTime?: number;
	/** 结束标识  0 未开始 1 进行中 2 已结束 */
	status?: number;
}

export interface RedBagWinnerVO {
	/** 会员id */
	userId?: string;
	/** 会员账号 */
	userAccount?: string;
	/** 红包金额 */
	redBagAmount?: number;
	/** 中奖时间 时间戳 */
	hitTime?: number;
}

export interface ResponseVORedBagRainClientInfoVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: RedBagRainClientInfoVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivityConfigDetailReq {
	/** 活动请求模板:红包雨:RED_ENVELOPE_RAIN, 首存活动:FIRST_DEPOSIT, 次存:SECOND_DEPOSIT, 免费旋转:FREE_WHEEL, 指定日期存款:ASSIGN_DAY, 体育负盈利:LOSS_IN_SPORTS, 流水排行榜:TURNOVER_RANKING, 每日竞赛:DAILY_COMPETITION:转盘:SPIN_WHEEL */
	activityTemplate: string;
	/** id */
	id?: string;
	/** id */
	ids?: string[];
	/** 无注释 */
	activityStartTime?: number;
	/** 无注释 */
	activityEndTime?: number;
	/** 无注释 */
	showStartTime?: number;
	/** 无注释 */
	showEndTime?: number;
	/** 无注释 */
	showTerminal?: string;
	/** 无注释 */
	accountType?: string;
	/** 无注释 */
	activityDeadline?: number;
}

export interface ActivityOrderRecordReqVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 0代表空,-1昨天,-3 最近三天，-7最近7天 */
	dateNum?: number;
	/** 开始时间 */
	startTime?: number;
	/** 结束时间 */
	endTime?: number;
	/** ID */
	id?: string;
	/** 活动名称 */
	activityName?: string;
	/** 用户名称 */
	userAccount?: string;
	/** 订单号 */
	orderNo?: string;
	/** 时间类型，字典CODE:release_time_type */
	releaseTimeType?: number;
	/** 领取状态，字典CODE:activity_receive_status */
	receiveStatus?: number;
}

export interface ActivityOrderRecordForSpinWheelRespVO {
	/** 活动模板 */
	activityTemplate?: string;
	/** 备注 */
	remark?: string;
	/** 领取时间 */
	receiveTime?: number;
	/** 转盘奖品段位 */
	rewardRank?: number;
	/** 转盘奖品段位 */
	rewardRankText?: string;
	/** 奖品类型 */
	prizeType?: string;
	/** 奖品类型 */
	prizeTypeText?: string;
	/** 奖品名称 */
	prizeName?: string;
	/** 活动赠送金额 */
	activityAmount?: number;
	/** 币种 */
	currencyCode?: string;
}

export interface PageActivityOrderRecordForSpinWheelRespVO {
	/** 无注释 */
	records?: ActivityOrderRecordForSpinWheelRespVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOPageActivityOrderRecordForSpinWheelRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: PageActivityOrderRecordForSpinWheelRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivityPartOrderRecordReqVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 领取状态，-1:查全部,0:未领取,1:已领取,2:已过期 */
	receiveStatus?: number;
	/** -1昨天,-3 最近三天，-7最近7天 */
	dateNum?: number;
	/** 自定义查询开始时间 */
	startTime?: string;
	/** 自定义查询结束时间 */
	endTime?: number;
}

export interface ActivityOrderRecordDetailPartRespVO {
	/** 无注释 */
	id?: string;
	/** 活动模板 */
	activityTemplate?: string;
	/** 领取状态，0:未领取,1:已领取,2:已过期 */
	receiveStatus?: number;
	/** 活动赠送金额 */
	activityAmount?: number;
	/** 币种 */
	currencyCode?: string;
	/** 活动名称 */
	activityNameI18nCode?: string;
	/** 发放时间 */
	createdTime?: number;
}

export interface ActivityOrderRecordPartRespVO {
	/** 总金额 */
	totalAmount?: number;
	/** 无注释 */
	page?: PageActivityOrderRecordDetailPartRespVO;
}

export interface PageActivityOrderRecordDetailPartRespVO {
	/** 无注释 */
	records?: ActivityOrderRecordDetailPartRespVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOActivityOrderRecordPartRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ActivityOrderRecordPartRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivityDailyContestReqVO {
	/** id */
	id: string;
	/** 时间,年月日,yyyy-MM-dd */
	day?: string;
}

export interface ActivityPartDailyRecordRespVO {
	/** 今日活动时间 */
	time?: string;
	/** 今日排名信息 */
	list?: ActivityPartUserRankingDailyRespVO[];
}

export interface ActivityPartUserRankingDailyRespVO {
	/** 排名 */
	ranking?: number;
	/** 账号 */
	userAccount?: string;
	/** 投注金额 */
	betAmount?: number;
	/** 奖金 */
	awardAmount?: number;
	/** true=是当前用户,高亮显示,false=不需要高亮显示 */
	specialShow?: boolean;
	/** 币种符号 */
	currencySymbol?: string;
}

export interface ResponseVOActivityPartDailyRecordRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ActivityPartDailyRecordRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivityPartDailyCompletionRespVO {
	/** 无注释 */
	id?: string;
	/** true=活动详情页面,false=活动空页面 */
	type?: boolean;
	/** 总奖池 */
	totalRewardsAmount?: number;
	/** 币种符号 */
	currencySymbol?: string;
	/** 活动名称 */
	activityName?: string;
	/** 秒 */
	second?: number;
	/** 今日活动时间 */
	time?: string;
	/** 活动规则 */
	activityRule?: string;
	/** 无注释 */
	previous?: ActivityPartDailyPreviousRespVO;
	/** 无注释 */
	user?: ActivityPartDailyCompletionUserRespVO;
	/** 今日排名信息 */
	list?: ActivityPartUserRankingDailyRespVO[];
}

export interface ActivityPartDailyCompletionUserRespVO {
	/** 排名 */
	ranking?: number;
	/** 账号 */
	userAccount?: string;
	/** 头像 */
	icon?: string;
	/** 投注金额 */
	betAmount?: number;
	/** 距离上榜投注金额 */
	lackBetAmount?: number;
	/** 币种符号 */
	currencySymbol?: string;
	/** 0:未上榜,1:第一名,2:已上榜 */
	userStatus?: number;
}

export interface ActivityPartDailyPreviousRespVO {
	/** 排名 */
	ranking?: number;
	/** 账号 */
	userAccount?: string;
	/** 奖金 */
	awardAmount?: number;
	/** 头像 */
	icon?: string;
	/** 彩金百分比 */
	activityAmountPer?: number;
	/** 币种符号 */
	currencySymbol?: string;
	/** 优惠方式:0:百分比,1:固定金额 */
	activityDiscountType?: number;
}

export interface ResponseVOActivityPartDailyCompletionRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ActivityPartDailyCompletionRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivityPartDailyCompletionVenueDetailRespVO {
	/** 活动名称 */
	activityName?: string;
	/** 无注释 */
	id?: string;
}

export interface ActivityPartDailyCompletionVenueRespVO {
	/** 每日竞赛活动名称 */
	activityNameI18nCode?: string;
	/** 每日竞赛-场馆列表 */
	list?: ActivityPartDailyCompletionVenueDetailRespVO[];
}

export interface ResponseVOActivityPartDailyCompletionVenueRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ActivityPartDailyCompletionVenueRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivityTemplateCheckReqVO {
	/** 活动模板 */
	activityTemplate: string;
}

export interface ActivityConfigDetailVO {
	/** 无注释 */
	activityNameI18nCode?: string;
	/** 入口图-移动端 */
	entrancePictureI18nCode?: string;
	/** 入口图-PC端 */
	entrancePicturePcI18nCode: string;
	/** 活动头图-移动端 */
	headPictureI18nCode: string;
	/** 活动头图-PC端 */
	headPicturePcI18nCode: string;
	/** 活动对象-0:全体会员,1:新注册会员 */
	userType: number;
	/** 活动对象-多语言名称 */
	userTypeText: string;
	/** 无注释 */
	activityDeadline?: number;
	/** 无注释 */
	activityStartTime: number;
	/** 无注释 */
	activityEndTime: number;
	/** 活动描述-多语言 */
	activityDescI18nCode: string;
	/** 活动规则-多语言 */
	activityRuleI18nCode: string;
	/** 存款总金额 */
	depositAmount: number;
	/** 存款总金额-货币类型 */
	depositCurrencyCode: string;
	/** 活动彩金总金额 */
	activityAmount: number;
	/** 活动彩金总金额-货币类型 */
	activityAmountCurrencyCode: string;
	/** 需打流水 */
	runningWater?: number;
	/** 需打流水-货币类型 */
	runningWaterCurrencyCode?: string;
	/** 参与资格:true=可以参与,false=不可以参与 */
	activityCondition?: boolean;
	/** 参与方式,0.手动参与，1.自动参与 */
	participationMode?: number;
	/** 状态CODE,10000=立即参与,30047=已参与过该活动 */
	status?: number;
}

export interface ResponseVOActivityConfigDetailVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ActivityConfigDetailVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivityBasePartReqVO {
	/** 无注释 */
	orderField?: string;
	/** 无注释 */
	orderType?: string;
	/** 无注释 */
	orderName?: string;
	/** 无注释 */
	orderValue?: string;
	/** 无注释 */
	pageNumber?: number;
	/** 无注释 */
	pageSize?: number;
	/** 无注释 */
	includeColumnList?: string[];
	/** 无注释 */
	id?: string;
	/** 无注释 */
	labelId?: string;
	/** 无注释 */
	activityTemplate?: string;
	/** 无注释 */
	showTerminals?: string[];
	/** 无注释 */
	showTerminal?: string;
	/** 无注释 */
	operator?: string;
}

export interface ActivityBasePartRespVO {
	/** 无注释 */
	id?: string;
	/** 无注释 */
	activityNameI18nCode?: string;
	/** 无注释 */
	activityTemplate?: string;
	/** 无注释 */
	entrancePictureI18nCode?: string;
	/** 无注释 */
	entrancePicturePcI18nCode?: string;
	/** 无注释 */
	headPictureI18nCode?: string;
	/** 无注释 */
	headPicturePcI18nCode?: string;
	/** 无注释 */
	activityDeadline?: number;
	/** 活动开始时间 */
	activityStartTime?: number;
	/** 活动结束时间 */
	activityEndTime?: number;
	/** 无注释 */
	showStartTime?: number;
	/** 无注释 */
	showEndTime?: number;
	/** 活动展示了，是否可进入，判断当前时间是否在活动开启 */
	enable?: boolean;
	/** 当前时间不在有效时间之内 1.活动尚未开始 2.活动已经结束 */
	enableFlag?: number;
	/** 活动是否开启展示时间范围内 */
	showFlag?: boolean;
	/** 活动规则,多语言 */
	activityRuleI18nCode?: string;
	/** 活动描述,多语言 */
	activityDescI18nCode?: string;
	/** 无注释 */
	sort?: number;
}

export interface PageActivityBasePartRespVO {
	/** 无注释 */
	records?: ActivityBasePartRespVO[];
	/** 无注释 */
	total?: number;
	/** 无注释 */
	size?: number;
	/** 无注释 */
	current?: number;
	/** 无注释 */
	orders?: OrderItem[];
	/** 无注释 */
	optimizeCountSql?: boolean;
	/** 无注释 */
	searchCount?: boolean;
	/** 无注释 */
	optimizeJoinOfCountSql?: boolean;
	/** 无注释 */
	maxLimit?: number;
	/** 无注释 */
	countId?: string;
	/** 无注释 */
	pages?: number;
}

export interface ResponseVOPageActivityBasePartRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: PageActivityBasePartRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface ActivitySpinWheelAppReqVO {
	/** 无注释 */
	id?: string;
	/** 抽奖的段位，会员抽奖的段位奖项配置 */
	vipRankCode?: number;
}

export interface ResponseVOSiteActivityRewardSpinResponseVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SiteActivityRewardSpinResponseVO;
	/** 无注释 */
	ok?: boolean;
}

export interface SiteActivityRewardSpinResponseVO {
	/** 无注释 */
	siteCode?: string;
	/** vip段位 */
	rewardRank?: number;
	/** vip段位名称 */
	rewardRankName?: string;
	/** 奖品等级 */
	prizeLevel?: number;
	/** 奖品类型 */
	prizeType?: string;
	/** 奖品类型名称 */
	prizeTypeName?: string;
	/** 奖品名称 */
	prizeName?: string;
	/** 奖品价值 */
	prizeAmount?: number;
	/** 奖品展示图 */
	prizePictureUrl?: string;
	/** 无注释 */
	baseId?: string;
	/** 奖项配置id */
	id?: string;
}

export interface ActivitySpinWheelAppRespVO {
	/** 无注释 */
	id?: string;
	/** 无注释 */
	activityNameI18nCode?: string;
	/** 无注释 */
	activityTemplate?: string;
	/** 无注释 */
	entrancePictureI18nCode?: string;
	/** 无注释 */
	entrancePicturePcI18nCode?: string;
	/** 无注释 */
	headPictureI18nCode?: string;
	/** 无注释 */
	headPicturePcI18nCode?: string;
	/** 无注释 */
	activityDeadline?: number;
	/** 活动开始时间 */
	activityStartTime?: number;
	/** 活动结束时间 */
	activityEndTime?: number;
	/** 无注释 */
	showStartTime?: number;
	/** 无注释 */
	showEndTime?: number;
	/** 活动展示了，是否可进入，判断当前时间是否在活动开启 */
	enable?: boolean;
	/** 当前时间不在有效时间之内 1.活动尚未开始 2.活动已经结束 */
	enableFlag?: number;
	/** 活动是否开启展示时间范围内 */
	showFlag?: boolean;
	/** 活动规则,多语言 */
	activityRuleI18nCode?: string;
	/** 活动描述,多语言 */
	activityDescI18nCode?: string;
	/** 无注释 */
	sort?: number;
	/** 剩余抽奖次数 */
	balanceCount?: number;
	/** 奖金总计 */
	totalAmount?: number;
	/** bronze转盘活动奖励详情配置 */
	bronze?: SiteActivityRewardSpinResponseVO[];
	/** silver转盘活动奖励详情配置 */
	silver?: SiteActivityRewardSpinResponseVO[];
	/** gold转盘活动奖励详情配置 */
	gold?: SiteActivityRewardSpinResponseVO[];
	/** vip段位配置 */
	vipRankConfig?: SiteVIPRankResVO[];
	/** vip等级 */
	vipGradeCode?: number;
	/** vip等级名称 */
	vipGradeCodeName?: string;
	/** vip段位 */
	vipRankCode?: number;
	/** vip段位名称 */
	vipRankCodeName?: string;
}

export interface I18nMsgFrontVO {
	/** 无注释 */
	messageKey?: string;
	/** 无注释 */
	message?: string;
	/** 无注释 */
	messageFileUrl?: string;
	/** 无注释 */
	language?: string;
	/** 语言名称 */
	languageName?: string;
	/** 展示code */
	showCode?: string;
	/** 展示iconUrl */
	iconUrl?: string;
}

export interface ResponseVOActivitySpinWheelAppRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: ActivitySpinWheelAppRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface SiteVIPRankResVO {
	/** 主键 */
	id?: string;
	/** VIP段位code */
	vipRankCode?: number;
	/** VIP等级列表 */
	vipGradeList?: number[];
	/** VIP等级对应最小等级 */
	minVipGrade?: number;
	/** VIP等级对应最小等级名称 */
	minVipGradeName?: string;
	/** VIP等级对应最大等级 */
	maxVipGrade?: number;
	/** VIP等级对应最大等级名称 */
	maxVipGradeName?: string;
	/** VIP段位名称 */
	vipRankName?: string;
	/** vip段位名称i18Code */
	vipRankNameI18nCode?: string;
	/** 多语言list */
	vipRankNameI18nCodeList?: I18nMsgFrontVO[];
	/** VIP段位图标 */
	vipIcon?: string;
}

export interface ResponseVOListCodeValueVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: CodeValueVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface ResponseVOUserVIPInfoVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: UserVIPInfoVO;
	/** 无注释 */
	ok?: boolean;
}

export interface SiteVIPBenefitVO {
	/** vip段位code */
	vipRankCode?: number;
	/** vip段位名称i18Code */
	vipRankNameI18nCode?: string;
	/** vip段位对应等级最小值 */
	minVipGrade?: number;
	/** vip段位对应等级最小值名称 */
	minVipGradeName?: string;
	/** vip段位对应等级最大值 */
	maxVipGrade?: number;
	/** vip段位对应等级最大值名称 */
	maxVipGradeName?: string;
	/** 升级奖金(0:没有,1:锁,2:未锁) */
	upgradeFlag?: number;
	/** 升级奖金 */
	upgrade?: number;
	/** 周流水奖金(0:没有,1:锁,2:未锁) */
	weekAmountFlag?: number;
	/** 周流水比例1 */
	weekAmountProp1?: number;
	/** 周流水比例2 */
	weekAmountProp2?: number;
	/** 月流水比例1 */
	monthAmountProp1?: number;
	/** 月流水比例2 */
	monthAmountProp2?: number;
	/** 月流水奖金(0:没有,1:锁,2:未锁) */
	monthAmountFlag?: number;
	/** 周体育奖金(0:没有,1:锁,2:未锁) */
	weekSportFlag?: number;
	/** 加密货币提款手续费(0:没有,1:锁,2:未锁) */
	encryCoinFee?: number;
	/** 周体育奖金明细 */
	vipWeekSportVOS?: SiteVIPWeekSportVO[];
	/** 豪华礼品(0:没有,1:锁,2:未锁) */
	luxuriousGiftsFlag?: number;
	/** VIP专属福利(0:没有,1:锁,2:未锁) */
	svipWelfareFlag?: number;
	/** 幸运转盘(0:没有,1:锁,2:未锁) */
	luckFlag?: number;
	/** 幸运转盘对应最小VIP等级 */
	luckMinVipGradeName?: string;
}

export interface SiteVIPWeekSportVO {
	/** 周体育左范围 */
	weekSportMin?: number;
	/** 周体育右范围 (0代表以上) */
	weekSportMax?: number;
	/** 周体育奖金 */
	weekSportBonus?: number;
}

export interface UserVIPInfoVO {
	/** 无注释 */
	id?: string;
	/** 会员ID */
	userAccount?: string;
	/** vip当前等级段位 */
	vipRank?: number;
	/** vip下一个等级段位 */
	nextVipRank?: number;
	/** vip当前等级 */
	vipGradeCode?: number;
	/** vip当前等级名称 */
	vipGradeName?: string;
	/** vip升级后的等级 */
	vipGradeUp?: number;
	/** vip升级后的等级名称 */
	vipGradeUpName?: string;
	/** 用户头像标识 */
	avatarCode?: string;
	/** 体育类游戏积分经验 */
	sportExe?: number;
	/** 当前经验值 */
	currentExp?: number;
	/** 当前等级经验值 */
	currentVipExp?: number;
	/** 当前段位福利 */
	vipBenefit?: SiteVIPBenefitVO[];
}

export interface ResponseVOSiteVIPSystemVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SiteVIPSystemVO;
	/** 无注释 */
	ok?: boolean;
}

export interface SiteVIPGradeVO {
	/** VIP等级code */
	vipGradeCode?: number;
	/** VIP等级名称 */
	vipGradeName?: string;
	/** VIP段位code */
	vipRankCode?: number;
	/** vip段位名称 */
	vipRankName?: string;
	/** 升级条件所需XP */
	upgradeXp?: number;
	/** 晋级礼金 */
	upgradeBonus?: number;
	/** 图标 */
	picIcon?: string;
	/** 完整图标地址 */
	picIconImage?: string;
}

export interface SiteVIPSystemRankVO {
	/** vip段位名称i18Code */
	vipRankCode?: number;
	/** vip段位名称i18Code */
	vipRankNameI18nCode?: string;
	/** VIP等级左边范围值code */
	minVipGrade?: number;
	/** VIP等级左边范围值Name */
	minVipGradeName?: string;
	/** VIP等级右边范围值code */
	maxVipGrade?: number;
	/** VIP等级右边范围值name */
	maxVipGradeName?: string;
	/** 多语言-VIP段位名称 */
	siteVIPGradeVOList?: SiteVIPGradeVO[];
}

export interface SiteVIPSystemVO {
	/** 当前VIP段位 */
	currentVIPRankCode?: number;
	/** 当前VIP等级 */
	currentVIPGradeCode?: number;
	/** 无注释 */
	siteVIPSystemRankVOList?: SiteVIPSystemRankVO[];
}

export interface ResponseVOSystemVersionManagerRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SystemVersionManagerRespVO;
	/** 无注释 */
	ok?: boolean;
}

export interface SystemVersionManagerRespVO {
	/** 主键，唯一标识每条记录 */
	id?: string;
	/** 站点编码 */
	siteCode?: string;
	/** 站点名称 */
	siteName?: string;
	/** 平台类型 */
	deviceTerminal?: number;
	/** 平台类型 */
	deviceTerminalText?: string;
	/** 版本名称 */
	versionName?: string;
	/** 版本代码 */
	versionCode?: string;
	/** 版本号 */
	versionNumber?: string;
	/** 文件大小（字节） */
	fileSize?: number;
	/** 文件地址 */
	fileUrl?: string;
	/** 文件下载地址-展示用 */
	fileShowUrl?: string;
	/** 更新状态 0.最新版本,1.提示升级,2.强制升级 */
	versionUpdateStatus?: number;
	/** 更新状态 */
	versionUpdateStatusText?: string;
	/** 更新描述 */
	updateDescription?: string;
}

export interface ResponseVOListSiteUserAvatarConfigRespVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SiteUserAvatarConfigRespVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface SiteUserAvatarConfigRespVO {
	/** 主键 */
	id?: string;
	/** 头像id */
	avatarId?: string;
	/** 站点代码 */
	siteCode?: string;
	/** 头像名称 */
	avatarName?: string;
	/** 头像图片地址 */
	avatarImageUrl?: string;
	/** 图片完整地址-只做展示用 */
	avatarImageUrlFileUrl?: string;
	/** 启用/禁用状态 */
	status?: number;
	/** 启用/禁用状态 */
	statusText?: string;
	/** 有无被使用0.否,1.是(决定是否禁用删除,禁用状态) */
	isUsed?: number;
	/** 有无被使用 */
	isUsedText?: string;
	/** 创建人 */
	creator?: string;
	/** 创建时间 */
	createdTime?: number;
	/** 修改人 */
	updater?: string;
	/** 修改时间 */
	updatedTime?: string;
}

export interface ResponseVOListSiteActivityLabsVO {
	/** 返回码 */
	code?: number;
	/** 返回信息 */
	message?: string;
	/** 链路id */
	transactionId?: string;
	/** 无注释 */
	data?: SiteActivityLabsVO[];
	/** 无注释 */
	ok?: boolean;
}

export interface SiteActivityLabsVO {
	/** id */
	id?: string;
	/** 活动页签名称-分页用 */
	labNameI18Code?: string;
	/** 页签名称-详情用 */
	labName?: string;
	/** 页签名称-多语言集合 */
	labNameList?: I18nMsgFrontVO[];
	/** 备注 */
	remark?: string;
	/** 状态名称 */
	statusText?: string;
	/** 排序 */
	sort?: number;
	/** 创建人 */
	creator?: string;
	/** 创建时间 */
	createdTime?: number;
	/** 修改人 */
	updater?: string;
	/** 修改时间 */
	updatedTime?: number;
}
