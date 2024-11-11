/**
 * @description 玩法结构代码类型
 */
export enum StructCode {
	SMP_LMP = "smp_lmp", // 双面盘
	SMP_GYHE = "smp_gyhe", // 冠亚和
	SMP_1TO10 = "smp_1to10", // 1-10名
}

/**
 * @description 游戏玩法代码类型
 */
export type GamePlayCode =
	| "smp_gyjh_dxds" // 冠亚军和
	| "smp_gyh3d19" // 冠亚和值
	| "smp_d1d10gj" // 冠军
	| "smp_zhgj" // 冠军玩法
	| "smp_d1d10yj" // 亚军
	| "smp_zhyj" // 亚军玩法
	| "smp_d1d10d3m" // 第三名
	| "smp_zhd3m" // 第三名玩法
	| "smp_d1d10d4m" // 第四名
	| "smp_zhd4m" // 第四名玩法
	| "smp_d1d10d5m" // 第五名
	| "smp_zhd5m" // 第五名玩法
	| "smp_d1d10d6m" // 第六名
	| "smp_zhd6m" // 第六名玩法
	| "smp_d1d10d7m" // 第七名
	| "smp_zhd7m" // 第七名玩法
	| "smp_d1d10d8m" // 第八名
	| "smp_zhd8m" // 第八名玩法
	| "smp_d1d10d9m" // 第九名
	| "smp_zhd9m" // 第九名玩法
	| "smp_d1d10d10m" // 第十名
	| "smp_zhd10m"; // 第十名玩法
