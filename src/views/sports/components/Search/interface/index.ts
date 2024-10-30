export interface SearchResultType {
	sportIcon: string; // 体育图标
	title: string; // 比赛标题
	subtitle: string; // 比赛副标题
	leagueId?: string | number; // 联赛ID
	eventId?: string | number; // 事件ID
	leagueIconUrl?: string; // 联赛图标URL
	leagueName: string; // 联赛名称
	teamInfo: {
		// 队伍信息
		homeName: string; // 主队名称
		awayName: string; // 客队名称
	};
	gameInfo?: {
		// 比赛信息
		livePeriod?: number; // 当前比赛阶段
		delayLive?: boolean; // 是否延迟直播
		isHt?: boolean; // 是否为中场
		seconds?: number; // 剩余秒数
		liveHomeScore?: number; // 主队实时比分
		liveAwayScore?: number; // 客队实时比分
	};
	globalShowTime?: string | number; // 全球显示时间
}
