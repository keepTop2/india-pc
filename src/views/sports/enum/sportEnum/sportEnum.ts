/**
 * 体育项目
 */
export enum SportTypeEnum {
	/**
	 * 足球
	 */
	FootBall = 1,

	/**
	 * 篮球
	 */
	Basketball = 2,

	/**
	 * 美式足球
	 */
	AmericanSoccer = 3,

	/**
	 * 冰上曲棍球
	 */
	IceHockey = 4,

	/**
	 * 网球
	 */
	Tennis = 5,

	/**
	 * 排球
	 */
	Volleyball = 6,

	/**
	 * 斯诺克/台球
	 */
	Billiards = 7,

	/**
	 * 棒球
	 */
	Baseball = 8,

	/**
	 * 羽毛球
	 */
	Badminton = 9,

	/**
	 * 电子竞技
	 */
	ESports = 43,
}

/**
 * 注单状态
 * half won / half lose / won / lose / void / running / draw / reject / refund / waiting
 */
export enum SportStatusEnum {
	/**
	 * 半赢
	 */
	HalfWon = "half won",
	/**
	 * 半输
	 */
	HalfLose = "half lose",
	/**
	 * 赢
	 */
	Won = "won",
	/**
	 * 输
	 */
	Lose = "lose",
	/**
	 * 作废
	 */
	Void = "void",
	/**
	 * 进行中
	 */
	Running = "running",
	/**
	 * 和局
	 */
	Draw = "draw",
	/**
	 * 已取消
	 */
	Reject = "reject",
	/**
	 * 退款
	 */
	Refund = "refund",
	/**
	 * 等待中
	 */
	Waiting = "waiting",
}

/**
 * 赛事状态
 * running/ closed/ postponed/ deleted
 */
export enum SportEventStatusEnum {
	/**
	 * 正在运行
	 */
	Running = "running",
	/**
	 * 已关闭
	 */
	Closed = "closed",
	/**
	 * 已推迟
	 */
	Postponed = "postponed",
	/**
	 * 已删除
	 */
	Deleted = "deleted",
}

/**
 * 盘口状态
 * running/ suspend/ closeprice/ closed
 */
export enum SportMarketStatusEnum {
	/**
	 * 盘口开启可下注
	 */
	Running = "running",
	/**
	 * 盘口暂时关闭 (游戏前端可见赔率但无法下注)
	 */
	Suspend = "suspend",
	/**
	 * 盘口暂时关闭 (赔率隐藏且该下注区域可闪烁提示玩家。賠率關閉原因可能因进球, 红牌或是其他任何事件让球赛中断)
	 */
	Closeprice = "closeprice",
	/**
	 * 盘口关闭
	 */
	Closed = "closed",
}

/**
 * 右侧面板头部切换
 * 比分板
 * 视频源
 * 动画源
 */
export enum SportControlEnum {
	/**
	 * 赛事详情
	 */
	Info = "detail",

	/**
	 * 视频播放源
	 */
	Video = "video",

	/**
	 * 动画直播播放源
	 */
	Animation = "animation",
}
