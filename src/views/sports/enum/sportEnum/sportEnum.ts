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

/**
 * 投注类型
 */
export enum SportBetTypeEnum {
	/**
	 * 让球
	 */
	betType_1 = 1,
	/**
	 * 单双盘
	 */
	betType_2 = 2,
	/**
	 * 大小盘
	 */
	betType_3 = 3,
	/**
	 * 全场, 独赢盘
	 */
	betType_5 = 5,
	/**
	 * 总进球
	 */
	betType_6 = 6,
	/**
	 * 上半场, 让球
	 */
	betType_7 = 7,
	/**
	 * 上半场, 大小盘
	 */
	betType_8 = 8,
	/**
	 * 上半场, 单双盘
	 */
	betType_12 = 12,
	/**
	 * 零失球
	 */
	betType_13 = 13,
	/**
	 * 最先进球/最后进球
	 */
	betType_14 = 14,
	/**
	 * 上半场, 独赢盘
	 */
	betType_15 = 15,
	/**
	 * 半场/全场
	 */
	betType_16 = 16,
	/**
	 * 下半场让球
	 */
	betType_17 = 17,
	/**
	 * 下半场大小盘
	 */
	betType_18 = 18,
	/**
	 * 胜负盘
	 */
	betType_20 = 20,
	/**
	 * 上半场胜负盘
	 */
	betType_21 = 21,
	/**
	 * 得下一分
	 */
	betType_22 = 22,
	/**
	 * 双重机会
	 */
	betType_24 = 24,
	/**
	 * 获胜球
	 */
	betType_25 = 25,
	/**
	 * 双方/一方/两者皆不得分
	 */
	betType_26 = 26,
	/**
	 * 零失球的胜方
	 */
	betType_27 = 27,
	/**
	 * 三项让分投注
	 */
	betType_28 = 28,
	/**
	 * 主队不获胜
	 */
	betType_121 = 121,
	/**
	 * 客队不获胜
	 */
	betType_122 = 122,
	/**
	 * 和局/不是和局
	 */
	betType_123 = 123,
	/**
	 * 全场 1X2 亚洲盘
	 */
	betType_124 = 124,
	/**
	 * 上半场 1X2 亚洲盘
	 */
	betType_125 = 125,
	/**
	 * 上半场总进球
	 */
	betType_126 = 126,
	/**
	 * 上半场最先进球/最后进球
	 */
	betType_127 = 127,
	/**
	 * 半场/全场 单/双
	 */
	betType_128 = 128,
	/**
	 * 主队胜出上下半场
	 */
	betType_133 = 133,
	/**
	 * 客队胜出上下半场
	 */
	betType_134 = 134,
	/**
	 * 点球决胜
	 */
	betType_135 = 135,
	/**
	 * 进球最多的半场
	 */
	betType_140 = 140,
	/**
	 * 主队进球最多的半场
	 */
	betType_141 = 141,
	/**
	 * 客队进球最多的半场
	 */
	betType_142 = 142,
	/**
	 * 上半场赛果/总进球数
	 */
	betType_143 = 143,
	/**
	 * 赛果 / 总进球大小
	 */
	betType_144 = 144,
	/**
	 * 两队都进球
	 */
	betType_145 = 145,
	/**
	 * 下半场两队皆进球
	 */
	betType_146 = 146,
	/**
	 * 主队两个半场皆进球
	 */
	betType_147 = 147,
	/**
	 * 客队两个半场皆进球
	 */
	betType_148 = 148,
	/**
	 * 主队胜出其中一个半场
	 */
	betType_149 = 149,
	/**
	 * 客队胜出其中一个半场
	 */
	betType_150 = 150,
	/**
	 * 上半场双重机会
	 */
	betType_151 = 151,
	/**
	 * 上半场/全场波胆
	 */
	betType_152 = 152,
	/**
	 * 局数获胜者
	 */
	betType_153 = 153,
	/**
	 * 第 x 盘获胜者
	 */
	betType_154 = 154,
	/**
	 * 第 x 盘局数获胜者
	 */
	betType_155 = 155,
	/**
	 * 第 x 盘局数大小盘
	 */
	betType_156 = 156,
	/**
	 * 准确的总进球
	 */
	betType_159 = 159,
	/**
	 * 下一个进球
	 */
	betType_160 = 160,
	/**
	 * 准确的主队总进球
	 */
	betType_161 = 161,
	/**
	 * 准确的客队总进球
	 */
	betType_162 = 162,
	/**
	 * 赛果 / 总进球大小
	 */
	betType_163 = 163,
	/**
	 * 加时赛下一个进球
	 */
	betType_164 = 164,
	/**
	 * 加时赛上半场波胆
	 */
	betType_165 = 165,
	/**
	 * 加时赛波胆
	 */
	betType_166 = 166,
	/**
	 * 加时赛上半场独赢盘
	 */
	betType_167 = 167,
	/**
	 * 哪一队可晋级
	 */
	betType_168 = 168,
	/**
	 * 下一个进球时间
	 */
	betType_169 = 169,
	/**
	 * 哪队进球
	 */
	betType_170 = 170,
	/**
	 * 净胜球数
	 */
	betType_171 = 171,
	/**
	 * 赛果 /最先进球的球队
	 */
	betType_172 = 172,
	/**
	 * 加时赛 – 是/否
	 */
	betType_173 = 173,
	/**
	 * 加时赛/进球
	 */
	betType_174 = 174,
	/**
	 * 获胜的方式
	 */
	betType_175 = 175,
	/**
	 * 前 10 分钟独赢盘
	 */
	betType_176 = 176,
	/**
	 * 下半场独赢盘
	 */
	betType_177 = 177,
	/**
	 * 下半场大小盘
	 */
	betType_178 = 178,
	/**
	 * 准确的上半场总进球
	 */
	betType_179 = 179,
	/**
	 * 上半场下一个进球
	 */
	betType_180 = 180,
	/**
	 * 上半场准确的主队进球
	 */
	betType_181 = 181,
	/**
	 * 上半场准确的客队进球
	 */
	betType_182 = 182,
	/**
	 * 下半场单双盘
	 */
	betType_184 = 184,
	/**
	 * 下半场获胜球队
	 */
	betType_185 = 185,
	/**
	 * 下半场双重机会
	 */
	betType_186 = 186,
	/**
	 * 准确的下半场总进球
	 */
	betType_187 = 187,
	/**
	 * 上半场两队皆进球
	 */
	betType_188 = 188,
	/**
	 * 两个半场大 1.5 球 – 是/否
	 */
	betType_189 = 189,
	/**
	 * 两个半场小 1.5 球 – 是/否
	 */
	betType_190 = 190,
	/**
	 * 上半场获胜球队
	 */
	betType_191 = 191,
	/**
	 * 特定时间的第一个进球 (10 分钟)
	 */
	betType_192 = 192,
	/**
	 * 特定时间的第一个进球 (15 分钟)
	 */
	betType_193 = 193,
	/**
	 * 角球单双盘
	 */
	betType_194 = 194,
	/**
	 * 主队准确的角球
	 */
	betType_195 = 195,
	/**
	 * 客队准确的角球
	 */
	betType_196 = 196,
	/**
	 * 主队角球数大小盘
	 */
	betType_197 = 197,
	/**
	 * 客队角球数大小盘
	 */
	betType_198 = 198,
	/**
	 * 角球总数
	 */
	betType_199 = 199,
	/**
	 * 上半场主队准确的角球数
	 */
	betType_200 = 200,
	/**
	 * 上半场客队准确的角球数
	 */
	betType_201 = 201,
	/**
	 * 上半场总角球数
	 */
	betType_202 = 202,
	/**
	 * 上半场角球单双盘
	 */
	betType_203 = 203,
	/**
	 * 上半场主队角球数大小盘
	 */
	betType_204 = 204,
	/**
	 * 上半场客队角球数大小盘
	 */
	betType_205 = 205,
	/**
	 * 第一个角球
	 */
	betType_206 = 206,
	/**
	 * 上半场第一个角球
	 */
	betType_207 = 207,
	/**
	 * 最后一个角球
	 */
	betType_208 = 208,
	/**
	 * 上半场最后一个角球
	 */
	betType_209 = 209,
	/**
	 * 球员驱逐离场
	 */
	betType_210 = 210,
	/**
	 * 上半场球员驱逐离场
	 */
	betType_211 = 211,
	/**
	 * 主队球员驱逐离场
	 */
	betType_212 = 212,
	/**
	 * 上半场主队球员驱逐离场
	 */
	betType_213 = 213,
	/**
	 * 客队球员驱逐离场
	 */
	betType_214 = 214,
	/**
	 * 上半场客队球员驱逐离场
	 */
	betType_215 = 215,
	/**
	 * 第 X 局让分盘
	 */
	betType_219 = 219,
	/**
	 * 第 X 局大小
	 */
	betType_220 = 220,
	/**
	 * 下一分钟
	 */
	betType_221 = 221,
	/**
	 * 下五分钟
	 */
	betType_222 = 222,
	/**
	 * 下一分钟首先会发生什么
	 */
	betType_223 = 223,
	/**
	 * 下五分钟首先会发生什么
	 */
	betType_224 = 224,
	/**
	 * 下一分钟定位球
	 */
	betType_225 = 225,
	/**
	 * 下一分钟首先会发生哪个组合
	 */
	betType_226 = 226,
	/**
	 * 下五分钟首先会发生哪个组合
	 */
	betType_227 = 227,
	/**
	 * 点球决战-结果组合（前十）
	 */
	betType_376 = 376,
	/**
	 * 客队点球决胜 – 第 X 轮
	 */
	betType_381 = 381,
	/**
	 * 主队点球决胜 – 第 X 轮
	 */
	betType_382 = 382,
	/**
	 * 点球决胜击中门柱 – 第 X 轮
	 */
	betType_383 = 383,
	/**
	 * 点球决胜双方/一方/两者皆不 – 第 X 轮
	 */
	betType_384 = 384,
	/**
	 * 点球决胜独赢盘 – 第 X 轮
	 */
	betType_385 = 385,
	/**
	 * 点球决胜 – 客队大小盘 (前十)
	 */
	betType_386 = 386,
	/**
	 * 点球决胜 – 主队大小盘 (前十)
	 */
	betType_387 = 387,
	/**
	 * 点球决胜 – 客队大小盘 (最后赛果)
	 */
	betType_388 = 388,
	/**
	 * 点球决胜 – 主队大小盘 (最后赛果)
	 */
	betType_389 = 389,
	/**
	 * 点球大战骤死赛
	 */
	betType_390 = 390,
	/**
	 * 点球决胜 – 准确的总进球(前十)
	 */
	betType_391 = 391,
	/**
	 * 点球决胜 – 波胆
	 */
	betType_392 = 392,
	/**
	 * 点球决胜 – 单双盘 (前十)
	 */
	betType_393 = 393,
	/**
	 * 点球决胜 – 单双盘 (最后 赛果)
	 */
	betType_394 = 394,
	/**
	 * 加时赛下一个进球方式
	 */
	betType_395 = 395,
	/**
	 * 加时赛下一个进球
	 */
	betType_396 = 396,
	/**
	 * 加时赛净胜球数
	 */
	betType_397 = 397,
	/**
	 * 加时赛双重机会
	 */
	betType_398 = 398,
	/**
	 * 加时赛波胆
	 */
	betType_399 = 399,
	/**
	 * 加时赛单双盘
	 */
	betType_400 = 400,
	/**
	 * 主队大小盘
	 */
	betType_401 = 401,
	/**
	 * 客队大小盘
	 */
	betType_402 = 402,
	/**
	 * 上半场主队大小盘
	 */
	betType_403 = 403,
	/**
	 * 上半场客队大小盘
	 */
	betType_404 = 404,
	/**
	 * 下半场波胆
	 */
	betType_405 = 405,
	/**
	 * 准确的总进球
	 */
	betType_406 = 406,
	/**
	 * 准确的主队总进球
	 */
	betType_407 = 407,
	/**
	 * 净胜球数
	 */
	betType_408 = 408,
	/**
	 * 准确的客队总进球
	 */
	betType_409 = 409,
	/**
	 * 上半场双重机会
	 */
	betType_410 = 410,
	/**
	 * 上半场获胜球队
	 */
	betType_411 = 411,
	/**
	 * 准确的上半场总进球
	 */
	betType_412 = 412,
	/**
	 * 波胆
	 */
	betType_413 = 413,
	/**
	 * 上半场波胆
	 */
	betType_414 = 414,
	/**
	 * 赛果 /最先进球的球队
	 */
	betType_415 = 415,
	/**
	 * 上半场/全场波胆
	 */
	betType_416 = 416,
	/**
	 * 两队皆进球/赛果
	 */
	betType_417 = 417,
	/**
	 * 两队皆进球/总进球数
	 */
	betType_418 = 418,
	/**
	 * 预测进第一个球的半场
	 */
	betType_419 = 419,
	/**
	 * 主队于哪个半场先进球
	 */
	betType_420 = 420,
	/**
	 * 客队于哪个半场先进球
	 */
	betType_421 = 421,
	/**
	 * 最先进两个球的球队
	 */
	betType_422 = 422,
	/**
	 * 最先进三个球的球队
	 */
	betType_423 = 423,
	/**
	 * 第一个进球方式
	 */
	betType_424 = 424,
	/**
	 * 落后反超获胜的球队
	 */
	betType_425 = 425,
	/**
	 * 上半场净胜球数
	 */
	betType_426 = 426,
	/**
	 * 上半场两队皆进球
	 */
	betType_427 = 427,
	/**
	 * 下半场单双盘
	 */
	betType_428 = 428,
	/**
	 * 准确的下半场总进球
	 */
	betType_429 = 429,
	/**
	 * 下半场独赢盘
	 */
	betType_430 = 430,
	/**
	 * 下半场双重机会
	 */
	betType_431 = 431,
	/**
	 * 下半场获胜球队
	 */
	betType_432 = 432,
	/**
	 * 下半场两队皆进球
	 */
	betType_433 = 433,
	/**
	 * 两个半场大 1.5 球 – 是/否
	 */
	betType_434 = 434,
	/**
	 * 两个半场小 1.5 球 – 是/否
	 */
	betType_435 = 435,
	/**
	 * 主队两个半场皆进球
	 */
	betType_436 = 436,
	/**
	 * 客队两个半场皆进球
	 */
	betType_437 = 437,
	/**
	 * 主队胜出上下半场
	 */
	betType_438 = 438,
	/**
	 * 客队胜出上下半场
	 */
	betType_439 = 439,
	/**
	 * 主队胜出其中一个半场
	 */
	betType_440 = 440,
	/**
	 * 客队胜出其中一个半场
	 */
	betType_441 = 441,
	/**
	 * 进球最多的半场
	 */
	betType_442 = 442,
	/**
	 * 主队进球最多的半场
	 */
	betType_443 = 443,
	/**
	 * 客队进球最多的半场
	 */
	betType_444 = 444,
	/**
	 * 两队皆进球上半场/下半场
	 */
	betType_445 = 445,
	/**
	 * 主队均进球上半场/下半场
	 */
	betType_446 = 446,
	/**
	 * 客队均进球上半场/下半场
	 */
	betType_447 = 447,
	/**
	 * 最后进球的球队
	 */
	betType_448 = 448,
	/**
	 * 双重机会/总进球数
	 */
	betType_449 = 449,
	/**
	 * 单双盘/总进球数
	 */
	betType_450 = 450,
	/**
	 * 两队皆进球/双重机会
	 */
	betType_451 = 451,
	/**
	 * 进球最多的半场(双项)
	 */
	betType_452 = 452,
	/**
	 * 上半场三项让分投注
	 */
	betType_453 = 453,
	/**
	 * 第一个进球时段
	 */
	betType_455 = 455,
	/**
	 * 上半场两队皆进球/赛果
	 */
	betType_456 = 456,
	/**
	 * 上半场两队皆进球/总进球数
	 */
	betType_457 = 457,
	/**
	 * 全场亚洲 独赢盘
	 */
	betType_458 = 458,
	/**
	 * 上半场亚洲 独赢盘
	 */
	betType_459 = 459,
	/**
	 * 哪个球队会赢 5+球
	 */
	betType_460 = 460,
	/**
	 * 主队大小盘
	 */
	betType_461 = 461,
	/**
	 * 客队大小盘
	 */
	betType_462 = 462,
	/**
	 * 上半场主队大小盘
	 */
	betType_463 = 463,
	/**
	 * 上半场客队大小盘
	 */
	betType_464 = 464,
	/**
	 * 半场/全场准确总进球
	 */
	betType_467 = 467,
}
